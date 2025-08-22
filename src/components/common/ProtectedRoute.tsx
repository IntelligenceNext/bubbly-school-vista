import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionAction } from '@/types/tenant';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: PermissionAction;
    attributes?: Record<string, any>;
  };
  requiredRole?: string;
  requiredModule?: string;
  fallbackPath?: string;
  showLoading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  requiredModule,
  fallbackPath = '/auth/login',
  showLoading = true,
}) => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { tenant, isLoading: tenantLoading } = useTenant();
  const { hasPermission, userRole, isLoading: permissionLoading } = usePermissions();

  // Show loading state
  if (authLoading || tenantLoading || permissionLoading) {
    if (showLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    return null;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if tenant is loaded
  if (!tenant) {
    return <Navigate to="/auth/select-tenant" state={{ from: location }} replace />;
  }

  // Check if tenant is active
  if (tenant.status !== 'active') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Tenant Suspended</h2>
          <p className="text-gray-600">
            Your institution's account has been suspended. Please contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Check required role
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            You don't have the required role to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  // Check module access
  if (requiredModule) {
    const { canAccessModule } = usePermissions();
    if (!canAccessModule(requiredModule)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Module Not Available</h2>
            <p className="text-gray-600">
              This module is not available for your institution or you don't have access to it.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// Higher-order component for permission-based route protection
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  permission: {
    resource: string;
    action: PermissionAction;
    attributes?: Record<string, any>;
  }
) => {
  return (props: P) => (
    <ProtectedRoute requiredPermission={permission}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Higher-order component for role-based route protection
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  role: string
) => {
  return (props: P) => (
    <ProtectedRoute requiredRole={role}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Higher-order component for module-based route protection
export const withModule = <P extends object>(
  Component: React.ComponentType<P>,
  module: string
) => {
  return (props: P) => (
    <ProtectedRoute requiredModule={module}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
