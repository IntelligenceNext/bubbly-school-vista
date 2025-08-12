-- Recreate write policies as PERMISSIVE instead of RESTRICTIVE to allow matching
-- ROLES table
DROP POLICY IF EXISTS "Only administrators can insert roles" ON public.roles;
DROP POLICY IF EXISTS "Only administrators can update roles" ON public.roles;
DROP POLICY IF EXISTS "Only administrators can delete roles" ON public.roles;

CREATE POLICY "Admins can insert roles"
ON public.roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can update roles"
ON public.roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role));

-- ROLE_PERMISSIONS table
DROP POLICY IF EXISTS "Only administrators can insert role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Only administrators can update role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Only administrators can delete role_permissions" ON public.role_permissions;

CREATE POLICY "Admins can insert role_permissions"
ON public.role_permissions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can update role_permissions"
ON public.role_permissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can delete role_permissions"
ON public.role_permissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role));