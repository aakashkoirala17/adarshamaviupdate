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
import { BookOpen, Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import NepaliDate from "nepali-date-converter";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Linkify from "@/components/Linkify";
import { useSettings } from "@/hooks/use-settings";

/* -----------------------------
   Constants (Moved to DB)
   ----------------------------- */

/* -----------------------------
   Utility Functions
   ----------------------------- */
const formatNepaliDate = (dateStr) => {
  try {
    return dateStr ? new NepaliDate(new Date(dateStr)).format("DD MMMM YYYY", "np") : "";
  } catch {
    return "";
  }
};

/* -----------------------------
   Animated Wrapper
   ----------------------------- */
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);
const autoplay = Autoplay({ delay: 5000 }) as any;
/* -----------------------------
   Hero Section
   ----------------------------- */
const Hero = ({ images, slides = [] }) => (
  <section className="relative bg-secondary">
    <Carousel plugins={[autoplay]} className="w-full">
      <CarouselContent>
        {images.length ? (
          images.map((img, i) => {
            const slide = slides[i] || slides[0] || { title: "", nepaliTitle: "", description: "" };

            return (
              <CarouselItem key={img.id}>
                <div className="relative overflow-hidden h-[calc(100vh-92px)]">

                  {/* Shadow Overlay removed to make image bright */}

                  {/* Text Area - Only shown for the first slide */}
                  {i === 0 && (
                    <div className="absolute inset-y-0 left-5 flex items-center p-8 z-20">
                      <div className="max-w-xl space-y-4">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white drop-shadow-lg"
                        >
                          {slide.title}
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.15 }}
                          className="text-xl font-nepali text-white drop-shadow-md"
                        >
                          {slide.nepaliTitle}
                        </motion.p>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.9, delay: 0.25 }}
                          className="text-white text-lg leading-relaxed drop-shadow"
                        >
                          {slide.description}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.35 }}
                          className="flex flex-wrap gap-4 pt-2"
                        >
                          <Link to="/academics">
                            <Button size="lg" className="px-8 py-3 text-lg rounded-xl">
                              Explore Programs
                            </Button>
                          </Link>

                          <Link to="/contact">
                            <Button
                              size="lg"
                              variant="outline"
                              className="px-8 py-3 text-lg rounded-xl text-brandRed border-white"
                            >
                              Contact Us
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Background Image */}
                  <motion.img
                    src={img.image_url}
                    alt={img.alt_text || "School"}
                    className="w-full h-full object-cover brightness-[1.1]"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8 }}
                  />
                </div>
              </CarouselItem>
            );
          })
        ) : (
          <CarouselItem>
            <div className="bg-muted h-64 md:h-80 flex items-center justify-center rounded-lg">
              <BookOpen size={64} className="mb-4" />
              <p>No Images</p>
            </div>
          </CarouselItem>
        )}
      </CarouselContent>

      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  </section>
);

/* -----------------------------
   Notices Section
   ----------------------------- */
