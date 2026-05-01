import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

const Footer = () => {
  const { settings } = useSettings();
  const general = settings?.general_info || { schoolName: "Adarsha Secondary School", schoolNameNepali: "आदर्श माध्यमिक विद्यालय" };
  const contact = settings?.contact_info || { address: "Sanothimi, Bhaktapur", phone: "01-6630857", email: "info@adarshasanothimi.edu.np" };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <h3 className="text-lg font-bold mb-3">{general.schoolName}</h3>
            <p className="text-sm opacity-90 mb-2 font-nepali">{general.schoolNameNepali}</p>
            <p className="text-sm opacity-80 text-wrap">{contact.address}</p>
            <p className="text-sm opacity-80 mt-4">Adarsha's Intention, Quality Education</p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">{contact.address.split(',')[0]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="flex-shrink-0" />
                <span className="opacity-90">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="opacity-90">{contact.email}</span>
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
          <p>© {new Date().getFullYear()} {general.schoolName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
