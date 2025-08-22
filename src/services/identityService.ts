import { supabase } from '@/integrations/supabase/client';
import { Tenant, TenantUser, UserRole, TenantInvitation } from '@/types/tenant';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  tenantCode?: string;
  invitationToken?: string;
}

export interface PasswordResetData {
  email: string;
  tenantCode?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export class IdentityService {
  // Authentication methods
  static async login(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      // If tenant code is provided, validate user's access to that tenant
      if (credentials.tenantCode && data.user) {
        const hasAccess = await this.validateTenantAccess(data.user.id, credentials.tenantCode);
        if (!hasAccess) {
          throw new Error('Access denied to this tenant');
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  }

  static async register(data: RegisterData) {
    try {
      // If invitation token is provided, validate it first
      if (data.invitationToken) {
        const invitation = await this.validateInvitation(data.invitationToken);
        if (!invitation) {
          throw new Error('Invalid or expired invitation');
        }
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (authData.user) {
        await this.createUserProfile(authData.user.id, {
          full_name: data.full_name,
          phone: data.phone,
        });

        // If invitation token exists, accept the invitation
        if (data.invitationToken) {
          await this.acceptInvitation(data.invitationToken, authData.user.id);
        }
      }

      return { success: true, data: authData };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error };
    }
  }

  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }
  }

  static async requestPasswordReset(data: PasswordResetData) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password?tenant=${data.tenantCode || ''}`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error };
    }
  }

  static async changePassword(data: ChangePasswordData) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error };
    }
  }

  // User profile methods
  static async createUserProfile(userId: string, profile: { full_name: string; phone?: string }) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          full_name: profile.full_name,
          phone: profile.phone,
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Create user profile error:', error);
      return { success: false, error };
    }
  }

  static async updateUserProfile(userId: string, profile: Partial<{ full_name: string; phone: string; avatar_url: string }>) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error };
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error };
    }
  }

  // Tenant management methods
  static async createTenant(tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create tenant error:', error);
      return { success: false, error };
    }
  }

  static async getTenantByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('code', code)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get tenant by code error:', error);
      return { success: false, error };
    }
  }

  static async validateTenantAccess(userId: string, tenantCode: string) {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) return false;

      const tenant = await this.getTenantByCode(tenantCode);
      if (!tenant.success || !tenant.data) return false;

      return data.tenant_id === tenant.data.id;
    } catch (error) {
      console.error('Validate tenant access error:', error);
      return false;
    }
  }

  // Invitation methods
  static async createInvitation(invitationData: Omit<TenantInvitation, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .insert(invitationData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create invitation error:', error);
      return { success: false, error };
    }
  }

  static async validateInvitation(token: string) {
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('id', token)
        .eq('status', 'pending')
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Validate invitation error:', error);
      return null;
    }
  }

  static async acceptInvitation(token: string, userId: string) {
    try {
      const invitation = await this.validateInvitation(token);
      if (!invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Create tenant user assignment
      const { error: assignmentError } = await supabase
        .from('tenant_users')
        .insert({
          tenant_id: invitation.tenant_id,
          user_id: userId,
          role: invitation.role,
          is_active: true,
        });

      if (assignmentError) throw assignmentError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('id', token);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Accept invitation error:', error);
      return { success: false, error };
    }
  }

  // Session management
  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get current session error:', error);
      return { success: false, error };
    }
  }

  static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Refresh session error:', error);
      return { success: false, error };
    }
  }
}
