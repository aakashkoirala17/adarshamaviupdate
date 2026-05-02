import { Phone, Mail, MapPin, ExternalLink, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Link } from "react-router-dom";

const Footer = () => {
  const { settings } = useSettings();
  const general = settings?.general_info || { schoolName: "Adarsha Secondary School", schoolNameNepali: "आदर्श माध्यमिक विद्यालय" };
  const contact = settings?.contact_info || { address: "Sanothimi, Bhaktapur", phone: "01-6630857", email: "info@adarshasanothimi.edu.np" };

  return (
    <footer className="bg-[#0f172a] text-white pt-12 md:pt-24 pb-8 md:pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-16 mb-12 md:mb-20">
          {/* School Branding */}
          <div className="lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-4 tracking-tight uppercase">
              {general.schoolName}
            </h3>
            <p className="text-brandRed font-nepali font-bold text-base md:text-lg mb-4 md:mb-6 leading-tight">
              {general.schoolNameNepali}
            </p>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
              "Adarsha's Intention, Quality Education." Dedicated to excellence in education for over seven decades.
            </p>
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                <Facebook className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60 group-hover:text-white" />
              </a>
              <a href="#" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                <Twitter className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60 group-hover:text-white" />
              </a>
              <a href="#" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                <Instagram className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60 group-hover:text-white" />
              </a>
              <a href="#" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                <Youtube className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1.5 md:-bottom-2 left-0 w-6 md:w-8 h-1 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-primary transition-colors">Academic Programs</Link></li>
              <li><Link to="/blogs" className="hover:text-primary transition-colors">Latest News</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Photo Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-8 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-1.5 md:-bottom-2 left-0 w-6 md:w-8 h-1 bg-primary rounded-full" />
            </h4>
            <div className="space-y-4 md:space-y-6 text-xs md:text-sm text-white/60">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-[18px] md:h-[18px] text-primary" />
                </div>
                <p className="leading-relaxed">{contact.address}</p>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 md:w-[18px] md:h-[18px] text-primary" />
                </div>
                <p>{contact.phone}</p>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 md:w-[18px] md:h-[18px] text-primary" />
                </div>
                <p className="break-all">{contact.email}</p>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 md:mb-8 relative inline-block">
              Important Links
              <span className="absolute -bottom-1.5 md:-bottom-2 left-0 w-6 md:w-8 h-1 bg-primary rounded-full" />
            </h4>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm text-white/60">
              <a href="https://moest.gov.np" target="_blank" rel="noopener" className="flex items-center justify-between hover:text-white transition-all group">
                Ministry of Education <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
              <a href="https://neb.gov.np" target="_blank" rel="noopener" className="flex items-center justify-between hover:text-white transition-all group">
                National Examination Board <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
              <a href="https://ctevt.org.np" target="_blank" rel="noopener" className="flex items-center justify-between hover:text-white transition-all group">
                CTEVT <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
              <a href="https://doe.gov.np" target="_blank" rel="noopener" className="flex items-center justify-between hover:text-white transition-all group">
                Department of Education <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/40 text-center md:text-left">
          <p>© {new Date().getFullYear()} {general.schoolName}. All rights reserved.</p>
          <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
