
import { BookOpen, Code, Calculator, Award, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Academics = () => {
  const computerEngineeringSubjects = [
    "Computer Programming", "Digital Logic", "Computer Networks", "Database Management",
    "Web Development", "Software Engineering", "Computer Graphics", "System Analysis"
  ];

  const computerScienceSubjects = [
    "Programming in C/C++", "Object Oriented Programming", "Data Structures",
    "Computer Graphics", "Database Management System", "Web Technology"
  ];

  const managementSubjects = [
    "Principles of Management", "Business Mathematics", "Accounting",
    "Economics", "Marketing", "Entrepreneurship", "Business Communication"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Our Academic Programs</h1>
            <p className="text-lg font-nepali text-primary mb-4">हाम्रो शैक्षिक कार्यक्रमहरू</p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Comprehensive education programs designed to prepare students for success in the modern world
            </p>
          </div>
        </div>
      </section>

      {/* Computer Engineering Program */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="mb-8 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-secondary p-4 rounded-full">
                  <Code className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-primary mb-4">
                Computer Engineering (Grade 9-12)
              </h2>
              <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                Our flagship program providing comprehensive technical education in computer engineering
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Program Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Duration</h4>
                      <p className="text-muted-foreground">4 Years (Grade 9 to Grade 12)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Curriculum</h4>
                      <p className="text-muted-foreground">Comprehensive technical curriculum focusing on programming, hardware, and modern technology</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Certification</h4>
                      <p className="text-muted-foreground">SLC/SEE and Higher Secondary completion certificates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted rounded-lg h-64 lg:h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Code size={64} className="mx-auto mb-4" />
                <p>Computer Programming Lab</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Core Subjects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {computerEngineeringSubjects.map((subject, index) => (
                  <div key={index} className="bg-secondary p-3 rounded border-l-4 border-primary">
                    <p className="text-sm font-medium text-foreground">{subject}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* +2 Programs Section */}
      <section className="py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              +2 Programs (NEB Affiliated)
            </h2>
            <p className="text-muted-foreground">
              Higher secondary education programs approved by National Examination Board
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* +2 Computer Science */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">+2 Computer Science</h3>
                </div>
                
                <div className="mb-4 bg-muted rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Code size={48} className="mx-auto mb-2" />
                    <p className="text-sm">Computer Science Lab</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  Advanced computer science program focusing on programming, algorithms, and software development 
                  preparing students for higher education in technology fields.
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-3">Key Subjects</h4>
                  <div className="space-y-2">
                    {computerScienceSubjects.map((subject, index) => (
                      <div key={index} className="bg-secondary p-3 rounded border-l-4 border-primary">
                        <p className="text-sm font-medium text-foreground">{subject}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>2 Years</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>NEB Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* +2 Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">+2 Management</h3>
                </div>
                
                <div className="mb-4 bg-muted rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Calculator size={48} className="mx-auto mb-2" />
                    <p className="text-sm">Management Studies</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  Comprehensive business management program covering economics, accounting, marketing, and 
                  entrepreneurship to develop future business leaders and managers.
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-3">Key Subjects</h4>
                  <div className="space-y-2">
                    {managementSubjects.map((subject, index) => (
                      <div key={index} className="bg-secondary p-3 rounded border-l-4 border-primary">
                        <p className="text-sm font-medium text-foreground">{subject}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>2 Years</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>NEB Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
