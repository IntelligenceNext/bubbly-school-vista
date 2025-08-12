-- Grant the current user administrator privileges so they can manage roles/permissions
-- Note: This runs as a migration and bypasses RLS
INSERT INTO public.user_roles (user_id, role)
VALUES ('29da368b-b873-419d-8192-8f7822671e93', 'administrator')
ON CONFLICT (user_id, role) DO NOTHING;