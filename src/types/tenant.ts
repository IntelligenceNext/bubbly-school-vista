export interface Tenant {
  id: string;
  name: string;
  code: string;
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'enterprise';
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  features: {
    academic: boolean;
    accounting: boolean;
    transportation: boolean;
    hostel: boolean;
    library: boolean;
    activities: boolean;
    examination: boolean;
    tickets: boolean;
  };
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    custom_domain?: string;
  };
  limits: {
    max_students: number;
    max_staff: number;
    max_storage_gb: number;
  };
}

export interface TenantContext {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  permissions: string[];
  attributes: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'super_admin'      // System-wide administrator
  | 'tenant_admin'     // Institution-level administrator
  | 'school_admin'     // School-level administrator
  | 'staff'           // General staff member
  | 'teacher'         // Teacher with specific permissions
  | 'student'         // Student user
  | 'parent'          // Parent user
  | 'guest';          // Limited access user

export interface Permission {
  id: string;
  name: string;
  category: PermissionCategory;
  description: string;
  resource: string;
  action: PermissionAction;
  conditions?: Record<string, any>;
}

export type PermissionCategory = 
  | 'academic'
  | 'accounting'
  | 'administration'
  | 'student_management'
  | 'staff_management'
  | 'transportation'
  | 'hostel'
  | 'library'
  | 'activities'
  | 'examination'
  | 'system';

export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'export'
  | 'import';

export interface Role {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantInvitation {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}
