-- 1) Create role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('administrator', 'admin', 'staff');
  END IF;
END$$;

-- 2) Create user_roles table (global roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
DO $$ BEGIN
  -- Users can read their own roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  -- Only administrators can manage roles (we'll rely on a function defined below). Temporarily allow insert if no admin exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Only administrators manage roles'
  ) THEN
    CREATE POLICY "Only administrators manage roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.current_has_role('administrator') OR false)
    WITH CHECK (public.current_has_role('administrator') OR false);
  END IF;
END $$;

-- 3) Create user_school_assignments table (per-school roles)
CREATE TABLE IF NOT EXISTS public.user_school_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, school_id)
);

ALTER TABLE public.user_school_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for user_school_assignments
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_school_assignments' AND policyname='Users can view their own school assignments'
  ) THEN
    CREATE POLICY "Users can view their own school assignments"
    ON public.user_school_assignments
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_school_assignments' AND policyname='Only administrators manage school assignments'
  ) THEN
    CREATE POLICY "Only administrators manage school assignments"
    ON public.user_school_assignments
    FOR ALL
    TO authenticated
    USING (public.current_has_role('administrator') OR false)
    WITH CHECK (public.current_has_role('administrator') OR false);
  END IF;
END $$;

-- 4) Helper functions (security definer) to evaluate roles and assignments
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.current_has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), _role);
$$;

CREATE OR REPLACE FUNCTION public.is_assigned_to_school(_school_id uuid, _roles public.app_role[] DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_school_assignments usa
    WHERE usa.user_id = auth.uid()
      AND usa.school_id = _school_id
      AND (_roles IS NULL OR usa.role = ANY(_roles))
  );
$$;

-- 5) Replace overly-permissive policies on public.schools
-- Drop old policies if they exist
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schools' AND policyname='allow select for authenticated') THEN
    DROP POLICY "allow select for authenticated" ON public.schools;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schools' AND policyname='allow insert for authenticated') THEN
    DROP POLICY "allow insert for authenticated" ON public.schools;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schools' AND policyname='allow update for authenticated') THEN
    DROP POLICY "allow update for authenticated" ON public.schools;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schools' AND policyname='allow delete for authenticated') THEN
    DROP POLICY "allow delete for authenticated" ON public.schools;
  END IF;
END $$;

-- New secure policies
-- Select: administrators see all; others only their assigned schools
CREATE POLICY IF NOT EXISTS "Admins see all schools; users see assigned schools"
ON public.schools
FOR SELECT
TO authenticated
USING (
  public.current_has_role('administrator')
  OR public.is_assigned_to_school(id, ARRAY['admin','staff']::public.app_role[])
);

-- Insert: only administrators can create schools
CREATE POLICY IF NOT EXISTS "Only administrators can create schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (public.current_has_role('administrator'));

-- Update: administrators or assigned 'admin' of that school
CREATE POLICY IF NOT EXISTS "Admins or school admins can update their school"
ON public.schools
FOR UPDATE
TO authenticated
USING (
  public.current_has_role('administrator')
  OR public.is_assigned_to_school(id, ARRAY['admin']::public.app_role[])
)
WITH CHECK (
  public.current_has_role('administrator')
  OR public.is_assigned_to_school(id, ARRAY['admin']::public.app_role[])
);

-- Delete: only administrators
CREATE POLICY IF NOT EXISTS "Only administrators can delete schools"
ON public.schools
FOR DELETE
TO authenticated
USING (public.current_has_role('administrator'));

-- 6) Seed: ensure at least one administrator exists to avoid lockout
-- Assign the oldest user as administrator if no administrators exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'administrator'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'administrator'::public.app_role
    FROM auth.users
    ORDER BY created_at ASC NULLS LAST
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END IF;
END $$;