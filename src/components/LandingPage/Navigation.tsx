import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  Phone,
  FileText,
  Shield,
  HelpCircle,
  Stethoscope,
  LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  path: string;
  icon?: LucideIcon;
  highlight?: boolean;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (dropdownOpen && !target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const mainNavItems = [
    { label: "How it Works", path: "/how-it-works" },
    { label: "About Us", path: "/about-us" },
    { label: "Our Services", path: "/our-services" },
    {
      label: "Contact Us",
      path: "/contact-us",
      icon: Phone,
      highlight: false,
    },
  ];

  const dropdownItems: NavItem[] = [
    { label: "Contact Us", path: "/contact-us", icon: Phone },
    { label: "FAQs", path: "/faqs", icon: HelpCircle },
  ];

  const handleStartJourney = () => {
    navigate("/login");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={cn(
        "relative z-50 transition-all duration-300",
        scrolled
          ? "bg-background/98 backdrop-blur-xl border-b border-border/60 shadow-lg"
          : "bg-background/95 backdrop-blur-md border-b border-border/40"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="OptimaleMD Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <Link
              to="/"
              className="text-2xl font-bold focus:outline-none hover:scale-105 transition-transform duration-200 text-white"
            >
              Optimale<span className="text-white">MD</span>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-accent/50 hover:text-primary",
                  isActiveRoute(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-foreground",
                  item.highlight && "text-primary font-semibold"
                )}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && <item.icon size={16} />}
                  <span>{item.label}</span>
                </div>
                {isActiveRoute(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Enhanced Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-accent/50 hover:text-primary text-foreground"
                )}
              >
                <span>More</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
                  <div className="py-2">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-200",
                          "hover:bg-accent/50 hover:text-primary",
                          isActiveRoute(item.path)
                            ? "text-primary bg-primary/10"
                            : "text-foreground"
                        )}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="hidden lg:block">
            <Button
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={handleStartJourney}
            >
              Start your journey
            </Button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-3 rounded-lg transition-all duration-200",
              "hover:bg-accent/50 text-foreground hover:text-primary",
              isOpen && "bg-accent/50 text-primary"
            )}
          >
            <div className="relative w-6 h-6">
              <Menu
                size={24}
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                )}
              />
              <X
                size={24}
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                )}
              />
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 border-t border-border/40">
            <div className="space-y-1">
              {[...mainNavItems, ...dropdownItems].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover:text-primary",
                    isActiveRoute(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-foreground",
                    item.highlight && "text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.label}</span>
                  {item.highlight && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-6 px-4">
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                onClick={() => {
                  handleStartJourney();
                  setIsOpen(false);
                }}
              >
                Start your journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