const Notices = ({ notices }) => {
  const [selectedNotice, setSelectedNotice] = useState(null);

  return (
    <AnimatedSection>
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={24} className="text-primary" />
                <h2 className="text-2xl font-bold text-primary">Notice Board</h2>
                <span className="text-sm font-nepali text-brandRed ml-2">सूचना पाटी</span>
              </div>

              <div className="space-y-3">
                {!notices.length ? (
                  <p className="text-center text-sm font-nepali text-muted-foreground">
                    Loading...
                  </p>
                ) : (
                  notices.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.05 }}
                      className="flex gap-4 p-3 rounded border-l-4 border-primary hover:bg-secondary transition cursor-pointer"
                      onClick={() => setSelectedNotice(n)}
                    >
                      <div className="text-sm font-semibold text-primary whitespace-nowrap">
                        {formatNepaliDate(n.date)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-primary">
                          <Linkify text={n.title} />
                        </div>
                        {n.content && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            <Linkify text={n.content} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-4 text-right">
                <Link to="/notices">
                  <Button variant="outline" size="sm">
                    View All Notices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              <Linkify text={selectedNotice?.title || ''} />
            </DialogTitle>
            <div className="flex items-center text-sm text-brandRed mt-2">
              <Bell size={14} className="mr-1" />
              {selectedNotice && formatNepaliDate(selectedNotice.date)}
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedNotice?.content && (
              <p className="text-foreground whitespace-pre-wrap">
                <Linkify text={selectedNotice.content} />
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedSection>
  );
};

/* -----------------------------
   Principal Message
   ----------------------------- */
const PrincipalMessage = ({ principal }) => (
  <AnimatedSection delay={0.15}>
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-secondary mb-2">Principal's Message</h2>
        <p className="text-center font-nepali text-brandRed mb-8">प्रधानाध्यापकको सन्देश</p>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-muted rounded-lg w-full md:w-48 h-48 flex items-center justify-center flex-shrink-0 overflow-hidden"
              >
                {principal?.photoUrl ? (
                  <img src={principal.photoUrl} className="w-full h-full object-cover" alt={principal.name} />
                ) : (
                  <Users size={64} className="text-muted-foreground" />
                )}
              </motion.div>

              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  {principal?.message || "Welcome to Adarsha Secondary School."}
                </p>

                <div className="mt-6">
                  <p className="font-semibold text-primary">{principal?.name || "Principal Name"}</p>
                  <p className="text-sm text-muted-foreground">{principal?.title || "Principal"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </AnimatedSection>
);

/* -----------------------------
   Team Section
   ----------------------------- */
const TeamSection = ({ team }) => {
  const visible = team.slice(0, 8);

  return (
    <AnimatedSection delay={0.25}>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">Our Team</h2>
          <p className="text-center font-nepali text-brandRed mb-12">हाम्रो टोली</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visible.map((m) => (
              <motion.div key={m.id} whileHover={{ y: -6 }}>
                <Card className="text-center hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="bg-muted rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                      {m.image_url ? (
                        <img src={m.image_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Users size={48} className="text-muted-foreground mx-auto" />
                      )}
                    </div>
                    <h3 className="font-semibold text-primary">{m.name}</h3>
                    {m.name_nepali && (
                      <p className="text-sm font-nepali text-muted-foreground">{m.name_nepali}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{m.position}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {team.length > 8 && (
            <div className="flex justify-center mt-10">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">View More</Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl max-h-[75vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-primary">Our Full Team</DialogTitle>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {team.map((m) => (
                      <Card key={m.id} className="text-center hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="bg-muted rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                            {m.image_url ? (
                              <img src={m.image_url} className="w-full h-full object-cover" />
                            ) : (
                              <Users size={48} className="text-muted-foreground mx-auto" />
                            )}
                          </div>

                          <h3 className="font-semibold text-primary">{m.name}</h3>
                          {m.name_nepali && (
                            <p className="text-sm font-nepali text-muted-foreground">{m.name_nepali}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{m.position}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <DialogClose asChild>
                    <Button className="mt-6 w-full">Close</Button>
                  </DialogClose>
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
   Why Choose Us
   ----------------------------- */
const WhyChooseUs = ({ points = [] }) => {
  return (
    <AnimatedSection delay={0.3}>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">Why Choose Us?</h2>
          <p className="text-center font-nepali text-brandRed mb-10">हामीलाई किन रोज्ने?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {points.map((p, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

/* -----------------------------
   Quick Info
   ----------------------------- */
const QuickInfo = ({ programs = [], contact = {} as any }) => (
  <AnimatedSection delay={0.35}>
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-primary">Programs Offered</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              {programs.map((p, i) => (
                <li key={i}>• {(p as any).title}</li>
              ))}
              {!programs.length && (
                <>
                  <li>• ECED (Early Childhood Education)</li>
                  <li>• Primary & Secondary Education</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-primary mb-4">School Timing</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• {contact.officeHours || "Monday - Friday: 09:00 AM - 5:00 PM"}</li>
              <li>• Saturday: Closed</li>
              <li>• Office Hours: 6:00 AM - 6:00 PM</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  </AnimatedSection>
);

/* -----------------------------
   Recent Blogs
   ----------------------------- */
const RecentBlogs = ({ blogs = [] }) => (
  <AnimatedSection delay={0.4}>
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Latest Stories</h2>
            <p className="font-nepali text-brandRed">ताजा कथाहरू</p>
          </div>
          <Link to="/blogs">
            <Button variant="outline">View All Blogs</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <Card key={blog.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                {blog.image_url ? (
                  <img src={blog.image_url} className="w-full h-full object-cover" alt={blog.title} />
                ) : (
                  <div className="bg-muted w-full h-full flex items-center justify-center">
                    <BookOpen className="text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(blog.published_at).toLocaleDateString()} • {blog.author_name}
                </p>
                <h3 className="font-bold text-primary mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 100) + "..."}
                </p>
                <Link to={`/blogs/${blog.id}`}>
                  <Button variant="link" className="p-0 h-auto text-primary">Read More →</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </AnimatedSection>
);

/* -----------------------------
   Main Page
   ----------------------------- */
const Index = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [team, setTeam] = useState([]);
  const [notices, setNotices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    const load = async () => {
      const [hero, teamRes, noticeRes, blogRes] = await Promise.all([
        supabase.from("hero_images").select("*").eq("is_active", true).order("display_order"),
        supabase.from("team_members").select("*").eq("is_active", true).order("display_order"),
        supabase.from("notices").select("*").eq("is_active", true).order("display_order").limit(6),
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
      <PrincipalMessage principal={settings?.principal_message} />
      <WhyChooseUs points={settings?.homepage_content?.whyChooseUs} />
      <RecentBlogs blogs={blogs} />
      <TeamSection team={team} />
      <QuickInfo programs={settings?.academics_programs} contact={settings?.contact_info} />
    </Layout>
  );
};

export default Index;
