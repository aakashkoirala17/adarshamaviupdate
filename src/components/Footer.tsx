import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <h3 className="text-lg font-bold mb-3">Adarsha Secondary School</h3>
            <p className="text-sm opacity-90 mb-2 font-nepali">आदर्श माध्यमिक विद्यालय</p>
            <p className="text-sm opacity-80">Sanothimi, Bhaktapur, Nepal</p>
            <p className="text-sm opacity-80 mt-4">Empowering Future through Technical Education</p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">Sanothimi, Bhaktapur, Nepal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="flex-shrink-0" />
                <span className="opacity-90">+977-1-6630857</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="opacity-90">info@adarshasanothimi.edu.np</span>
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-semibold mb-3">Important Links</h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://moest.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
                <span>Ministry of Education</span>
              </a>
              <a
                href="https://neb.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
                <span>National Examination Board</span>
              </a>
              <a
                href="https://ctevt.org.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
                <span>CTEVT</span>
              </a>
              <a
                href="https://doe.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
                <span>Department of Education</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-6 pt-4 text-center text-sm opacity-80">
          <p>© 2025 Adarsha Secondary School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
