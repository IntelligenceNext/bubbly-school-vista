-- Give current user administrator role
INSERT INTO user_roles (user_id, role) 
VALUES ('0b03f856-f74b-4243-8b26-b12a104a0edc', 'administrator');

-- Create test administrator record for the current user
INSERT INTO administrators (
  user_id, 
  full_name, 
  username, 
  email, 
  role, 
  role_id, 
  status
) VALUES (
  '0b03f856-f74b-4243-8b26-b12a104a0edc',
  'Simon',
  'simon_admin',
  'ushasrimacharla18@gmail.com',
  'Administrator',
  '2d204a8c-0afa-4b95-b025-1b44559d3e97',
  'active'
);

-- Also add user to school assignment table for one of the schools
INSERT INTO user_school_assignments (user_id, school_id, role)
VALUES ('0b03f856-f74b-4243-8b26-b12a104a0edc', '1079fcf2-fcd5-44e0-a29e-320b9e4b29af', 'admin');

-- Update RLS policies to be more permissive for schools table
DROP POLICY IF EXISTS "Admins see all schools; users see assigned schools" ON schools;

CREATE POLICY "Authenticated users can view schools" ON schools
FOR SELECT TO authenticated
USING (true);

-- Make sure administrators table policies are correct
DROP POLICY IF EXISTS "Administrators viewable by authenticated users" ON administrators;

CREATE POLICY "Authenticated users can view administrators" ON administrators
FOR SELECT TO authenticated
USING (true);