
import { Users, Award, BookOpen, Target } from 'lucide-react';
import Layout from '../components/Layout';

const About = () => {
  const objectives = [
    "To conduct effective teaching-learning activities",
    "To provide quality education at affordable fees",
    "To produce competent manpower as per market needs",
    "To impart practical and creative education",
    "To include life-changing oriented subjects",
    "To run bachelor's level education in different faculties in the future"
  ];

  const whyChooseUs = [
    { title: "Quality Education", description: "Affordable, accessible, quality education with qualified, experienced, and trained teachers." },
    { title: "Infrastructure", description: "Strong earthquake-resistant infrastructure with spacious playground and ICT-based classrooms." },
    { title: "Environment", description: "Student-friendly teaching environment with a homely atmosphere and counseling for needy students." },
    { title: "Facilities", description: "Library / E-library facilities, modern Computer and Science labs." },
    { title: "Assessment", description: "Continuous student assessment and regular ECA/CCA, excursions, and scholarship schemes." }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Adarsha Secondary School</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A cornerstone of academic excellence in Sanothimi, Bhaktapur since 2024 B.S.
            </p>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our History & Introduction</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Adarsha Secondary School was founded on <strong>29 Jestha, 2024 B.S.</strong> in Sanothimi, Bhaktapur to provide quality education. Initially established as the <strong>Demonstration Multipurpose School (DMPS)</strong>, it started from Grade 6 with a focus on vocational education in fields such as Agriculture, Home Science, Secretarial Science, and Industrial Education.
                </p>
                <p>
                  The school began primary classes from 2040 B.S. and has since grown significantly. Our first SLC examination was in 2029 B.S., where 25 students appeared and 3 students secured 5th, 6th, and 7th positions at the national level.
                </p>
                <p>
                  We expanded into higher education by starting +2 Management from 2068/69 B.S., and later introduced Education and Humanities streams from 2074 B.S. Today, we continue to emphasize academic excellence to prepare competent manpower for the competitive future.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-secondary p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" /> Our Objectives
                </h3>
                <ul className="space-y-3">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Adarsha Secondary School?</h2>
            <p className="text-lg text-muted-foreground">
              ADHS/DMPS offers a unique blend of tradition and modern educational practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-background p-8 rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-primary">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure & Facilities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Facilities</h2>
            <p className="text-lg text-muted-foreground">
              Modern infrastructure designed for a student-friendly learning environment
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "ICT Classrooms", "E-library", "Science Labs", "Computer Labs",
              "Playground", "Library", "Counseling", "Scholarships"
            ].map((facility, i) => (
              <div key={i} className="bg-secondary p-4 rounded-lg text-center font-semibold text-primary">
                {facility}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
