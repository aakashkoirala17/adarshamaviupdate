import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
import { useSettings } from "@/hooks/use-settings";
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const { settings } = useSettings();
  const contact = settings?.contact_info || {
    address: "Madhyapur Thimi Municipality-2, Sanothimi, Bhaktapur, Nepal",
    phone: "01-6630857",
    email: "admin@adarshasanothimi.edu.np",
    officeHours: "Monday - Friday: 6:00 AM - 6:00 PM",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.3305562609103!2d85.37782293761629!3d27.681286198945735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a6ad03dcbe1%3A0xce118a959aa8cf1d!2sAdarsha%20Secondary%20School%2C%20Sanothimi%20Bhaktapur!5e1!3m2!1sen!2snp!4v1762573661785!5m2!1sen!2snp",
    faqs: []
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase">Get In <span className="text-brandRed">Touch</span></h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium mb-4">
              Have questions? We're here to help. Reach out to us for admissions, campus tours, or general inquiries.
            </p>
            <p className="text-lg font-nepali text-white/60 font-bold uppercase tracking-widest">हामीसँग सम्पर्क गर्नुहोस्</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white relative z-20 -mt-12">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-4xl font-bold text-primary mb-6 tracking-tight">Contact Information</h2>
                <div className="w-20 h-1.5 bg-brandRed rounded-full mb-10" />
                <p className="text-lg text-muted-foreground leading-relaxed">Our administrative office is open to assist you with any information you might need regarding the school.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: MapPin, title: "Our Address", val: contact.address, color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Phone, title: "Phone Number", val: contact.phone, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { icon: Mail, title: "Email Address", val: contact.email, color: "text-purple-500", bg: "bg-purple-50" },
                  { icon: Clock, title: "Office Hours", val: contact.officeHours, color: "text-orange-500", bg: "bg-orange-50" },
                ].map((item, i) => (
                  <div key={i} className="premium-card p-6 bg-white hover:border-primary/20 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className={item.color} size={24} />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="premium-card overflow-hidden p-0 h-[350px] relative">
                <iframe
                  src={contact.mapLink}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                  allowFullScreen
                  loading="lazy"
                  title="School Location Map"
                />
              </div>
            </motion.div>

            {/* Contact Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-secondary/30 p-10 md:p-14 rounded-[3rem] border border-secondary shadow-xl shadow-primary/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <MessageSquare size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary tracking-tight">Send a Message</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Full Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-14 rounded-2xl border-secondary bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-14 rounded-2xl border-secondary bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-14 rounded-2xl border-secondary bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-4 rounded-2xl border border-secondary bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none font-medium"
                    >
                      <option value="">Select a category</option>
                      <option value="admission">Admission Inquiry</option>
                      <option value="programs">Academic Programs</option>
                      <option value="general">General Question</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="rounded-2xl border-secondary bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group"
                  >
                    Send Message <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-secondary/10 border-t border-secondary">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4">
              <HelpCircle size={14} /> Knowledge Base
            </div>
            <h2 className="text-4xl font-bold text-primary tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground mt-2">Find quick answers to your common queries.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {contact.faqs?.map((faq, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="premium-card p-8 bg-white border-primary/5 hover:border-primary/20 transition-all cursor-default group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <span className="text-primary group-hover:text-white font-black text-xs">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3 leading-tight">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {!contact.faqs?.length && (
               <div className="text-center p-12 bg-white/50 rounded-3xl border border-dashed border-secondary">
                 <p className="text-muted-foreground font-medium italic">Our FAQ list is currently being updated. Please check back later.</p>
               </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Still have questions?</p>
            <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs mt-2 group">
              Chat with admissions <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
