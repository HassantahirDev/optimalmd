import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "How it Works", path: "/how-it-works" },
    { label: "About Us", path: "/about-us" },
    { label: "Our Services", path: "/our-services" },
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Our Blog", path: "/our-blog" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "FAQs", path: "/faqs" },
    { label: "Terms & Service", path: "/terms&service" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  const handleStartJourney = () => {
    navigate("/login");
  };

  return (
    <nav className="relative z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                O
              </span>
            </div>
            <Link to="/" className="text-xl font-bold focus:outline-none">
              OPTIMALE<span className="text-primary">MD</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="btn-hero" onClick={handleStartJourney}>
              Start your journey
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-foreground hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                className="btn-hero w-full mt-4" 
                onClick={() => {
                  handleStartJourney();
                  setIsOpen(false);
                }}
              >
                Start your journey
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;