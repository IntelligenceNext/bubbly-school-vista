-- Fix school contact information access control
-- Remove overly permissive policy that allows staff to see school contact info
DROP POLICY IF EXISTS "Admins see all schools; users see assigned schools" ON schools;

-- Create more restrictive policy - only system administrators and school admins can view schools
CREATE POLICY "Only administrators and school admins can view schools" ON schools
FOR SELECT TO authenticated
USING (
  current_has_role('administrator'::app_role) OR 
  is_assigned_to_school(id, ARRAY['admin'::app_role])
);

-- Ensure other operations are properly restricted
-- Only system administrators can create schools
CREATE POLICY IF NOT EXISTS "Only system administrators can create schools" ON schools
FOR INSERT TO authenticated
WITH CHECK (current_has_role('administrator'::app_role));

-- System administrators or school admins can update their school
CREATE POLICY IF NOT EXISTS "Admins or school admins can update their school" ON schools
FOR UPDATE TO authenticated
USING (
  current_has_role('administrator'::app_role) OR 
  is_assigned_to_school(id, ARRAY['admin'::app_role])
)
WITH CHECK (
  current_has_role('administrator'::app_role) OR 
  is_assigned_to_school(id, ARRAY['admin'::app_role])
);

-- Only system administrators can delete schools
CREATE POLICY IF NOT EXISTS "Only system administrators can delete schools" ON schools
FOR DELETE TO authenticated
USING (current_has_role('administrator'::app_role));