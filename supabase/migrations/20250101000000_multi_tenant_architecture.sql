-- Multi-Tenant Architecture Migration
-- This migration implements the foundational layers for EduCloud's cloud SaaS platform

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    plan VARCHAR(20) DEFAULT 'basic' CHECK (plan IN ('basic', 'premium', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create tenant_users table for multi-tenant user assignments
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'tenant_admin', 'school_admin', 'staff', 'teacher', 'student', 'parent', 'guest')),
    permissions TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'accounting', 'administration', 'student_management', 'staff_management', 'transportation', 'hostel', 'library', 'activities', 'examination', 'system')),
    description TEXT,
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage', 'approve', 'export', 'import')),
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions TEXT[] DEFAULT '{}',
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Create tenant_invitations table
CREATE TABLE IF NOT EXISTS tenant_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'tenant_admin', 'school_admin', 'staff', 'teacher', 'student', 'parent', 'guest')),
    invited_by UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tenant_id to existing tables for multi-tenancy
-- Update schools table to include tenant_id
ALTER TABLE schools ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update administrators table to include tenant_id
ALTER TABLE administrators ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Update classes table to include tenant_id
ALTER TABLE classes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Update sessions table to include tenant_id
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Update sm_settings table to include tenant_id
ALTER TABLE sm_settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_code ON tenants(code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_role ON tenant_users(role);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_tenant_id ON tenant_invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_email ON tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_status ON tenant_invitations(status);

-- Create indexes for existing tables with tenant_id
CREATE INDEX IF NOT EXISTS idx_schools_tenant_id ON schools(tenant_id);
CREATE INDEX IF NOT EXISTS idx_administrators_tenant_id ON administrators(tenant_id);
CREATE INDEX IF NOT EXISTS idx_classes_tenant_id ON classes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_id ON sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sm_settings_tenant_id ON sm_settings(tenant_id);

-- Create Row Level Security (RLS) policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invitations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on existing tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenants table
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

CREATE POLICY "Only super admins can create tenants" ON tenants
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role = 'super_admin'
            AND tu.is_active = true
        )
    );

CREATE POLICY "Only super admins can update tenants" ON tenants
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role = 'super_admin'
            AND tu.is_active = true
        )
    );

-- Create RLS policies for tenant_users table
CREATE POLICY "Users can view their own tenant assignments" ON tenant_users
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

CREATE POLICY "Super admins and tenant admins can manage tenant users" ON tenant_users
    FOR ALL TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

-- Create RLS policies for permissions table
CREATE POLICY "All authenticated users can view permissions" ON permissions
    FOR SELECT TO authenticated
    USING (true);

-- Create RLS policies for roles table
CREATE POLICY "Users can view roles for their tenant" ON roles
    FOR SELECT TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.is_active = true
        )
    );

CREATE POLICY "Super admins and tenant admins can manage roles" ON roles
    FOR ALL TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

-- Create RLS policies for tenant_invitations table
CREATE POLICY "Users can view invitations for their tenant" ON tenant_invitations
    FOR SELECT TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

CREATE POLICY "Super admins and tenant admins can manage invitations" ON tenant_invitations
    FOR ALL TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

-- Create RLS policies for existing tables with tenant_id
-- Schools table policies
CREATE POLICY "Users can view schools in their tenant" ON schools
    FOR SELECT TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.is_active = true
        )
    );

CREATE POLICY "Super admins and tenant admins can manage schools" ON schools
    FOR ALL TO authenticated
    USING (
        tenant_id IN (
            SELECT tu.tenant_id FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role IN ('super_admin', 'tenant_admin')
            AND tu.is_active = true
        )
    );

-- Similar policies for other tables...
-- (Additional policies would be created for administrators, classes, sessions, etc.)

-- Create functions for tenant isolation
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

CREATE OR REPLACE FUNCTION has_tenant_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenant_users tu
        WHERE tu.user_id = auth.uid()
        AND tu.role = role_name
        AND tu.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default system permissions
INSERT INTO permissions (name, category, description, resource, action) VALUES
-- Academic permissions
('View Academic Dashboard', 'academic', 'Can view academic dashboard', 'academic', 'read'),
('Manage Classes', 'academic', 'Can manage classes and sections', 'academic.classes', 'manage'),
('Manage Subjects', 'academic', 'Can manage subjects', 'academic.subjects', 'manage'),
('Manage Attendance', 'academic', 'Can manage student attendance', 'academic.attendance', 'manage'),
('View Study Materials', 'academic', 'Can view study materials', 'academic.materials', 'read'),
('Manage Study Materials', 'academic', 'Can manage study materials', 'academic.materials', 'manage'),

-- Accounting permissions
('View Accounting Dashboard', 'accounting', 'Can view accounting dashboard', 'accounting', 'read'),
('Manage Income', 'accounting', 'Can manage income records', 'accounting.income', 'manage'),
('Manage Expenses', 'accounting', 'Can manage expense records', 'accounting.expenses', 'manage'),
('Manage Fee Invoices', 'accounting', 'Can manage fee invoices', 'accounting.invoices', 'manage'),
('Collect Payments', 'accounting', 'Can collect payments', 'accounting.payments', 'manage'),

-- Student Management permissions
('View Students', 'student_management', 'Can view student information', 'students', 'read'),
('Manage Students', 'student_management', 'Can manage student records', 'students', 'manage'),
('Manage Admissions', 'student_management', 'Can manage student admissions', 'students.admissions', 'manage'),
('View Student Reports', 'student_management', 'Can view student reports', 'students.reports', 'read'),

-- Staff Management permissions
('View Staff', 'staff_management', 'Can view staff information', 'staff', 'read'),
('Manage Staff', 'staff_management', 'Can manage staff records', 'staff', 'manage'),
('Manage Staff Attendance', 'staff_management', 'Can manage staff attendance', 'staff.attendance', 'manage'),

-- System permissions
('Manage Users', 'system', 'Can manage system users', 'system.users', 'manage'),
('Manage Roles', 'system', 'Can manage user roles', 'system.roles', 'manage'),
('Manage Permissions', 'system', 'Can manage permissions', 'system.permissions', 'manage'),
('View System Settings', 'system', 'Can view system settings', 'system.settings', 'read'),
('Manage System Settings', 'system', 'Can manage system settings', 'system.settings', 'manage')
ON CONFLICT (resource, action) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at BEFORE UPDATE ON tenant_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
