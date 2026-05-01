import { BookOpen, Code, Calculator, Award, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from "@/hooks/use-settings";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Academics = () => {
  const { settings } = useSettings();
  const programs = settings?.academics_programs || [];

  const getIcon = (id: string) => {
    if (id.includes('comp')) return <Code className="w-10 h-10" />;
    if (id.includes('manag')) return <Calculator className="w-10 h-10" />;
    return <BookOpen className="w-10 h-10" />;
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-tight">
                Academic <span className="text-brandRed">Programs</span>
              </h1>
              <p className="text-lg font-nepali text-white/70 mb-8 font-bold">हाम्रो शैक्षिक कार्यक्रमहरू</p>
              <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
                Comprehensive education programs designed to prepare students for success in the modern world through technical expertise and character development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Navigation (Anchor Links) */}
      <section className="relative z-20 -mt-10">
        <div className="section-container">
          <div className="bg-white p-4 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 flex flex-wrap gap-2 justify-center">
            {programs.map((p) => (
              <a 
                key={p.id} 
                href={`#${p.id}`}
                className="px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap"
              >
                {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Programs List */}
      <div className="py-24 space-y-32">
        {programs.map((program, idx) => (
          <section key={program.id} id={program.id} className="scroll-mt-32">
            <div className="section-container">
              <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-start`}>
                
                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 space-y-8"
                >
                  <div className="inline-flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                      {getIcon(program.id)}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-primary tracking-tight uppercase leading-none">
                        {program.title}
                      </h2>
                      <div className="h-1 w-12 bg-brandRed rounded-full mt-3" />
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-6 rounded-2xl border border-secondary flex items-center gap-4 group hover:bg-primary hover:text-white transition-all">
                      <Clock className="text-primary group-hover:text-white" size={24} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Duration</p>
                        <p className="font-bold">{program.duration || "2 Years"}</p>
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-6 rounded-2xl border border-secondary flex items-center gap-4 group hover:bg-primary hover:text-white transition-all">
                      <Award className="text-primary group-hover:text-white" size={24} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Certification</p>
                        <p className="font-bold">{program.certification || "NEB Certified"}</p>
                      </div>
                    </div>
                  </div>

                  {program.subjects && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Core Curriculum</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects.map((sub: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white border border-secondary rounded-xl text-sm font-bold text-muted-foreground shadow-sm group-hover:border-primary transition-all">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Media Side */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex-1 w-full"
                >
                  <div className="premium-card overflow-hidden h-[500px] relative">
                    {program.imageUrl ? (
                      <img src={program.imageUrl} className="w-full h-full object-cover" alt={program.title} />
                    ) : program.substreams ? (
                      <div className="p-8 space-y-4">
                        <p className="text-sm font-black uppercase tracking-widest text-primary/40 mb-6">Sub-streams Available</p>
                        {program.substreams.map((ss: any, i: number) => (
                          <div key={i} className="p-6 bg-secondary/30 rounded-2xl border border-secondary hover:border-primary/20 transition-all">
                            <h4 className="font-bold text-primary mb-1">{ss.name}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{ss.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-primary/10">
                        <BookOpen size={160} />
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-secondary">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-primary tracking-tight">Interested in our programs?</h2>
            <p className="text-lg text-muted-foreground">Download the full prospectus or contact our admissions office for detailed counseling.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/downloads">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold">
                  Download Prospectus
                </Button>
              </a>
              <a href="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold border-primary text-primary">
                  Inquiry Desk
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
