import { useState, useCallback, useEffect } from "react";
import { Menu, X, ChevronRight, Phone, Mail } from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";

/* --------------------------------
   Navigation Items
----------------------------------- */
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Notices", path: "/notices" },
  { name: "Academics", path: "/academics" },
  { name: "Blogs", path: "/blogs" },
  { name: "Downloads", path: "/downloads" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

/* --------------------------------
   Desktop Nav Item
----------------------------------- */
const DesktopNavItem = ({ name, path, beta }: { name: string; path: string; beta?: boolean }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `relative px-5 py-2 text-sm font-bold tracking-tight uppercase transition-all duration-300 flex items-center gap-1.5 group whitespace-nowrap
      ${isActive ? "text-primary" : "text-foreground/70 hover:text-primary"}`
    }
  >
    {({ isActive }) => (
      <>
        {name}
        {beta && (
          <span className="text-[9px] bg-brandRed text-white px-1.5 py-0.5 rounded-full font-black tracking-widest">
            BETA
          </span>
        )}
        <span 
          className={`absolute bottom-0 left-5 right-5 h-0.5 bg-primary transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${isActive ? 'scale-x-100' : ''}`} 
        />
      </>
    )}
  </NavLink>
);

/* --------------------------------
   Mobile Nav Item
----------------------------------- */
const MobileNavItem = ({ name, path, close, beta }: { name: string; path: string; close: () => void; beta?: boolean }) => (
  <NavLink
    to={path}
    onClick={close}
    className={({ isActive }) =>
      `flex items-center justify-between px-6 py-4 text-lg font-bold rounded-2xl transition-all whitespace-nowrap
       ${isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-foreground hover:bg-secondary"}`
    }
  >
    {({ isActive }) => (
      <>
        <span>{name}</span>
        <div className="flex items-center gap-2">
          {beta && (
            <span className="text-[10px] bg-brandRed text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
              BETA
            </span>
          )}
          <ChevronRight size={18} className={isActive ? "text-white" : "text-muted-foreground"} />
        </div>
      </>
    )}
  </NavLink>
);

/* --------------------------------
   Logo
----------------------------------- */
const LogoSection = () => {
  const { settings } = useSettings();
  const general = settings?.general_info || {};
  const contact = settings?.contact_info || {};

  return (
    <NavLink to="/" className="flex items-center gap-3 group">
      <div className="bg-white p-0.5 rounded-lg group-hover:rotate-3 transition-transform duration-500">
        <img 
          src={general.logoUrl || "/logo.png"} 
          className="w-14 h-10 md:w-16 md:h-12 object-contain" 
          alt="School Logo" 
        />
      </div>
      <div className="hidden sm:block">
        <h1 className="text-sm md:text-base font-black text-primary leading-tight uppercase tracking-tight">
          {general.schoolName || "Adarsha Secondary School"}
        </h1>
        <p className="text-[10px] md:text-xs font-nepali text-brandRed font-bold">
          {general.schoolNameNepali || "आदर्श माध्यमिक विद्यालय"}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="w-1 h-1 bg-secondary rounded-full" />
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
            {contact.address?.split(',')[1] || "Sanothimi, Bhaktapur"}
          </p>
        </div>
      </div>
    </NavLink>
  );
};

/* --------------------------------
   Navigation Component
----------------------------------- */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { pathname } = useLocation();
  const { settings } = useSettings();
  const contact = settings?.contact_info || {};

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // scrolled state for styling
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // SCROLLING DOWN -> VANISH (Standard)
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // SCROLLING UP -> SHOW
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -200 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-[40]"
    >
      {/* Top Bar - Only on Desktop */}
      <div className="hidden lg:block bg-primary py-1.5 text-white/80 text-[9px] font-bold tracking-[0.2em] uppercase">
        <div className="section-container flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone size={10} className="text-brandRed" /> {contact.phone || "01-6630857"}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={10} className="text-brandRed" /> {contact.email || "info@adarshasanothimi.edu.np"}
            </span>
          </div>
          <div>Admissions Open for Session 2081</div>
        </div>
      </div>

      <nav 
        className={`transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl py-1.5 shadow-xl ring-1 ring-black/5" : "bg-white py-3"
        }`}
      >
        <div className="section-container">
          <div className="flex justify-between items-center">
            <LogoSection />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <DesktopNavItem key={item.name} {...item} />
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <Link to="/contact" className="hidden sm:block">
                <Button className="rounded-full px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                  Enquire
                </Button>
              </Link>
              <button
                aria-label="Toggle Menu"
                className="lg:hidden h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary text-primary hover:bg-primary hover:text-white transition-all"
                onClick={openMenu}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
              />

              <motion.aside
                className="fixed top-0 right-0 w-full max-w-[400px] h-full bg-white z-[120] shadow-2xl p-0 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="p-8 border-b border-secondary flex justify-between items-center bg-primary text-white">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Navigation</h2>
                    <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Main Menu</p>
                  </div>
                  <button 
                    onClick={closeMenu}
                    className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-6 space-y-3">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <MobileNavItem {...item} close={closeMenu} />
                    </motion.div>
                  ))}
                </nav>

                <div className="p-8 border-t border-secondary bg-secondary/20">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 text-center">Get in Touch</p>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="tel:+977" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-secondary">
                      <Phone size={20} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase">Call Us</span>
                    </a>
                    <a href="mailto:info@" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-secondary">
                      <Mail size={20} className="text-brandRed" />
                      <span className="text-[10px] font-bold uppercase">Email</span>
                    </a>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navigation;
