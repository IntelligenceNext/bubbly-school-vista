-- Seed a system Administrator role if none exists
INSERT INTO public.roles (name, description, is_system_role)
SELECT 'Administrator', 'System administrator role', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.roles WHERE name = 'Administrator'
);