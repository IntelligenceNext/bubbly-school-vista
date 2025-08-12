
-- Create enum types first
CREATE TYPE public.user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent');
CREATE TYPE public.status_type AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.session_status AS ENUM ('active', 'inactive', 'upcoming', 'completed');

-- Create schools table
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Create user_school_assignments table
CREATE TABLE public.user_school_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, school_id)
);

-- Create sessions table (academic sessions)
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status session_status DEFAULT 'upcoming',
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    status status_type DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code, school_id)
);

-- Create sections table
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    capacity INTEGER DEFAULT 30,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mediums table (language of instruction)
CREATE TABLE public.mediums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_types table
CREATE TABLE public.student_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code, school_id)
);

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admission_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    class_id UUID REFERENCES public.classes(id),
    section_id UUID REFERENCES public.sections(id),
    medium_id UUID REFERENCES public.mediums(id),
    student_type_id UUID REFERENCES public.student_types(id),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_email TEXT,
    address TEXT,
    photo_url TEXT,
    status status_type DEFAULT 'active',
    admission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department TEXT,
    designation TEXT,
    date_of_joining DATE,
    qualification TEXT,
    experience_years INTEGER,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hostels table
CREATE TABLE public.hostels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL DEFAULT 50,
    gender gender_type NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for SMS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'smsbucket',
    'smsbucket',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Enable Row Level Security on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_school_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mediums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role 
  FROM public.user_school_assignments 
  WHERE user_id = auth.uid() AND is_active = TRUE 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to get current user school
CREATE OR REPLACE FUNCTION public.get_current_user_school()
RETURNS UUID AS $$
  SELECT school_id 
  FROM public.user_school_assignments 
  WHERE user_id = auth.uid() AND is_active = TRUE 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for schools
CREATE POLICY "Super admins can view all schools" ON public.schools FOR SELECT USING (public.get_current_user_role() = 'super_admin');
CREATE POLICY "School admins can view their school" ON public.schools FOR SELECT USING (id = public.get_current_user_school());
CREATE POLICY "Super admins can manage schools" ON public.schools FOR ALL USING (public.get_current_user_role() = 'super_admin');

-- Create RLS policies for roles and permissions
CREATE POLICY "Authenticated users can view roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view permissions" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage roles" ON public.roles FOR ALL USING (public.get_current_user_role() = 'super_admin');
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions FOR ALL USING (public.get_current_user_role() = 'super_admin');

-- Create RLS policies for user assignments
CREATE POLICY "Users can view own assignments" ON public.user_school_assignments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view school assignments" ON public.user_school_assignments FOR SELECT USING (
  public.get_current_user_role() IN ('super_admin', 'school_admin')
);
CREATE POLICY "Admins can manage assignments" ON public.user_school_assignments FOR ALL USING (
  public.get_current_user_role() IN ('super_admin', 'school_admin')
);

-- Create RLS policies for school-specific tables
CREATE POLICY "School users can view sessions" ON public.sessions FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage sessions" ON public.sessions FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view classes" ON public.classes FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage classes" ON public.classes FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view mediums" ON public.mediums FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage mediums" ON public.mediums FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view student types" ON public.student_types FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage student types" ON public.student_types FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view students" ON public.students FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School staff can manage students" ON public.students FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() IN ('school_admin', 'teacher') AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view staff" ON public.staff FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage staff" ON public.staff FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

CREATE POLICY "School users can view hostels" ON public.hostels FOR SELECT USING (
  public.get_current_user_role() = 'super_admin' OR school_id = public.get_current_user_school()
);
CREATE POLICY "School admins can manage hostels" ON public.hostels FOR ALL USING (
  public.get_current_user_role() = 'super_admin' OR 
  (public.get_current_user_role() = 'school_admin' AND school_id = public.get_current_user_school())
);

-- Create storage policies for smsbucket
CREATE POLICY "Authenticated users can view files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'smsbucket');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'smsbucket');
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'smsbucket' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'smsbucket' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default roles
INSERT INTO public.roles (name, description, is_system_role) VALUES
('Super Admin', 'Full system access across all schools', true),
('School Admin', 'Administrative access within assigned school', true),
('Teacher', 'Teaching and classroom management access', true),
('Student', 'Student portal access', true),
('Parent', 'Parent portal access', true);

-- Insert default permissions
INSERT INTO public.permissions (name, category, description) VALUES
-- School Management
('manage_schools', 'School Management', 'Create, edit, and delete schools'),
('view_schools', 'School Management', 'View school information'),
('manage_sessions', 'School Management', 'Manage academic sessions'),
('manage_classes', 'School Management', 'Manage classes and sections'),

-- User Management
('manage_users', 'User Management', 'Create, edit, and delete users'),
('view_users', 'User Management', 'View user information'),
('manage_roles', 'User Management', 'Assign and manage user roles'),

-- Student Management
('manage_students', 'Student Management', 'Add, edit, and manage student records'),
('view_students', 'Student Management', 'View student information'),
('manage_admissions', 'Student Management', 'Handle student admissions'),

-- Staff Management
('manage_staff', 'Staff Management', 'Add, edit, and manage staff records'),
('view_staff', 'Staff Management', 'View staff information'),
('manage_attendance', 'Staff Management', 'Manage staff attendance'),

-- Academic Management
('manage_subjects', 'Academic', 'Create and manage subjects'),
('manage_curriculum', 'Academic', 'Manage academic curriculum'),
('view_reports', 'Academic', 'View academic reports'),

-- System Administration
('system_settings', 'System', 'Access system-wide settings'),
('view_logs', 'System', 'View system logs and audit trails'),
('backup_restore', 'System', 'Perform system backup and restore');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at columns
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mediums_updated_at BEFORE UPDATE ON public.mediums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_types_updated_at BEFORE UPDATE ON public.student_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hostels_updated_at BEFORE UPDATE ON public.hostels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
