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

CREATE POLICY "Admins can upload school images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'school-images' AND public.is_admin());

CREATE POLICY "Admins can update school images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'school-images' AND public.is_admin());

CREATE POLICY "Admins can delete school images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'school-images' AND public.is_admin());

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
  ('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'Students Learning', 'विद्यार्थीहरू सिक्दै', 'academic', 4);-- Create app_role enum for user roles
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
  EXECUTE FUNCTION public.update_updated_at_column();-- Add RLS policies for admins to manage user roles
-- These policies ensure only admins can create, update, or delete user roles

-- Allow admins to insert new user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Allow admins to update user roles
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Allow admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());-- Add content field to notices table for full notice details
ALTER TABLE public.notices ADD COLUMN content TEXT;-- Create blogs table
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
-- Update notices table to support attachments
ALTER TABLE notices ADD COLUMN IF NOT EXISTS attachment_url TEXT;

ALTER TABLE notices ADD COLUMN IF NOT EXISTS attachment_type TEXT;
-- 'image' or 'pdf'-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT
  USING (true);

-- Authenticated write access (Restricted to Admins)
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- Seed initial data
INSERT INTO public.site_settings (key, value, description) VALUES
('general_info', '{
  "schoolName": "Adarsha Secondary School",
  "schoolNameNepali": "आदर्श माध्यमिक विद्यालय",
  "logoUrl": ""
}', 'General school information'),

('contact_info', '{
  "address": "Madhyapur Thimi Municipality-2, Sanothimi, Bhaktapur, Nepal",
  "phone": "01-6630857",
  "email": "admin@adarshasanothimi.edu.np",
  "officeHours": "Monday - Friday: 6:00 AM - 6:00 PM",
  "mapLink": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.3305562609103!2d85.37782293761629!3d27.681286198945735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a6ad03dcbe1%3A0xce118a959aa8cf1d!2sAdarsha%20Secondary%20School%2C%20Sanothimi%20Bhaktapur!5e1!3m2!1sen!2snp!4v1762573661785!5m2!1sen!2snp",
  "faqs": [
    { "q": "What are the admission requirements?", "a": "Admission requirements vary by program. For Grade 9, students need Class 8 completion certificate. For +2 programs, SLC/SEE pass certificate is required. Please visit our Admissions page for detailed requirements." },
    { "q": "Do you offer scholarships?", "a": "Yes, we offer merit-based scholarships for academically excellent students and need-based assistance for deserving students from economically disadvantaged backgrounds." },
    { "q": "What facilities do you provide?", "a": "We have modern computer labs, well-stocked library, smart classrooms, science laboratories, and other essential facilities to support quality education." }
  ]
}', 'School contact details'),

('about_content', '{
  "history": [
    "Adarsha Secondary School was founded on 29 Jestha, 2024 B.S. in Sanothimi, Bhaktapur to provide quality education. Initially established as the Demonstration Multipurpose School (DMPS), it started from Grade 6 with a focus on vocational education in fields such as Agriculture, Home Science, Secretarial Science, and Industrial Education.",
    "The school began primary classes from 2040 B.S. and has since grown significantly. Our first SLC examination was in 2029 B.S., where 25 students appeared and 3 students secured 5th, 6th, and 7th positions at the national level.",
    "We expanded into higher education by starting +2 Management from 2068/69 B.S., and later introduced Education and Humanities streams from 2074 B.S. Today, we continue to emphasize academic excellence to prepare competent manpower for the competitive future."
  ],
  "objectives": [
    "To conduct effective teaching-learning activities",
    "To provide quality education at affordable fees",
    "To produce competent manpower as per market needs",
    "To impart practical and creative education",
    "To include life-changing oriented subjects",
    "To run bachelor''s level education in different faculties in the future"
  ],
  "whyChooseUs": [
    { "title": "Quality Education", "description": "Affordable, accessible, quality education with qualified, experienced, and trained teachers." },
    { "title": "Infrastructure", "description": "Strong earthquake-resistant infrastructure with spacious playground and ICT-based classrooms." },
    { "title": "Environment", "description": "Student-friendly teaching environment with a homely atmosphere and counseling for needy students." },
    { "title": "Facilities", "description": "Library / E-library facilities, modern Computer and Science labs." },
    { "title": "Assessment", "description": "Continuous student assessment and regular ECA/CCA, excursions, and scholarship schemes." }
  ],
  "facilities": [
    "ICT Classrooms", "E-library", "Science Labs", "Computer Labs",
    "Playground", "Library", "Counseling", "Scholarships"
  ]
}', 'Content for the About page'),

