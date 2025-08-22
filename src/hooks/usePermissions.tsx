import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { Permission, UserRole, PermissionAction } from '@/types/tenant';
import { supabase } from '@/integrations/supabase/client';

interface PermissionCheck {
  resource: string;
  action: PermissionAction;
  attributes?: Record<string, any>;
}

interface UsePermissionsReturn {
  permissions: Permission[];
  userRole: UserRole | null;
  isLoading: boolean;
  hasPermission: (check: PermissionCheck) => boolean;
  hasAnyPermission: (checks: PermissionCheck[]) => boolean;
  hasAllPermissions: (checks: PermissionCheck[]) => boolean;
  canAccessModule: (module: string) => boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.id || !tenant?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get user's role and permissions for the current tenant
        const { data: tenantUser, error: tenantUserError } = await supabase
          .from('tenant_users')
          .select('role, permissions')
          .eq('user_id', user.id)
          .eq('tenant_id', tenant.id)
          .eq('is_active', true)
          .single();

        if (tenantUserError) {
          console.error('Error fetching tenant user:', tenantUserError);
          setIsLoading(false);
          return;
        }

        if (!tenantUser) {
          setIsLoading(false);
          return;
        }

        setUserRole(tenantUser.role as UserRole);

        // Fetch detailed permission information
        if (tenantUser.permissions && tenantUser.permissions.length > 0) {
          const { data: permissionData, error: permissionError } = await supabase
            .from('permissions')
            .select('*')
            .in('id', tenantUser.permissions);

          if (permissionError) {
            console.error('Error fetching permissions:', permissionError);
          } else {
            setPermissions(permissionData as Permission[]);
          }
        }
      } catch (error) {
        console.error('Error in usePermissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user?.id, tenant?.id]);

  const hasPermission = (check: PermissionCheck): boolean => {
    if (!permissions.length) return false;

    return permissions.some(permission => {
      // Check if permission matches resource and action
      const matchesResource = permission.resource === check.resource;
      const matchesAction = permission.action === check.action;

      if (!matchesResource || !matchesAction) return false;

      // If no conditions specified, permission is granted
      if (!permission.conditions && !check.attributes) return true;

      // Check attribute-based conditions
      if (permission.conditions && check.attributes) {
        return checkAttributeConditions(permission.conditions, check.attributes);
      }

      return true;
    });
  };

  const checkAttributeConditions = (
    conditions: Record<string, any>,
    attributes: Record<string, any>
  ): boolean => {
    for (const [key, value] of Object.entries(conditions)) {
      if (attributes[key] !== value) {
        return false;
      }
    }
    return true;
  };

  const hasAnyPermission = (checks: PermissionCheck[]): boolean => {
    return checks.some(check => hasPermission(check));
  };

  const hasAllPermissions = (checks: PermissionCheck[]): boolean => {
    return checks.every(check => hasPermission(check));
  };

  const canAccessModule = (module: string): boolean => {
    if (!tenant?.settings?.features) return false;

    // Check if module is enabled for the tenant
    const moduleEnabled = tenant.settings.features[module as keyof typeof tenant.settings.features];
    if (!moduleEnabled) return false;

    // Check if user has any permission for this module
    return hasAnyPermission([
      { resource: module, action: 'read' },
      { resource: module, action: 'manage' }
    ]);
  };

  return {
    permissions,
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
  };
};

// Higher-order component for permission-based rendering
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: PermissionCheck
) => {
  return (props: P) => {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!hasPermission(requiredPermission)) {
      return <div>Access denied</div>;
    }

    return <Component {...props} />;
  };
};

// Hook for checking specific module access
export const useModuleAccess = (module: string) => {
  const { canAccessModule, isLoading } = usePermissions();

  return {
    canAccess: canAccessModule(module),
    isLoading,
  };
};
