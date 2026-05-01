-- Create site_settings table
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
