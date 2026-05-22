import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookOpen, Users, Bell, ArrowRight, ChevronRight, Newspaper, CheckCircle2, Phone, Mail, MapPin, FileText, FileImage, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Linkify from "@/components/Linkify";
import { useSettings } from "@/hooks/use-settings";

import { formatNepaliDate } from "@/lib/utils";

/* -----------------------------
   Animated Wrapper
   ----------------------------- */
const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const autoplay = Autoplay({ delay: 5000 });

/* -----------------------------
   Hero Section
   ----------------------------- */
const Hero = ({ images, slides = [] }: { images: any[], slides?: any[] }) => {
  const allSlides = [
    {
      id: 'hardcoded-1',
      image_url: '/building.png',
      title: "Adarsha Secondary School",
      nepaliTitle: "आदर्श माध्यमिक विद्यालय",
      description: "A premier educational institution dedicated to academic excellence and character building. Sanothimi, Bhaktapur.",
      alt_text: "School Building"
    },
    ...images
  ];

  return (
    <section className="relative bg-secondary/20 overflow-hidden">
      <Carousel plugins={[autoplay as any]} className="w-full">
        <CarouselContent>
          {allSlides.map((img, i) => {
            const slide = i === 0 ? img : (slides[i - 1] || slides[0] || { title: "Welcome to Adarsha Mavi", nepaliTitle: "आदर्श माध्यमिक विद्यालय", description: "Providing quality education for a brighter future." });

            return (
              <CarouselItem key={img.id}>
                <div className="relative w-full overflow-hidden bg-primary aspect-video md:aspect-auto md:h-[calc(100vh-92px)]">
                  {/* Text Overlay - ONLY ON FIRST SLIDE */}
                  {i === 0 && (
                    <div className="absolute inset-0 z-20 flex items-center bg-black/20 py-2 md:py-0">
                      <div className="section-container w-full">
                        <div className="max-w-2xl space-y-2 md:space-y-6">
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                          >
                            <h1 className="text-lg md:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
                              {slide.title}
                            </h1>
                            <p className="text-sm md:text-3xl font-nepali text-white/90 mt-0.5 md:mt-2 drop-shadow-xl">
                              {slide.nepaliTitle}
                            </p>
                          </motion.div>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-white/95 text-[10px] md:text-xl leading-relaxed drop-shadow-lg max-w-xl line-clamp-2 md:line-clamp-none"
                          >
                            {slide.description}
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-wrap gap-2 md:gap-4 pt-1 md:pt-4"
                          >
                            <Link to="/academics">
                              <Button size="lg" className="px-3 md:px-8 py-2 md:py-6 text-[10px] md:text-lg rounded-full shadow-xl hover:shadow-primary/20 transition-all h-8 md:h-auto">
                                Our Programs
                              </Button>
                            </Link>
                            <Link to="/contact">
                              <Button
                                size="lg"
                                variant="outline"
                                className="px-3 md:px-8 py-2 md:py-6 text-[10px] md:text-lg rounded-full border-white text-white bg-white/10 hover:bg-white hover:text-primary transition-all backdrop-blur-sm shadow-xl h-8 md:h-auto"
                              >
                                Contact Us
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Background Image or Gradient */}
                  <div className="absolute inset-0 z-0">
                    {img.image_url ? (
                      <>
                        <motion.img
                          src={img.image_url}
                          alt={img.alt_text || "School Hero"}
                          className="w-full h-full object-cover relative z-10"
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 10, ease: "linear" }}
                          loading={i === 0 ? "eager" : "lazy"}
                          fetchPriority={i === 0 ? "high" : "auto"}
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/30 z-20" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1e3a8a] to-[#0f172a] opacity-95" />
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-30 flex gap-2">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 md:h-12 md:w-12 border-white/20 bg-black/20 text-white hover:bg-primary hover:border-primary backdrop-blur-md" />
          <CarouselNext className="static translate-y-0 h-8 w-8 md:h-12 md:w-12 border-white/20 bg-black/20 text-white hover:bg-primary hover:border-primary backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  );
};

/* -----------------------------
   Notices Section
   ----------------------------- */
const Notices = ({ notices }: { notices: any[] }) => {
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  return (
    <AnimatedSection>
      <section className="py-12 md:py-24 bg-white">
        <div className="section-container">
          <div className="premium-card overflow-hidden ring-1 ring-primary/5">
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <Bell className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-primary tracking-tight">Recent Notices</h2>
                    <p className="text-xs md:text-sm font-nepali text-brandRed font-medium">ताजा सूचनाहरू</p>
                  </div>
                </div>
                <Link to="/notices">
                  <Button variant="outline" className="rounded-full px-4 md:px-6 text-xs md:text-sm group hover:bg-primary hover:text-white transition-all">
                    View All Notices <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {!notices.length ? (
                  <div className="text-center py-12 bg-secondary/20 rounded-2xl border-2 border-dashed border-secondary">
                    <p className="text-muted-foreground font-nepali">हाल कुनै सूचना उपलब्ध छैन।</p>
                  </div>
                ) : (
                  notices.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-3 md:p-5 rounded-2xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all cursor-pointer"
                      onClick={() => setSelectedNotice(n)}
                    >
                      <div className="flex-shrink-0 w-16 sm:w-24 bg-white border border-secondary shadow-sm rounded-xl p-1.5 md:p-3 text-center">
                        <span className="block text-primary font-bold text-sm md:text-lg">{formatNepaliDate(n.date).split(' ')[0]}</span>
                        <span className="block text-[7px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{formatNepaliDate(n.date).split(' ')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm md:text-lg font-bold text-primary group-hover:text-brandRed transition-colors line-clamp-1">
                            <Linkify text={n.title} />
                          </h3>
                          {n.attachment_url && (
                            <div className="shrink-0 bg-primary/5 text-primary p-1 rounded-md">
                              {n.attachment_type === 'pdf' ? <FileText size={12} /> : <FileImage size={12} />}
                            </div>
                          )}
                        </div>
                        {n.content && (
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 mt-0.5 md:mt-1">
                            <Linkify text={n.content} />
                          </p>
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center bg-white border border-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden p-0 gap-0 flex flex-col border-none shadow-2xl">
          <div className="bg-primary p-8 text-white shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary-foreground/70 mb-2">
                <Bell size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">{selectedNotice && formatNepaliDate(selectedNotice.date)}</span>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                <Linkify text={selectedNotice?.title || ""} />
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8 overflow-y-auto bg-white flex-1">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
              <Linkify text={selectedNotice?.content || ""} />
            </p>

            {selectedNotice?.attachment_url && (
              <div className="mt-8 pt-8 border-t border-secondary">
                {selectedNotice.attachment_type === 'image' ? (
                  <div className="rounded-2xl overflow-hidden border border-secondary shadow-lg">
                    <img src={selectedNotice.attachment_url} className="w-full h-auto" alt="Notice Attachment" />
                  </div>
                ) : (
                  <a
                    href={selectedNotice.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold h-16 shadow-lg hover:shadow-primary/20 transition-all text-lg">
                      <FileText size={24} /> Open PDF Document <ExternalLink size={20} />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="p-6 bg-secondary/30 border-t border-secondary flex justify-end">
            <Button onClick={() => setSelectedNotice(null)} className="rounded-full px-8">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedSection>
  );
};

/* -----------------------------
   Leadership Messages
   ----------------------------- */
const LeadershipMessageCard = ({ data, defaultTitle, defaultRole }: { data: any, defaultTitle: string, defaultRole: string }) => {
  if (!data?.message && !data?.name) return null;
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-primary/5 overflow-hidden flex flex-col h-full group hover:shadow-primary/10 transition-all duration-500 p-6 md:p-10 relative">
      <div className="absolute top-6 right-6 opacity-[0.03] text-primary pointer-events-none">
        <BookOpen className="w-20 h-20 md:w-32 md:h-32" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <span className="text-4xl md:text-6xl font-serif text-primary/20 absolute -top-4 -left-2">"</span>
        <p className="text-sm md:text-lg text-muted-foreground italic leading-relaxed font-light mb-8 mt-3 line-clamp-4 relative z-10 min-h-[5rem]">
          {data?.message || "Education is the most powerful weapon which you can use to change the world. At Adarsha, we empower students to lead and innovate."}
        </p>

        <div className="mt-auto flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pt-6 border-t border-secondary/50">
          <div className="w-24 h-32 md:w-28 md:h-36 rounded-xl overflow-hidden shrink-0 border-4 border-secondary/30 bg-secondary/10 flex items-center justify-center p-1">
            {data?.photoUrl ? (
              <img src={data.photoUrl} className="w-full h-full object-contain rounded-lg" alt={data.name || defaultTitle} loading="lazy" decoding="async" />
            ) : (
              <Users size={32} className="text-muted-foreground/20" />
            )}
          </div>
          <div className="flex flex-col justify-center text-center sm:text-left h-full py-2 sm:py-4">
            <h4 className="text-lg md:text-2xl font-bold text-primary">{data?.name || defaultTitle}</h4>
            <p className="text-xs md:text-sm font-bold text-brandRed uppercase tracking-[0.2em] mt-1">{data?.title || defaultRole}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-secondary/50">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full w-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all group font-bold">
                Read Full Message <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[2rem] overflow-hidden p-0 gap-0 border-none shadow-2xl">
              <div className="bg-primary p-6 md:p-10 text-white flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

                <div className="w-32 h-40 md:w-40 md:h-52 rounded-xl border-4 border-white/20 overflow-hidden shrink-0 shadow-xl relative z-10 bg-white/10 flex items-center justify-center p-2">
                  {data?.photoUrl ? (
                    <img src={data.photoUrl} className="w-full h-full object-contain rounded-lg bg-white" alt={data.name} loading="lazy" decoding="async" />
                  ) : (
                    <Users size={40} className="text-white/50" />
                  )}
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full pt-4">
                  <p className="text-brandRed font-bold uppercase tracking-widest text-xs md:text-sm mb-2">{data?.title || defaultRole}</p>
                  <DialogTitle className="text-2xl md:text-4xl font-bold text-white leading-tight">
                    {data?.name || defaultTitle}
                  </DialogTitle>
                </div>
              </div>
              <div className="p-6 md:p-10 max-h-[60vh] overflow-y-auto bg-white relative">
                <span className="text-6xl font-serif text-primary/10 absolute top-4 left-4 pointer-events-none">"</span>
                <p className="text-base md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-light relative z-10">
                  {data?.message || "Education is the most powerful weapon which you can use to change the world. At Adarsha, we empower students to lead and innovate."}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const LeadershipSection = ({ principal, asstHeadteacher }: { principal: any, asstHeadteacher: any }) => {
  const showPrincipal = principal?.message || principal?.name;
  const showAsst = asstHeadteacher?.message || asstHeadteacher?.name;

  if (!showPrincipal && !showAsst) return null;

  return (
    <AnimatedSection delay={0.15}>
      <section className="py-12 md:py-24 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">Leadership Messages</h2>
            <p className="font-nepali text-brandRed text-sm md:text-lg">नेतृत्वको सन्देश</p>
          </div>

          <div className={`grid gap-8 md:gap-10 ${showPrincipal && showAsst ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
            {showPrincipal && (
              <LeadershipMessageCard data={principal} defaultTitle="Mr. Ram Babu Regmi" defaultRole="Headteacher" />
            )}
            {showAsst && (
              <LeadershipMessageCard data={asstHeadteacher} defaultTitle="Assistant Headteacher" defaultRole="Assistant Headteacher" />
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

/* -----------------------------
   Why Choose Us
   ----------------------------- */
const WhyChooseUs = ({ points = [] }: { points: any[] }) => {
  const defaultPoints = [
    { title: "Experienced Faculty", desc: "Dedicated educators with years of excellence.", icon: Users },
    { title: "Quality Facilities", desc: "Modern classrooms, labs, and sports area.", icon: CheckCircle2 },
    { title: "Character Building", desc: "Focusing on ethics, leadership, and values.", icon: BookOpen },
    { title: "Rich History", desc: "Over 7 decades of educational heritage.", icon: Newspaper }
  ];

  const activePoints = points.length ? points : defaultPoints;

  return (
    <AnimatedSection delay={0.2}>
      <section className="py-12 md:py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">Why Adarsha Mavi?</h2>
            <p className="font-nepali text-brandRed text-sm md:text-lg">हामीलाई किन रोज्ने?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {activePoints.map((p: any, i: number) => {
              const Icon = p.icon || CheckCircle2;
              return (
                <div key={i} className="premium-card p-5 md:p-8 group hover:bg-primary transition-all duration-500 hover:-translate-y-2">
                  <div className="bg-primary/10 w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-primary mb-1.5 md:mb-3 group-hover:text-white transition-colors">{p.title}</h3>
                  <p className="text-xs md:text-base text-muted-foreground leading-relaxed group-hover:text-white/80 transition-colors">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

/* -----------------------------
   Team Section
   ----------------------------- */
const TeamSection = ({ team }: { team: any[] }) => {
  const visible = team.slice(0, 8);

  return (
    <AnimatedSection delay={0.25}>
      <section className="py-12 md:py-24 bg-secondary/10">
        <div className="section-container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">Our Dedicated Team</h2>
            <p className="font-nepali text-brandRed text-sm md:text-lg">हाम्रो टोली</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visible.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="premium-card p-5 md:p-8 text-center group bg-white border-primary/5 h-full flex flex-col justify-between">
                  <div className="relative inline-block mb-3 md:mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full ring-[3px] md:ring-[6px] ring-secondary border-[3px] md:border-4 border-white overflow-hidden bg-muted mx-auto shadow-md relative z-10">
                      {m.image_url ? (
                        <img src={m.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={m.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users size={32} className="text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base md:text-lg mb-1 line-clamp-1" title={m.name}>{m.name}</h3>
                    {m.name_nepali && (
                      <p className="text-xs md:text-sm font-nepali text-brandRed font-medium mb-2 md:mb-3 line-clamp-1">{m.name_nepali}</p>
                    )}
                    <div className="inline-block px-3 py-1 bg-secondary/50 rounded-full text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {m.position}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {team.length > 8 && (
            <div className="flex justify-center mt-10 md:mt-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="rounded-full px-6 md:px-10 h-12 md:h-14 text-xs md:text-sm border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20">
                    Meet the Full Team <ArrowRight className="ml-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col bg-white rounded-3xl border-none shadow-2xl">
                  <div className="p-8 bg-primary text-white shrink-0">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-bold text-white text-center">Our Entire Staff & Faculty</DialogTitle>
                      <p className="text-center text-primary-foreground/70 font-nepali mt-1">शिक्षक तथा कर्मचारी टोली</p>
                    </DialogHeader>
                  </div>
                  <div className="overflow-y-auto p-6 md:p-10 bg-secondary/10 flex-1">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
                      {team.map((m) => (
                        <div key={m.id} className="bg-white p-6 rounded-3xl border border-secondary shadow-sm text-center hover:border-primary/20 transition-all group">
                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-muted mx-auto mb-4 ring-2 ring-secondary group-hover:ring-primary/20 transition-all">
                            {m.image_url ? (
                              <img src={m.image_url} className="w-full h-full object-cover" alt={m.name} loading="lazy" decoding="async" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users size={32} className="text-muted-foreground/20" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-primary text-sm line-clamp-1">{m.name}</h3>
                          <p className="text-[10px] text-brandRed font-bold uppercase tracking-wider mt-1">{m.position}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </section>
    </AnimatedSection>
  );
};

/* -----------------------------
   Recent Blogs
   ----------------------------- */
const RecentBlogs = ({ blogs = [] }: { blogs: any[] }) => (
  <AnimatedSection delay={0.3}>
    <section className="py-12 md:py-24 bg-white">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-10 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2 tracking-tight">From Our Blog</h2>
            <p className="font-nepali text-brandRed text-sm md:text-lg">विद्यालयका गतिविधिहरू</p>
          </div>
          <Link to="/blogs">
            <Button variant="outline" className="rounded-full px-6 h-10 md:h-12 text-xs md:text-sm border-primary text-primary hover:bg-primary hover:text-white transition-all">
              Explore All Stories <ArrowRight className="ml-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {blogs.slice(0, 3).map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/blogs/${blog.id}`} className="block group">
                <div className="premium-card h-full overflow-hidden flex flex-col bg-white">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {blog.image_url ? (
                      <img src={blog.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} loading="lazy" decoding="async" />
                    ) : (
                      <div className="bg-muted w-full h-full flex items-center justify-center">
                        <Newspaper size={48} className="text-muted-foreground/10" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                        {blog.category || "Education"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">
                      <span className="text-brandRed">{new Date(blog.published_at).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-secondary rounded-full" />
                      <span>{blog.author_name}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4 line-clamp-2 group-hover:text-brandRed transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-5 md:mb-6 text-xs md:text-sm">
                      {blog.excerpt || blog.content.substring(0, 120).replace(/<[^>]*>?/gm, '') + "..."}
                    </p>
                    <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm uppercase tracking-widest group-hover:gap-2 transition-all">
                      Read Story <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </CardContent>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </AnimatedSection>
);

/* -----------------------------
   Quick Info / CTA
   ----------------------------- */
const QuickInfo = ({ contact = {} as any }: { contact: any }) => (
  <AnimatedSection delay={0.4}>
    <section className="py-12 md:py-24 bg-primary text-white overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl md:blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-brandRed/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl md:blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Ready to join the Adarsha family?</h2>
            <p className="text-primary-foreground/80 text-sm md:text-lg mb-6 md:mb-10 leading-relaxed max-w-lg">
              Admissions are now open for the upcoming academic session. Contact us today to secure your child's future in one of Nepal's most prestigious institutions.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-secondary transition-all rounded-full px-6 h-12 md:px-10 md:h-16 text-sm md:text-lg font-bold">
                  Enquire Now
                </Button>
              </Link>
              <a href={`tel:${contact.phone || '014234567'}`}>
                <Button size="lg" variant="outline" className="bg-white/5 border-white/60 text-white hover:bg-white hover:text-primary transition-all rounded-full px-6 h-12 md:px-10 md:h-16 text-sm md:text-lg shadow-lg">
                  Call Us
                </Button>
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-white/10">
              <div className="bg-white/10 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-6">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold mb-1 md:mb-2">Call Us</h4>
              <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">{contact.phone || "+977-1-4XXXXXX"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-white/10">
              <div className="bg-white/10 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-6">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold mb-1 md:mb-2">Email Us</h4>
              <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">{contact.email || "info@adarshamavi.edu.np"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-white/10 col-span-full">
              <div className="bg-white/10 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-6">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold mb-1 md:mb-2">Visit Us</h4>
              <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">{contact.address || "Patan, Lalitpur, Nepal"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AnimatedSection>
);

/* -----------------------------
   Main Page
   ----------------------------- */
const Index = () => {
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    const load = async () => {
      const [hero, teamRes, noticeRes, blogRes] = await Promise.all([
        supabase.from("hero_images").select("*").eq("is_active", true).order("display_order"),
        supabase.from("team_members").select("*").eq("is_active", true).order("display_order"),
        supabase.from("notices").select("*").eq("is_active", true).order("date", { ascending: false }).limit(6),
        (supabase.from("blogs" as any) as any).select("*").eq("is_active", true).order("published_at", { ascending: false }).limit(3),
      ]);

      setHeroImages(hero.data || []);
      setTeam(teamRes.data || []);
      setNotices(noticeRes.data || []);
      setBlogs(blogRes.data || []);
    };

    load();
  }, []);

  return (
    <Layout>
      <Hero images={heroImages} slides={settings?.homepage_content?.heroSlides} />
      <Notices notices={notices} />
      <LeadershipSection principal={settings?.principal_message} asstHeadteacher={settings?.asst_headteacher_message} />
      <WhyChooseUs points={settings?.homepage_content?.whyChooseUs} />
      <RecentBlogs blogs={blogs} />
      <TeamSection team={team} />
      <QuickInfo contact={settings?.contact_info} />
    </Layout>
  );
};

export default Index;
