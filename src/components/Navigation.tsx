import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Notices", path: "/notices" },
    { name: "Academics", path: "/academics" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white border-b-4 border-primary sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Nepal Government Logo Area and School Name */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-18 h-14 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  Adarsha
                  <br />
                  Secondary
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary leading-tight">Adarsha Secondary School</h1>
                <p className="text-base font-nepali text-primary font-semibold">आदर्श माध्यमिक विद्यालय</p>
                <p className="text-xs text-muted-foreground">Sanothimi, Bhaktapur</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-foreground hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary hover:text-primary/80">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-foreground hover:bg-accent px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : ""
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
