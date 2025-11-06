
import { Users, Award, BookOpen, Target } from 'lucide-react';
import Layout from '../components/Layout';

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Our Mission",
      description: "To provide quality technical education that prepares students for the challenges of the modern world while maintaining strong ethical values."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Academic Excellence",
      description: "Committed to delivering comprehensive education through innovative teaching methods and modern technology."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community Focus",
      description: "Building strong relationships within our school community and contributing to the development of Bhaktapur."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-600" />,
      title: "Quality Assurance",
      description: "Maintaining high standards of education with qualified teachers and state-of-the-art facilities."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our School</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Adarsha Secondary School has been a cornerstone of quality education in Sanothimi, Bhaktapur, 
              committed to nurturing young minds and preparing them for future success.
            </p>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with the vision of providing quality technical education to the students of Bhaktapur, 
                Adarsha Secondary School has grown to become a leading educational institution in the region.
              </p>
              <p className="text-gray-600 mb-4">
                We have consistently maintained high academic standards while adapting to the changing needs 
                of modern education. Our Computer Engineering program for grades 9-12 and +2 programs in 
                Computer Science and Management are designed to prepare students for the digital age.
              </p>
              <p className="text-gray-600">
                Located in the historic city of Bhaktapur, we combine traditional values with modern 
                educational approaches to create a unique learning environment.
              </p>
            </div>
            <div>
              <img 
                src="/building.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="School Building"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values & Vision</h2>
            <p className="text-lg text-gray-600">
              The principles that guide our educational philosophy and daily operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Faculty</h2>
            <p className="text-lg text-gray-600">
              Experienced and dedicated teachers committed to student success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualified Teachers</h3>
              <p className="text-gray-600">All our teachers hold relevant degrees and certifications in their respective fields</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Training</h3>
              <p className="text-gray-600">Regular professional development to stay updated with latest teaching methods</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student-Centered</h3>
              <p className="text-gray-600">Focused on individual student needs and personalized learning approaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Facilities</h2>
            <p className="text-lg text-gray-600">
              Modern infrastructure supporting quality education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Computer Lab"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Computer Labs</h3>
              <p className="text-gray-600">State-of-the-art computer laboratories with latest hardware and software</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Library"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Library</h3>
              <p className="text-gray-600">Well-stocked library with books, journals, and digital resources</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Classrooms"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Smart Classrooms</h3>
              <p className="text-gray-600">Modern classrooms equipped with audio-visual teaching aids</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
