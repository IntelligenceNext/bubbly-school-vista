# EduCloud Multi-Tenant Architecture Implementation

## Overview

This document outlines the implementation of EduCloud's cloud SaaS platform with multi-tenant architecture, role-based access control (RBAC), attribute-based access control (ABAC), and identity server functionality.

## 1. Multi-Tenant Architecture & Roles

### 1.1 Multi-Tenancy Overview

Each institution (school/college) is a separate tenant in the system with complete data isolation:

- **Tenant Isolation**: All data, users, and configurations are logically separated by tenant ID
- **Security**: Critical for security to ensure one school cannot access another's data
- **Scalability**: Supports multiple institutions on a single platform

### 1.2 Database Schema

#### Core Tables

```sql
-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    plan VARCHAR(20) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant users table for multi-tenant user assignments
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource, action)
);
```

### 1.3 Role-Based Access Control (RBAC)

#### User Roles

1. **Super Admin**: System-wide administrator with access to all tenants
2. **Tenant Admin**: Institution-level administrator
3. **School Admin**: School-level administrator
4. **Staff**: General staff member
5. **Teacher**: Teacher with specific permissions
6. **Student**: Student user
7. **Parent**: Parent user
8. **Guest**: Limited access user

#### Permission Categories

- Academic
- Accounting
- Administration
- Student Management
- Staff Management
- Transportation
- Hostel
- Library
- Activities
- Examination
- System

#### Permission Actions

- create
- read
- update
- delete
- manage
- approve
- export
- import

### 1.4 Attribute-Based Access Control (ABAC)

ABAC provides finer-grained control based on user attributes:

```typescript
interface PermissionCheck {
  resource: string;
  action: PermissionAction;
  attributes?: Record<string, any>;
}
```

Example: A teacher can only manage students in their assigned classes:

```typescript
{
  resource: 'students',
  action: 'manage',
  attributes: { class_id: 'teacher_class_id' }
}
```

## 2. Identity Server Implementation

### 2.1 Authentication Flow

```typescript
// Login with tenant validation
const login = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  // Validate tenant access
  if (credentials.tenantCode && data.user) {
    const hasAccess = await validateTenantAccess(data.user.id, credentials.tenantCode);
    if (!hasAccess) {
      throw new Error('Access denied to this tenant');
    }
  }

  return { success: true, data };
};
```

### 2.2 User Registration with Invitations

```typescript
// Register with invitation token
const register = async (data: RegisterData) => {
  // Validate invitation
  if (data.invitationToken) {
    const invitation = await validateInvitation(data.invitationToken);
    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }
  }

  // Create user account
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

  // Accept invitation if provided
  if (data.invitationToken) {
    await acceptInvitation(data.invitationToken, authData.user.id);
  }

  return { success: true, data: authData };
};
```

### 2.3 Tenant Management

#### Creating Tenants

```typescript
const createTenant = async (tenantData: TenantData) => {
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      name: tenantData.name,
      code: tenantData.code,
      plan: tenantData.plan,
      settings: {
        features: {
          academic: true,
          accounting: true,
          transportation: false,
          // ... other features
        },
        limits: {
          max_students: 1000,
          max_staff: 100,
          max_storage_gb: 10,
        },
      },
    })
    .select()
    .single();

  return { success: true, data };
};
```

#### Tenant Invitations

```typescript
const createInvitation = async (invitationData: InvitationData) => {
  const { data, error } = await supabase
    .from('tenant_invitations')
    .insert({
      tenant_id: invitationData.tenantId,
      email: invitationData.email,
      role: invitationData.role,
      invited_by: invitationData.invitedBy,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    .select()
    .single();

  return { success: true, data };
};
```

## 3. Row-Level Security (RLS) Implementation

### 3.1 Database Policies

```sql
-- Tenants table policies
CREATE POLICY "Super admins can view all tenants" ON tenants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role = 'super_admin'
            AND tu.is_active = true
        )
    );

CREATE POLICY "Tenant admins can view their own tenant" ON tenants
    FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('tenant_admin', 'school_admin')
            AND tu.is_active = true
        )
    );
```

