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
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

/* -----------------------------
   Data & Constants
   ----------------------------- */
const heroSlides = [
  {
    id: 1,
    title: "Welcome to Adarsha Secondary School",
    nepaliTitle: "आदर्श माध्यमिक विद्यालय मा स्वागत छ",
    description: "Empowering Future through Technical Education in Sanothimi, Bhaktapur",
  },
  {
    id: 2,
    title: "Quality Education for Every Student",
    nepaliTitle: "हरेक विद्यार्थीका लागि गुणस्तरीय शिक्षा",
    description: "Shaping the minds of tomorrow with excellence and discipline.",
  },
  {
    id: 3,
    title: "A Place to Learn and Grow",
    nepaliTitle: "सिक्ने र बढ्ने उत्कृष्ट ठाउँ",
    description: "Providing academic excellence with modern learning facilities.",
  },
];

/* -----------------------------
   Small reusable utilities
   ----------------------------- */
const formatNepaliDate = (dateStr) => {
  try {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return new NepaliDate(d).format("DD MMMM YYYY", "np");
  } catch (e) {
    return "";
  }
};

/* -----------------------------
   Animated Components
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

/* -----------------------------
   Hero Component (with animations)
   ----------------------------- */
const Hero = ({ heroImages = [] }) => {
  return (
    <section className="relative bg-secondary">
      <div className="w-full">
        <div className="grid md:grid-cols-1 gap-8 items-center">
          <Carousel plugins={[Autoplay({ delay: 5000 })]} className="w-full">
            <CarouselContent>
              {heroImages.length > 0 ? (
                heroImages.map((image, index) => {
                  const text = heroSlides[index] || heroSlides[0];
                  return (
                    <CarouselItem key={image.id}>
                      <div className="overflow-hidden h-[calc(100vh-92px)] relative">

                        {/* overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

                        {/* animated text block */}
                        <div className="absolute left-5 top-0 w-full h-full flex items-center p-8 z-20">
                          <div className="max-w-xl relative space-y-4">
                            <motion.h1
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white drop-shadow-lg"
                            >
                              {text.title}
                            </motion.h1>

                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.15 }}
                              className="text-xl font-nepali text-white drop-shadow-md"
                            >
                              {text.nepaliTitle}
                            </motion.p>

                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.9, delay: 0.25 }}
                              className="text-white text-lg leading-relaxed drop-shadow"
                            >
                              {text.description}
                            </motion.p>

                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.35 }}
                              className="flex flex-wrap gap-4 pt-2"
                            >
                              <Link to="/academics">
                                <Button
                                  size="lg"
                                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-xl"
                                >
                                  Explore Programs
                                </Button>
                              </Link>

                              <Link to="/contact">
                                <Button
                                  size="lg"
                                  variant="outline"
                                  className="text-primary border-white px-8 py-3 text-lg rounded-xl"
                                >
                                  Contact Us
                                </Button>
                              </Link>
                            </motion.div>
                          </div>
                        </div>

                        {/* background image with subtle zoom animation */}
                        <motion.img
                          src={image.image_url}
                          alt={image.alt_text || "School"}
                          className="w-full h-full object-cover"
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
                  <div className="bg-muted rounded-lg h-64 md:h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BookOpen size={64} className="mx-auto mb-4" />
                      <p>School Building Image</p>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>

            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

/* -----------------------------
   Notices Component
   ----------------------------- */
const Notices = ({ notices = [] }) => (
  <AnimatedSection>
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-primary">Notice Board</h2>
              <span className="text-sm font-nepali text-brandRed ml-2">सूचना पाटी</span>
            </div>

            <div className="space-y-3">
              {notices.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground font-nepali">Loading......</p>
              ) : (
                notices.map((notice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="flex gap-4 p-3 hover:bg-secondary transition-colors rounded border-l-4 border-primary"
                  >
                    <div className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatNepaliDate(notice.date)}
                    </div>
                    <div className="text-sm text-foreground">{notice.title}</div>
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
  </AnimatedSection>
);

/* -----------------------------
   Principal Message
   ----------------------------- */
const PrincipalMessage = () => (
  <AnimatedSection delay={0.15}>
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-secondary mb-2">Principal's Message</h2>
        <p className="text-center font-nepali text-brandRed mb-8">प्रधानाध्यापकको सन्देश</p>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-muted rounded-lg w-full md:w-48 h-48 flex-shrink-0 flex items-center justify-center">
                <Users size={64} className="text-muted-foreground" />
              </motion.div>

              <div className="flex-1">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Welcome to Adarsha Secondary School, where we are committed to providing quality education and fostering a nurturing environment for every student. Our focus is on holistic development — academic excellence, technical skills, and character building.
                </p>

                <div className="mt-6">
                  <p className="font-semibold text-primary">Mr. Ram Babu Regmi</p>
                  <p className="text-sm text-muted-foreground">Principal, Adarsha Secondary School</p>
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
   Team Section with Dialog
   ----------------------------- */
const TeamSection = ({ teamMembers = [] }) => {
  const [showAll] = useState(false); // kept for potential future toggles

  const visibleTeam = teamMembers.slice(0, 8);

  return (
    <AnimatedSection delay={0.25}>
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">Our Team</h2>
          <p className="text-center font-nepali text-brandRed mb-12">हाम्रो टोली</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleTeam.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -6 }}
                className=""
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-muted rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={48} className="text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-primary mb-1">{member.name}</h3>
                    {member.name_nepali && (
                      <p className="text-sm font-nepali text-muted-foreground mb-2">{member.name_nepali}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    {member.position_nepali && (
                      <p className="text-xs font-nepali text-muted-foreground">{member.position_nepali}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {teamMembers.length > 8 && (
            <div className="flex justify-center mt-10">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">View More</Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-primary">Our Full Team</DialogTitle>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {teamMembers.map((member) => (
                      <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="bg-muted rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <Users size={48} className="text-muted-foreground" />
                            )}
                          </div>
                          <h3 className="font-semibold text-primary mb-1">{member.name}</h3>
                          {member.name_nepali && (
                            <p className="text-sm font-nepali text-muted-foreground mb-2">{member.name_nepali}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                          {member.position_nepali && (
                            <p className="text-xs font-nepali text-muted-foreground">{member.position_nepali}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <DialogClose asChild>
                    <Button className="mt-6 bg-primary hover:bg-primary/90 w-full">Close</Button>
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
   Quick Info Section
   ----------------------------- */
const QuickInfo = () => (
  <AnimatedSection delay={0.35}>
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Programs Offered</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ECD</li>
                <li>• Primary Education</li>
                <li>• Secondary Education</li>
                <li>• Computer Engineering (Grade 9-12)</li>
                <li>• +2 Computer Science (NEB)</li>
                <li>• +2 Management (NEB)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">School Timing</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Sunday - Friday: 09:00 AM - 4:00 PM</li>
                <li>• Saturday: Closed</li>
                <li>• Office Hours: 9:00 AM - 5:00 PM</li>
              </ul>
            </CardContent>
          </Card>
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchHeroImages = async () => {
      try {
        const { data } = await supabase
          .from("hero_images")
          .select("*")
          .eq("is_active", true)
          .order("display_order");
        if (mounted && data) setHeroImages(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch hero images", e);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const { data } = await supabase
          .from("team_members")
          .select("*")
          .eq("is_active", true)
          .order("display_order");
        if (mounted && data) setTeamMembers(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch team members", e);
      }
    };

    const fetchNotices = async () => {
      try {
        const { data } = await supabase
          .from("notices")
          .select("*")
          .eq("is_active", true)
          .order("display_order")
          .limit(6);
        if (mounted && data) setNotices(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch notices", e);
      }
    };

    fetchHeroImages();
    fetchTeamMembers();
    fetchNotices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout>
      <Hero heroImages={heroImages} />
      <Notices notices={notices} />
      <PrincipalMessage />
      <TeamSection teamMembers={teamMembers} />
      <QuickInfo />
    </Layout>
  );
};

export default Index;
