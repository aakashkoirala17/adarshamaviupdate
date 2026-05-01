import { BookOpen, Code, Calculator, Award, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from "@/hooks/use-settings";

const Academics = () => {
  const { settings } = useSettings();
  const programs = settings?.academics_programs || [];

  // Helper to get icon for program
  const getIcon = (id: string) => {
    if (id.includes('comp')) return <Code className="w-12 h-12 text-primary" />;
    if (id.includes('manag')) return <Calculator className="w-12 h-12 text-primary" />;
    return <BookOpen className="w-12 h-12 text-primary" />;
  };

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

      {/* Main Programs */}
      <div className="space-y-16 py-12">
        {programs.map((program, idx) => (
          <section key={program.id} className={idx % 2 === 0 ? "bg-background" : "bg-secondary/30 py-16"}>
            <div className="max-w-7xl mx-auto px-4">
              <Card className="mb-8 border-primary/20 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-secondary p-4 rounded-full flex-shrink-0">
                      {getIcon(program.id)}
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold text-primary mb-2">
                        {program.title}
                      </h2>
                      <p className="text-muted-foreground max-w-3xl">
                        {program.description}
                      </p>
                    </div>
                  </div>
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
                          <p className="text-muted-foreground">{program.duration}</p>
                        </div>
                      </div>
                      {program.curriculum && (
                        <div className="flex items-start space-x-3">
                          <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Curriculum</h4>
                            <p className="text-muted-foreground">{program.curriculum}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">Certification</h4>
                          <p className="text-muted-foreground">{program.certification}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {program.imageUrl ? (
                    <img src={program.imageUrl} className="w-full h-full object-cover" alt={program.title} />
                  ) : program.substreams ? (
                    <div className="grid gap-4 w-full p-8">
                       {program.substreams.map((ss: any, i: number) => (
                         <div key={i} className="p-4 bg-background rounded border">
                           <h4 className="font-bold text-primary">{ss.name}</h4>
                           <p className="text-sm text-muted-foreground">{ss.description}</p>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground p-8">
                      {getIcon(program.id)}
                      <p className="mt-2">Core Technical Program</p>
                    </div>
                  )}
                </div>
              </div>

              {program.subjects && program.subjects.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Core Subjects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {program.subjects.map((subject, index) => (
                        <div key={index} className="bg-secondary p-3 rounded border-l-4 border-primary">
                          <p className="text-sm font-medium text-foreground">{subject}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
};

export default Academics;
