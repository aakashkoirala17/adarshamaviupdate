-- Create storage bucket for school images
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-images', 'school-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create hero_images table
CREATE TABLE public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_nepali TEXT,
  position TEXT NOT NULL,
  position_nepali TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_nepali TEXT,
  category TEXT DEFAULT 'general',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (government school website is public)
CREATE POLICY "Hero images are publicly readable"
  ON public.hero_images FOR SELECT
  USING (true);

CREATE POLICY "Team members are publicly readable"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Gallery images are publicly readable"
  ON public.gallery_images FOR SELECT
  USING (true);

-- Create policies for storage bucket (public read)
CREATE POLICY "School images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-images');

CREATE POLICY "Authenticated users can upload school images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update school images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete school images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO public.hero_images (image_url, alt_text, display_order) VALUES
  ('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200', 'Students in classroom', 1),
  ('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200', 'School building exterior', 2),
  ('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200', 'Computer lab', 3);

INSERT INTO public.team_members (name, name_nepali, position, position_nepali, image_url, display_order) VALUES
  ('Mr. Ram Krishna Shrestha', 'श्री राम कृष्ण श्रेष्ठ', 'Principal', 'प्रधानाध्यापक', NULL, 1),
  ('Mrs. Sita Devi Maharjan', 'श्रीमती सीता देवी महर्जन', 'Vice Principal', 'उप-प्रधानाध्यापक', NULL, 2),
  ('Mr. Hari Prasad Sharma', 'श्री हरि प्रसाद शर्मा', 'Computer Engineering HOD', 'कम्प्युटर इन्जिनियरिङ विभाग प्रमुख', NULL, 3),
  ('Mrs. Gita Kumari Thapa', 'श्रीमती गीता कुमारी थापा', 'Management Department HOD', 'व्यवस्थापन विभाग प्रमुख', NULL, 4);

INSERT INTO public.gallery_images (image_url, caption, caption_nepali, category, display_order) VALUES
  ('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 'Annual Sports Day 2024', 'वार्षिक खेलकुद दिवस २०२४', 'events', 1),
  ('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800', 'Computer Lab', 'कम्प्युटर प्रयोगशाला', 'facilities', 2),
  ('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', 'Science Fair 2024', 'विज्ञान मेला २०२४', 'events', 3),
  ('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'Students Learning', 'विद्यार्थीहरू सिक्दै', 'academic', 4);