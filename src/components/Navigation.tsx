import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* --------------------------------
   Navigation Items
----------------------------------- */
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Notices", path: "/notices" },
  { name: "Academics", path: "/academics" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

/* --------------------------------
   Desktop Nav Item
----------------------------------- */
const DesktopNavItem = ({ name, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `relative px-4 py-2 text-sm font-medium transition-colors
      ${isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"}`
    }
  >
    {({ isActive }) => (
      <>
        {name}
        {isActive && (
          <motion.div
            layoutId="underline"
            className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary rounded-full"
          />
        )}
      </>
    )}
  </NavLink>
);

/* --------------------------------
   Mobile Nav Item
----------------------------------- */
const MobileNavItem = ({ name, path, close }) => (
  <NavLink
    to={path}
    onClick={close}
    className={({ isActive }) =>
      `block px-4 py-3 text-lg font-medium rounded
       ${isActive ? "bg-primary text-white" : "hover:bg-accent"}`
    }
  >
    {name}
  </NavLink>
);

/* --------------------------------
   Logo
----------------------------------- */
const LogoSection = () => (
  <NavLink to="/" className="flex items-center gap-4">
    <img src="/logo.png" className="w-20 h-14 object-contain" alt="School Logo" />
    <div>
      <h1 className="text-lg font-bold text-primary leading-tight">
        Adarsha Secondary School
      </h1>
      <p className="text-base font-nepali text-primary font-semibold">
        आदर्श माध्यमिक विद्यालय
      </p>
      <p className="text-xs text-brandRed">Sanothimi, Bhaktapur</p>
    </div>
  </NavLink>
);

/* --------------------------------
   Sidebar Animation — FIXED
----------------------------------- */
const sidebarVariants: any = {
  hidden: { x: "-100%" },
  visible: {
    x: "0%",
    transition: { type: "spring", stiffness: 170, damping: 22 },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring", stiffness: 160, damping: 24 },
  },
};

/* --------------------------------
   Navigation Component
----------------------------------- */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <nav className="bg-white border-b-4 border-primary sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <LogoSection />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem key={item.name} {...item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open Menu"
            className="md:hidden text-primary hover:text-primary/80"
            onClick={openMenu}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-[120] p-5"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button aria-label="Close Menu" onClick={closeMenu}>
                  <X size={26} className="text-primary" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2">
                {NAV_ITEMS.map((item) => (
                  <MobileNavItem key={item.name} {...item} close={closeMenu} />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