### 3.2 Helper Functions

```sql
-- Get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tu.tenant_id 
        FROM tenant_users tu 
        WHERE tu.user_id = auth.uid() 
        AND tu.is_active = true 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenant_users tu
        WHERE tu.user_id = auth.uid()
        AND tu.role = 'super_admin'
        AND tu.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 4. Frontend Implementation

### 4.1 Context Providers

#### TenantContext

```typescript
export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTenant = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      // Get tenant information based on user's context
      let tenantId: string | null = null;

      if (user.role === 'super_admin') {
        // For super admin, get tenant from URL or context
        const urlParams = new URLSearchParams(window.location.search);
        tenantId = urlParams.get('tenant');
      } else {
        // For other users, get their assigned tenant
        const { data: userTenant } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        tenantId = userTenant?.tenant_id || null;
      }

      // Fetch tenant details
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .eq('status', 'active')
        .single();

      setTenant(tenantData as Tenant);
      setIsLoading(false);
    };

    fetchTenant();
  }, [user?.id, user?.role]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
};
```

### 4.2 Permission Hooks

#### usePermissions Hook

```typescript
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasPermission = (check: PermissionCheck): boolean => {
    if (!permissions.length) return false;

    return permissions.some(permission => {
      const matchesResource = permission.resource === check.resource;
      const matchesAction = permission.action === check.action;

      if (!matchesResource || !matchesAction) return false;

      // Check attribute-based conditions
      if (permission.conditions && check.attributes) {
        return checkAttributeConditions(permission.conditions, check.attributes);
      }

      return true;
    });
  };

  const canAccessModule = (module: string): boolean => {
    if (!tenant?.settings?.features) return false;

    // Check if module is enabled for the tenant
    const moduleEnabled = tenant.settings.features[module];
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
```

### 4.3 Protected Routes

#### ProtectedRoute Component

```typescript
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
      return <LoadingSpinner />;
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
    return <TenantSuspendedMessage />;
  }

  // Check required role
  if (requiredRole && userRole !== requiredRole) {
    return <AccessDeniedMessage />;
  }

  // Check required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDeniedMessage />;
  }

  // Check module access
  if (requiredModule) {
    const { canAccessModule } = usePermissions();
    if (!canAccessModule(requiredModule)) {
      return <ModuleNotAvailableMessage />;
    }
  }

  return <>{children}</>;
};
```

### 4.4 Route Protection Examples

```typescript
// Module-based protection
<Route path="/academic/dashboard" element={
  <ProtectedRoute requiredModule="academic">
    <AcademicDashboard />
  </ProtectedRoute>
} />

// Permission-based protection
<Route path="/student/students" element={
  <ProtectedRoute requiredPermission={{ resource: 'students', action: 'read' }}>
    <Students />
  </ProtectedRoute>
} />

