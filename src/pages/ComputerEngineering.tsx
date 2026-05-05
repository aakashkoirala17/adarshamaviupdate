import { useState, useEffect } from 'react';
import { Users, Monitor, Cpu, Code2, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ComputerEngineering = () => {
  const [instructors, setInstructors] = useState<any[]>([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (data) {
        // Filter team members who are part of the Computer Engineering department
        // checking for relevant keywords in their position
        const ceStaff = data.filter(member => {
          const pos = (member.position || "").toLowerCase();
          return pos.includes("computer") || 
                 pos.includes("engineering") || 
                 pos.includes("software") || 
                 pos.includes("hardware") ||
                 pos.includes("ce dept") ||
                 pos.includes("it ");
        });
        setInstructors(ceStaff);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandRed/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Monitor className="w-8 h-8 text-brandRed" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-white/80">Academic Department</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase">
                Computer <span className="text-brandRed">Engineering</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl font-medium">
                Empowering the next generation of technologists, developers, and innovators through comprehensive curriculum and hands-on practical experience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group">
              <Cpu className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-primary mb-3">Hardware & Systems</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">In-depth study of computer architecture, microprocessors, and digital logic design.</p>
            </div>
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group">
              <Code2 className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-primary mb-3">Software Development</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Modern programming languages, data structures, algorithms, and software engineering principles.</p>
            </div>
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group">
              <BookOpen className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-primary mb-3">Practical Labs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Extensive hands-on sessions in our state-of-the-art computer laboratories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-24 bg-secondary/20">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">Department Faculty</h2>
            <p className="text-lg text-muted-foreground">Meet our experienced instructors and technical staff</p>
          </div>

          {!instructors.length ? (
             <div className="text-center p-12 bg-white rounded-3xl border border-secondary">
               <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
               <p className="text-muted-foreground">No faculty members found. Add team members with 'Computer' or 'Engineering' in their position via the Admin panel.</p>
             </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, idx) => (
                <motion.div 
                  key={instructor.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-lg shadow-primary/5 border border-primary/5 text-center group hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                >
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-secondary/50 group-hover:border-primary/20 transition-colors bg-muted flex items-center justify-center shrink-0">
                    {instructor.image_url ? (
                      <img src={instructor.image_url} className="w-full h-full object-cover" alt={instructor.name} />
                    ) : (
                      <Users className="w-12 h-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1">{instructor.name}</h3>
                  <p className="text-sm font-bold text-brandRed uppercase tracking-widest line-clamp-2">{instructor.position}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ComputerEngineering;
