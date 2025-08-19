import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    "How it Works",
    "About Us",
    "Our Services",
    "Our Blog",
    "Contact Us",
    "FAQs",
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
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
            {navItems.map((item) =>
              item === "Leadership" ? (
                <Link
                  key={item}
                  to="/leadership"
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item}
                </Link>
              ) : item === "How it Works" ? (
                <Link
                  key={item}
                  to="/how-it-works"
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item}
                </Link>
              ) : item === "Our Services" ? (
                <Link
                  key={item}
                  to="/our-services"
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item}
                </Link>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="btn-hero">Start your journey</Button>
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
              {navItems.map((item) =>
                item === "Leadership" ? (
                  <Link
                    key={item}
                    to="/leadership"
                    className="block text-foreground hover:text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ) : item === "How it Works" ? (
                  <Link
                    key={item}
                    to="/how-it-works"
                    className="block text-foreground hover:text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-foreground hover:text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}
              <Button className="btn-hero w-full mt-4">
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