// Role-based protection
<Route path="/administrator/admins" element={
  <ProtectedRoute requiredRole="super_admin">
    <Admins />
  </ProtectedRoute>
} />
```

## 5. Tenant Selector Component

### 5.1 Multi-Tenant Access

```typescript
export const TenantSelector: React.FC<TenantSelectorProps> = ({
  className = '',
  showCurrentTenant = true,
}) => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableTenants = async () => {
      if (!user?.id) return;

      // Fetch all tenants the user has access to
      const { data } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          tenants (
            id,
            name,
            code,
            status,
            plan,
            settings
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      const tenants = data
        ?.map(item => item.tenants)
        .filter(t => t && t.status === 'active') as Tenant[];

      setAvailableTenants(tenants || []);
    };

    fetchAvailableTenants();
  }, [user?.id]);

  const handleTenantSwitch = async (selectedTenant: Tenant) => {
    localStorage.setItem('currentTenantId', selectedTenant.id);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Building2 className="h-4 w-4" />
          <span>{tenant?.name || 'Select Institution'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {availableTenants.map((availableTenant) => (
          <DropdownMenuItem
            key={availableTenant.id}
            onClick={() => handleTenantSwitch(availableTenant)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{availableTenant.name}</div>
                <div className="text-xs text-gray-500">{availableTenant.code}</div>
              </div>
              <Badge>{availableTenant.plan}</Badge>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## 6. API Development

### 6.1 Service Layer

#### IdentityService

```typescript
export class IdentityService {
  // Authentication methods
  static async login(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      // Validate tenant access
      if (credentials.tenantCode && data.user) {
        const hasAccess = await this.validateTenantAccess(data.user.id, credentials.tenantCode);
        if (!hasAccess) {
          throw new Error('Access denied to this tenant');
        }
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Tenant management methods
  static async createTenant(tenantData: TenantData) {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Invitation methods
  static async createInvitation(invitationData: InvitationData) {
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .insert(invitationData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
}
```

## 7. Security Considerations

### 7.1 Data Isolation

- **Row-Level Security**: All database queries are automatically filtered by tenant
- **API Validation**: Server-side validation ensures users can only access their tenant's data
- **Session Management**: User sessions are tied to specific tenants

### 7.2 Permission Enforcement

- **Frontend**: UI elements are conditionally rendered based on permissions
- **Backend**: All API endpoints validate permissions before processing requests
- **Database**: RLS policies prevent unauthorized data access

### 7.3 Audit Logging

```typescript
// Log user actions for audit purposes
const logUserAction = async (action: string, resource: string, details: any) => {
  await supabase
    .from('audit_logs')
    .insert({
      user_id: user.id,
      tenant_id: tenant.id,
      action,
      resource,
      details,
      ip_address: getClientIP(),
      user_agent: navigator.userAgent,
    });
};
```

## 8. Deployment Considerations

### 8.1 Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=EduCloud
VITE_APP_VERSION=1.0.0
VITE_DEFAULT_TENANT=default_tenant_code
```

### 8.2 Database Migrations

Run the multi-tenant migration:

```bash
supabase db push
```

### 8.3 Initial Setup

1. Create the first super admin user
2. Create the default tenant
3. Assign super admin to the default tenant
4. Set up initial permissions and roles

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe('Permission System', () => {
  it('should grant access based on user permissions', () => {
    const user = { id: '1', role: 'teacher' };
    const permission = { resource: 'students', action: 'read' };
    
    expect(hasPermission(user, permission)).toBe(true);
  });

  it('should deny access for unauthorized users', () => {
    const user = { id: '1', role: 'student' };
    const permission = { resource: 'system.settings', action: 'manage' };
    
    expect(hasPermission(user, permission)).toBe(false);
  });
});
```

### 9.2 Integration Tests

```typescript
describe('Tenant Isolation', () => {
  it('should prevent cross-tenant data access', async () => {
    const user1 = await createUser('tenant1');
    const user2 = await createUser('tenant2');
    
    const data1 = await fetchData(user1, 'tenant1');
    const data2 = await fetchData(user2, 'tenant2');
    
    expect(data1.tenant_id).toBe('tenant1');
    expect(data2.tenant_id).toBe('tenant2');
  });
});
```

## 10. Monitoring and Analytics

### 10.1 Tenant Usage Metrics

```typescript
// Track tenant usage for billing and analytics
const trackTenantUsage = async (tenantId: string, action: string) => {
  await supabase
    .from('tenant_usage_metrics')
    .insert({
      tenant_id: tenantId,
      action,
      timestamp: new Date().toISOString(),
      user_count: await getTenantUserCount(tenantId),
      storage_used: await getTenantStorageUsage(tenantId),
    });
};
```

### 10.2 Performance Monitoring

- Monitor database query performance with tenant filtering
- Track API response times per tenant
- Monitor resource usage per tenant plan

## Conclusion

This multi-tenant architecture provides:

1. **Complete Data Isolation**: Each tenant's data is completely separated
2. **Flexible Permission System**: RBAC and ABAC for fine-grained access control
3. **Scalable Identity Management**: Centralized authentication with tenant validation
4. **Security**: Row-level security and comprehensive permission enforcement
5. **User Experience**: Seamless tenant switching and role-based UI

The implementation follows industry best practices for multi-tenant SaaS applications and provides a solid foundation for EduCloud's cloud platform.
