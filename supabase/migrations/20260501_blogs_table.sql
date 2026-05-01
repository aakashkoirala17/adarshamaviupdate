-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_name TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Blogs are publicly readable"
  ON public.blogs FOR SELECT
  USING (is_active = true);

-- Admin write access
CREATE POLICY "Admins can insert blogs"
  ON public.blogs FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update blogs"
  ON public.blogs FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete blogs"
  ON public.blogs FOR DELETE
  USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
