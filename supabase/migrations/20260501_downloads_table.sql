-- Create downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  category TEXT DEFAULT 'General',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Downloads are publicly readable"
  ON public.downloads FOR SELECT
  USING (is_active = true);

-- Admin write access
CREATE POLICY "Admins can insert downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update downloads"
  ON public.downloads FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete downloads"
  ON public.downloads FOR DELETE
  USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_downloads_updated_at
  BEFORE UPDATE ON public.downloads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
