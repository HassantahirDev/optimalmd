import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-black pt-16 pb-6 border-t border-white/10">
    <div className="container-custom">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        {/* Column 1: Quick Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-white text-lg mb-4">Quick Links</h4>
          <div className="flex flex-col space-y-3">
            <Link to="/about-us" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/our-services" className="text-white/80 hover:text-white transition-colors">
              Services
            </Link>
            {/* <Link to="/our-blogs" className="text-white/80 hover:text-white transition-colors">
              Blog
            </Link> */}
            <Link to="/faqs" className="text-white/80 hover:text-white transition-colors">
              FAQs
            </Link>
            <Link to="/contact-us" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Column 2: Legal */}
        <div className="space-y-4">
          <h4 className="font-bold text-white text-lg mb-4">Legal</h4>
          <div className="flex flex-col space-y-3">
            <Link to="/privacy-policy" className="text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms&service" className="text-white/80 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a className="text-white/80 hover:text-white transition-colors">
              Telehealth Disclaimer
            </a>
          </div>
        </div>

        {/* Column 3: Contact & Follow Us */}
        <div className="space-y-6">
          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg mb-4">Contact</h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:support@optimalemd.health" className="text-white/80 hover:text-white transition-colors">
                support@optimalemd.health
              </a>
              <a href="tel:+12543148990" className="text-white/80 hover:text-white transition-colors">
                +1 254-314-8990
              </a>
              <div className="text-white/60 text-sm mt-2">
                Mon-Fri: 9:00 am – 5:00 pm CST
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom tagline */}
      <div className="text-center text-white/60 text-sm pt-8 border-t border-white/10">
        OptimaleMD © 2025 — Doctor-Led Men's Health Optimization
      </div>
    </div>
  </footer>
);

export default Footer;
