-- Refine RLS: separate admin-only write policies and keep read open to authenticated
-- ROLES table
DROP POLICY IF EXISTS "Only administrators manage roles" ON public.roles;

-- SELECT remains open to authenticated (already created earlier)
CREATE POLICY IF NOT EXISTS "Only administrators can insert roles"
ON public.roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY IF NOT EXISTS "Only administrators can update roles"
ON public.roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY IF NOT EXISTS "Only administrators can delete roles"
ON public.roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role));

-- ROLE_PERMISSIONS table
DROP POLICY IF EXISTS "Only administrators manage role_permissions" ON public.role_permissions;

CREATE POLICY IF NOT EXISTS "Only administrators can insert role_permissions"
ON public.role_permissions
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY IF NOT EXISTS "Only administrators can update role_permissions"
ON public.role_permissions
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY IF NOT EXISTS "Only administrators can delete role_permissions"
ON public.role_permissions
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role));