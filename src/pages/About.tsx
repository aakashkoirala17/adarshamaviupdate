import { Users, Award, BookOpen, Target, CheckCircle2, Building2, History } from 'lucide-react';
import Layout from '../components/Layout';
import { useSettings } from "@/hooks/use-settings";
import { motion } from "framer-motion";

const About = () => {
  const { settings } = useSettings();
  const about = settings?.about_content || {
    history: [],
    objectives: [],
    whyChooseUs: [],
    facilities: []
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase">
                Building <span className="text-brandRed">Futures</span> <br/>Since 2024 B.S.
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl font-medium">
                Adarsha Secondary School has been a cornerstone of academic excellence in Sanothimi, Bhaktapur for over seven decades, fostering innovation and leadership in every student.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="relative z-20 -mt-16">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Established", val: "2024 BS", icon: History },
              { label: "Students", val: "1500+", icon: Users },
              { label: "Excellence", val: "75+ Yrs", icon: Award },
              { label: "Campus", val: "Modern", icon: Building2 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-center text-center group hover:bg-primary transition-all duration-500"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <stat.icon className="text-primary group-hover:text-white transition-colors" size={24} />
                </div>
                <span className="text-2xl font-black text-primary group-hover:text-white transition-colors">{stat.val}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-white/60 transition-colors">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-primary mb-6 tracking-tight">Our Legacy & Mission</h2>
                <div className="w-20 h-1.5 bg-brandRed rounded-full mb-10" />
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  {about.history.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {!about.history.length && (
                    <p>Founded with the vision of providing accessible quality education, Adarsha Secondary School has evolved into a premier educational institution in Nepal. Our mission is to provide a student-centered environment that fosters intellectual, social, and emotional growth.</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-secondary/50 p-12 rounded-[2.5rem] border border-secondary"
            >
              <h3 className="text-3xl font-bold text-primary mb-10 flex items-center gap-4">
                <Target className="text-brandRed" size={32} /> Key Objectives
              </h3>
              <ul className="space-y-6">
                {about.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-5 group">
                    <div className="mt-1 bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm border border-secondary group-hover:bg-primary transition-all">
                      <CheckCircle2 className="text-primary group-hover:text-white transition-colors" size={16} />
                    </div>
                    <span className="text-lg font-medium text-muted-foreground leading-snug group-hover:text-primary transition-colors">{obj}</span>
                  </li>
                ))}
                {!about.objectives.length && (
                  <li className="text-muted-foreground italic">Updating objectives...</li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">The Adarsha Advantage</h2>
            <p className="text-lg text-muted-foreground font-nepali">हामीलाई किन रोज्ने?</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {about.whyChooseUs.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-white p-10 rounded-[2rem] border border-primary/5 shadow-lg shadow-primary/5 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="h-2 w-12 bg-brandRed rounded-full mb-6 group-hover:w-20 transition-all duration-500" />
                <h3 className="text-2xl font-bold mb-4 text-primary leading-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">World-Class Facilities</h2>
              <p className="text-lg text-muted-foreground">We provide a modern infrastructure designed to facilitate a holistic learning experience for our students.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {about.facilities.map((facility, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-secondary/50 p-6 rounded-2xl text-center flex flex-col items-center justify-center border border-secondary hover:bg-primary hover:text-white transition-all cursor-default group"
              >
                <CheckCircle2 className="text-brandRed mb-3 group-hover:text-white transition-colors" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">{facility}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
