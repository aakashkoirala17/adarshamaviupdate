import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Notices", path: "/notices" },
  { name: "Academics", path: "/academics" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

// Desktop Nav Item with underline animation
const DesktopNavItem = ({ name, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `relative px-4 py-2 text-sm font-medium transition-colors
      ${isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"}`
    }
  >
    {({ isActive }) => (
      <>
        {name}
        {isActive && (
          <motion.div
            layoutId="underline"
            className="absolute left-0 right-0 h-[2px] bg-primary bottom-0 rounded-full"
          />
        )}
      </>
    )}
  </NavLink>
);

// Mobile Nav Item
const MobileNavItem = ({ name, path, onClick }) => (
  <NavLink
    to={path}
    onClick={onClick}
    className={({ isActive }) =>
      `px-4 py-3 text-lg font-medium rounded 
       ${isActive ? "bg-primary text-white" : "hover:bg-accent"}`
    }
  >
    {name}
  </NavLink>
);

// Logo area
const LogoSection = () => (
  <NavLink to="/" className="flex items-center space-x-4">
    <img src="/logo.png" className="w-18 h-14 rounded object-contain" alt="Logo" />
    <div>
      <h1 className="text-lg font-bold text-primary leading-tight">Adarsha Secondary School</h1>
      <p className="text-base font-nepali text-primary font-semibold">आदर्श माध्यमिक विद्यालय</p>
      <p className="text-xs text-brandRed">Sanothimi, Bhaktapur</p>
    </div>
  </NavLink>
);

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b-4 border-primary sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-3">
          <LogoSection />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <DesktopNavItem key={item.name} {...item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary hover:text-primary/80 transition"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* SLIDE-IN SIDEBAR */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-[120] p-5"
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={26} className="text-primary" />
                </button>
              </div>

              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.name}
                    {...item}
                    onClick={() => setIsMenuOpen(false)}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
