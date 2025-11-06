-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policy for user_roles (users can view their own roles, admins can view all)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Create notices table
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notices
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Public read access for notices
CREATE POLICY "Notices are publicly readable"
  ON public.notices FOR SELECT
  USING (is_active = true);

-- Admin policies for hero_images
CREATE POLICY "Admins can insert hero images"
  ON public.hero_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update hero images"
  ON public.hero_images FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete hero images"
  ON public.hero_images FOR DELETE
  USING (public.is_admin());

-- Admin policies for team_members
CREATE POLICY "Admins can insert team members"
  ON public.team_members FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  USING (public.is_admin());

-- Admin policies for gallery_images
CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images FOR DELETE
  USING (public.is_admin());

-- Admin policies for notices
CREATE POLICY "Admins can insert notices"
  ON public.notices FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update notices"
  ON public.notices FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete notices"
  ON public.notices FOR DELETE
  USING (public.is_admin());

-- Insert sample notices
INSERT INTO public.notices (title, date, display_order) VALUES
  ('Admission Open for Grade 11 (Computer Science & Management) - Academic Year 2025', '2024-12-15', 1),
  ('Winter Vacation Notice: School will be closed from Dec 25 to Jan 5', '2024-12-10', 2),
  ('Annual Sports Day scheduled for January 20, 2025', '2024-12-05', 3),
  ('Parent-Teacher Meeting on December 22, 2024', '2024-11-28', 4);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger to notices table
CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();