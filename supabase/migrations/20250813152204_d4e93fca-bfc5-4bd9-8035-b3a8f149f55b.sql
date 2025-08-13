-- Create administrators table for managing system administrators
CREATE TABLE public.administrators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid UNIQUE, -- Reference to auth.users (not foreign key to avoid issues)
  full_name text NOT NULL,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'admin',
  role_id uuid REFERENCES public.roles(id),
  school_id uuid REFERENCES public.schools(id),
  status text NOT NULL DEFAULT 'active',
  last_login timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;

-- Create policies for administrators table
CREATE POLICY "Administrators viewable by authenticated users" 
ON public.administrators 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only system administrators can create administrators" 
ON public.administrators 
FOR INSERT 
WITH CHECK (current_has_role('administrator'::app_role));

CREATE POLICY "Only system administrators can update administrators" 
ON public.administrators 
FOR UPDATE 
USING (current_has_role('administrator'::app_role));

CREATE POLICY "Only system administrators can delete administrators" 
ON public.administrators 
FOR DELETE 
USING (current_has_role('administrator'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_administrators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_administrators_updated_at
BEFORE UPDATE ON public.administrators
FOR EACH ROW
EXECUTE FUNCTION public.update_administrators_updated_at();

-- Create users_to_schools table if it doesn't exist for managing user-school relationships
CREATE TABLE IF NOT EXISTS public.users_to_schools (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL, -- Reference to auth.users
  school_id uuid NOT NULL REFERENCES public.schools(id),
  role text NOT NULL DEFAULT 'staff',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, school_id)
);

-- Enable RLS for users_to_schools
ALTER TABLE public.users_to_schools ENABLE ROW LEVEL SECURITY;

-- Create policies for users_to_schools
CREATE POLICY "Users can view their own school assignments" 
ON public.users_to_schools 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Only administrators can manage school assignments" 
ON public.users_to_schools 
FOR ALL 
USING (current_has_role('administrator'::app_role))
WITH CHECK (current_has_role('administrator'::app_role));