('academics_programs', '[
  {
    "id": "comp-eng",
    "title": "Computer Engineering (Grade 9-12)",
    "description": "Our flagship program providing comprehensive technical education in computer engineering",
    "duration": "4 Years (Grade 9 to Grade 12)",
    "certification": "SLC/SEE and Higher Secondary completion certificates",
    "curriculum": "Comprehensive technical curriculum focusing on programming, hardware, and modern technology",
    "subjects": ["Computer Programming", "Digital Logic", "Computer Networks", "Database Management", "Web Development", "Software Engineering", "Computer Graphics", "System Analysis"]
  },
  {
    "id": "comp-sci",
    "title": "+2 Computer Science",
    "description": "Advanced computer science program focusing on programming, algorithms, and software development preparing students for higher education in technology fields.",
    "duration": "2 Years",
    "certification": "NEB Certified",
    "subjects": ["Programming in C/C++", "Object Oriented Programming", "Data Structures", "Computer Graphics", "Database Management System", "Web Technology"]
  },
  {
    "id": "management",
    "title": "+2 Management",
    "description": "Comprehensive business management program covering economics, accounting, marketing, and entrepreneurship to develop future business leaders and managers.",
    "duration": "2 Years",
    "certification": "NEB Certified",
    "subjects": ["Principles of Management", "Business Mathematics", "Accounting", "Economics", "Marketing", "Entrepreneurship", "Business Communication"]
  },
  {
    "id": "edu-hum",
    "title": "+2 Education & Humanities",
    "description": "Our Education and Humanities streams focus on developing future educators and social science professionals. These programs emphasize critical thinking, communication, and pedagogical skills.",
    "duration": "2 Years",
    "certification": "NEB Certified",
    "substreams": [
      { "name": "Education Stream", "description": "Prepares students for a career in teaching and educational administration with focus on pedagogy, child development, and subject-specific teaching methods." },
      { "name": "Humanities Stream", "description": "Focuses on social sciences, literature, and languages, preparing students for diverse careers in journalism, law, social work, and public service." }
    ]
  }
]', 'List of academic programs'),

('principal_message', '{
  "name": "Mr. Ram Babu Regmi",
  "title": "Principal",
  "message": "Welcome to Adarsha Secondary School, where we are committed to providing quality education and fostering a nurturing environment for every student.",
  "photoUrl": "/IMG_6850.heic"
}', 'Principal message and details'),

('homepage_content', '{
  "heroSlides": [
    { "title": "Welcome to Adarsha Secondary School", "nepaliTitle": "आदर्श माध्यमिक विद्यालय मा स्वागत छ", "description": "Empowering Future through Technical Education in Sanothimi, Bhaktapur" },
    { "title": "Quality Education for Every Student", "nepaliTitle": "हरेक विद्यार्थीका लागि गुणस्तरीय शिक्षा", "description": "Shaping the minds of tomorrow with excellence and discipline." },
    { "title": "A Place to Learn and Grow", "nepaliTitle": "सिक्ने र बढ्ने उत्कृष्ट ठाउँ", "description": "Providing academic excellence with modern learning facilities." }
  ],
  "whyChooseUs": [
    { "title": "Quality Education", "desc": "Qualified, experienced, and trained teachers." },
    { "title": "Safe Infrastructure", "desc": "Strong earthquake-resistant buildings." },
    { "title": "Modern Facilities", "desc": "ICT-based classrooms and well-equipped labs." },
    { "title": "Supportive Environment", "desc": "Student-friendly atmosphere with counseling." }
  ]
}', 'Content specifically for the homepage')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;
