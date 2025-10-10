import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero-collage.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const features = [
    "Comprehensive lab testing to uncover the root cause.",
    "One-on-one coaching with a physician who listens.", 
    "Targeted therapies — from testosterone to weight loss — shipped to your door."
  ];

  const stats = [
    { number: "500+", text: "OptimaleMD clients transformed" }
  ];

  const handleStartJourney = () => {
    navigate("/login");
  };

  return (
    <section className="section-padding pt-32 lg:pt-40 relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Stats */}
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm lg:text-base">
                {stats[0].number} OptimaleMD clients transformed
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Reclaim Your Energy and Confidence
              </h2>
              <p className="text-xl text-muted-foreground">
                Personalized health optimization without insurance hassles or cookie-cutter care.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                  <span className="text-xl text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button className="btn-hero" onClick={() => navigate("/book-appointment")}>
                Book Appointment
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
              <img 
                src={heroImage} 
                alt="Diverse group of OptimaleMD clients"
                className="w-full h-auto object-contain"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full blur-xl opacity-60" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent rounded-full blur-lg opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;