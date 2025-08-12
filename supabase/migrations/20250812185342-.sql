-- Allow authenticated users to read roles/permissions so the Role form can load
DROP POLICY IF EXISTS "Permissions readable by authenticated" ON public.permissions;
CREATE POLICY "Permissions readable by authenticated"
ON public.permissions
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Roles readable by authenticated" ON public.roles;
CREATE POLICY "Roles readable by authenticated"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Role-permissions readable by authenticated" ON public.role_permissions;
CREATE POLICY "Role-permissions readable by authenticated"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);