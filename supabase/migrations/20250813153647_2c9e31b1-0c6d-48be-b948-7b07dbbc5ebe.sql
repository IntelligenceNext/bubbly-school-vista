-- Fix critical security issue: Restrict administrator data access
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view administrators" ON administrators;

-- Create proper restrictive policies for administrator data
-- Only system administrators can view all administrators
CREATE POLICY "System administrators can view all administrators" ON administrators
FOR SELECT TO authenticated
USING (current_has_role('administrator'::app_role));

-- Administrators can view their own record
CREATE POLICY "Users can view their own administrator record" ON administrators
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Only system administrators can create new administrators
CREATE POLICY "Only system administrators can create administrators" ON administrators
FOR INSERT TO authenticated
WITH CHECK (current_has_role('administrator'::app_role));

-- Only system administrators can update administrator records
CREATE POLICY "Only system administrators can update administrators" ON administrators
FOR UPDATE TO authenticated
USING (current_has_role('administrator'::app_role))
WITH CHECK (current_has_role('administrator'::app_role));

-- Only system administrators can delete administrators
CREATE POLICY "Only system administrators can delete administrators" ON administrators
FOR DELETE TO authenticated
USING (current_has_role('administrator'::app_role));

-- Also fix schools table to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view schools" ON schools;

-- Restore proper school access policies
CREATE POLICY "Admins see all schools; users see assigned schools" ON schools
FOR SELECT TO authenticated
USING (
  current_has_role('administrator'::app_role) OR 
  is_assigned_to_school(id, ARRAY['admin'::app_role, 'staff'::app_role])
);