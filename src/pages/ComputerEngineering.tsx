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
            pos.includes("it ") ||
            pos.includes("lab ");
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
                Producing highly skilled manpower in the Technical and Vocational stream with specialized knowledge in software development, hardware maintenance, and modern computing technologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum Structure */}
      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">Curriculum Structure</h2>
            <p className="text-lg text-muted-foreground">Technical and Vocational Stream (Grade 9 - 12)</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Grade 9 */}
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Monitor className="text-primary w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-primary">Grade 9</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Programming Principles & Concept in C</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Fundamentals of Computer & Application</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Fundamentals of Electro-System</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Website Design</li>
              </ul>
            </div>

            {/* Grade 10 */}
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Cpu className="text-primary w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-primary">Grade 10</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Data Structure & OOP concept using C++</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Computer Hardware, Electronics Repair & Maintenance</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Database Management System</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Digital Design & Microprocessor</li>
              </ul>
            </div>

            {/* Grade 11 */}
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Code2 className="text-primary w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-primary">Grade 11</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Programming in Java</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Computer Organization & Architecture</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Operating System</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Web & Mobile Application Development</li>
              </ul>
            </div>

            {/* Grade 12 */}
            <div className="p-8 bg-secondary/30 rounded-3xl border border-secondary hover:bg-primary/5 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><BookOpen className="text-primary w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-primary">Grade 12</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Visual Programming</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Computer Network</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Contemporary Technology</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brandRed mt-2 shrink-0" /> Software Engineering and Project</li>
              </ul>
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
