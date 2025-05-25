
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
  user_count?: number;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permission_ids: string[];
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRoles:', error);
    toast({
      title: "Failed to fetch roles",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const getPermissions = async (): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPermissions:', error);
    toast({
      title: "Failed to fetch permissions",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const getRoleWithPermissions = async (roleId: string): Promise<RoleWithPermissions | null> => {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (roleError) {
      console.error('Error fetching role:', roleError);
      return null;
    }

    const { data: permissionsData, error: permissionsError } = await supabase
      .from('role_permissions')
      .select(`
        permissions (
          id,
          name,
          category,
          description
        )
      `)
      .eq('role_id', roleId);

    if (permissionsError) {
      console.error('Error fetching role permissions:', permissionsError);
      return null;
    }

    const { data: userCountData, error: userCountError } = await supabase
      .from('user_roles')
      .select('id', { count: 'exact' })
      .eq('role_id', roleId);

    const permissions = permissionsData?.map(item => item.permissions).filter(Boolean) || [];
    const userCount = userCountData?.length || 0;

    return {
      ...roleData,
      permissions: permissions as Permission[],
      user_count: userCount
    };
  } catch (error) {
    console.error('Error in getRoleWithPermissions:', error);
    return null;
  }
};

export const createRole = async (roleData: CreateRoleRequest): Promise<Role | null> => {
  try {
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert([{
        name: roleData.name,
        description: roleData.description,
        is_system_role: false
      }])
      .select()
      .single();

    if (roleError) {
      console.error('Error creating role:', roleError);
      toast({
        title: "Failed to create role",
        description: roleError.message,
        variant: "destructive",
      });
      return null;
    }

    // Add permissions to the role
    if (roleData.permission_ids.length > 0) {
      const rolePermissions = roleData.permission_ids.map(permissionId => ({
        role_id: role.id,
        permission_id: permissionId
      }));

      const { error: permissionsError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);

      if (permissionsError) {
        console.error('Error adding permissions to role:', permissionsError);
        // Clean up the created role if permission assignment fails
        await supabase.from('roles').delete().eq('id', role.id);
        toast({
          title: "Failed to assign permissions",
          description: permissionsError.message,
          variant: "destructive",
        });
        return null;
      }
    }

    toast({
      title: "Role created successfully",
      description: `Role "${roleData.name}" has been created`,
    });

    return role;
  } catch (error) {
    console.error('Error in createRole:', error);
    toast({
      title: "Failed to create role",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateRole = async (roleId: string, roleData: Partial<CreateRoleRequest>): Promise<boolean> => {
  try {
    // Update role basic info
    if (roleData.name || roleData.description) {
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: roleData.name,
          description: roleData.description,
        })
        .eq('id', roleId);

      if (roleError) {
        console.error('Error updating role:', roleError);
        toast({
          title: "Failed to update role",
          description: roleError.message,
          variant: "destructive",
        });
        return false;
      }
    }

    // Update permissions if provided
    if (roleData.permission_ids) {
      // Remove existing permissions
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      // Add new permissions
      if (roleData.permission_ids.length > 0) {
        const rolePermissions = roleData.permission_ids.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId
        }));

        const { error: permissionsError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (permissionsError) {
          console.error('Error updating permissions:', permissionsError);
          toast({
            title: "Failed to update permissions",
            description: permissionsError.message,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    toast({
      title: "Role updated successfully",
      description: "The role has been updated",
    });

    return true;
  } catch (error) {
    console.error('Error in updateRole:', error);
    toast({
      title: "Failed to update role",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteRole = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Failed to delete role",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Role deleted successfully",
      description: "The role has been deleted",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteRole:', error);
    toast({
      title: "Failed to delete role",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
