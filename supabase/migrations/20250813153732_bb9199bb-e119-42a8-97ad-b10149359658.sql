-- Remove the insecure policy that allows all authenticated users to view administrators
DROP POLICY IF EXISTS "Authenticated users can view administrators" ON administrators;

-- Create secure policy that only allows system administrators to view all administrators
CREATE POLICY "System administrators can view all administrators" ON administrators
FOR SELECT TO authenticated
USING (current_has_role('administrator'::app_role));

-- Allow users to view their own administrator record
CREATE POLICY "Users can view their own administrator record" ON administrators
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Also fix the schools policy for better security
DROP POLICY IF EXISTS "Authenticated users can view schools" ON schools;

CREATE POLICY "Admins see all schools; users see assigned schools" ON schools
FOR SELECT TO authenticated
USING (
  current_has_role('administrator'::app_role) OR 
  is_assigned_to_school(id, ARRAY['admin'::app_role, 'staff'::app_role])
);