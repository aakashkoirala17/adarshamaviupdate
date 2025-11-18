import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BookOpen, Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import NepaliDate from 'nepali-date-converter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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


const Index = () => {
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [showAllTeams, setShowAllTeams] = useState(false);

  const visibleTeam = showAllTeams ? teamMembers : teamMembers.slice(0, 8);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase.from("hero_images").select("*").eq("is_active", true).order("display_order");
      if (data) setHeroImages(data);
    };

    const fetchTeamMembers = async () => {
      const { data } = await supabase.from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (data) setTeamMembers(data);
    };

    const fetchNotices = async () => {
      const { data } = await supabase.from("notices")
        .select("*")
        .eq("is_active", true)
        .order("display_order")
        .limit(4);
      if (data) setNotices(data);
    };

    fetchHeroImages();
    fetchTeamMembers();
    fetchNotices();
  }, []);

  return (
    <Layout>
     {/* Hero Section */}
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

                    {/* TEXT OVERLAY */}
               
<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

<div className="absolute left-5 top-0 w-full h-full flex items-center p-8">
  <div className="max-w-xl relative z-10 space-y-4">

    {/* English Heading */}
    <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white drop-shadow-lg">
      {text.title}
    </h1>

    {/* Nepali Heading */}
    <p className="text-xl font-nepali text-white drop-shadow-md">
      {text.nepaliTitle}
    </p>

    {/* Description */}
    <p className="text-white text-lg leading-relaxed drop-shadow">
      {text.description}
    </p>

    {/* Buttons */}
    <div className="flex flex-wrap gap-4 pt-2">
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
    </div>

  </div>
</div>



                    {/* BACKGROUND IMAGE */}
                    <img
                      src={image.image_url}
                      alt={image.alt_text || "School"}
                      className="w-full h-full object-cover"
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


      {/* Notice Board Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-primary">Notice Board</h2>
                <span className="text-sm font-nepali  text-brandRed ml-2">सूचना पाटी</span>
              </div>

            <div className="space-y-3">
  {notices.length === 0 ? (
    <p className="text-center text-sm text-muted-foreground font-nepali">
      Loading......
    </p>
  ) : (
    notices.map((notice, index) => {
      const nepaliDate = notice.date
        ? new NepaliDate(new Date(notice.date)).format("DD MMMM YYYY", "np")
        : "";

      return (
        <div
          key={index}
          className="flex gap-4 p-3 hover:bg-secondary transition-colors rounded border-l-4 border-primary"
        >
          <div className="text-sm font-semibold text-primary whitespace-nowrap">
            {nepaliDate}
          </div>
          <div className="text-sm text-foreground">{notice.title}</div>
        </div>
      );
    })
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

      {/* Principal Message Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-2">Principal's Message</h2>
          <p className="text-center font-nepali text-brandRed mb-8">प्रधानाध्यापकको सन्देश</p>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-muted rounded-lg w-full md:w-48 h-48 flex-shrink-0 flex items-center justify-center">
                  <Users size={64} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Welcome to Adarsha Secondary School, where we are committed to providing quality education...
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

     {/* ✅ Our Team Section (Dialog View More + Centered Button) */}
<section className="py-16 bg-background">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-primary mb-2">Our Team</h2>
    <p className="text-center font-nepali text-brandRed mb-12">हाम्रो टोली</p>

    {/* Show only first 8 members */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {visibleTeam.map((member) => (
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

    {/* ✅ View More Centered Dialog Button */}
    {teamMembers.length > 8 && (
      <div className="flex justify-center mt-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View More
            </Button>
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


      {/* Quick Info Section */}
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
    </Layout>
  );
};

export default Index;
