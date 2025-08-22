import React, { useEffect, useRef, useState } from "react";
import { Check, Shield, Clock, Star, Award, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import phoneImage from "../../assets/phone-consultation.jpg";

const InvestmentSection = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      title: "Personalized Assessment",
      description:
        "Meet your expert OptimaleMD Coach to discuss your symptoms and goals.",
    },
    {
      title: "In-Depth Lab Analysis",
      description:
        "Receive a custom report with actionable recommendations based on your individual lab results.",
    },
    {
      title: "Expert Medical Oversight",
      description:
        "A 25-minute consultation with a licensed medical provider to discuss your health blueprint and prescription treatments.",
    },
    {
      title: "Delivered To Your Door",
      description:
        "Exclusive access to OptimaleMD's FDA-approved pharmacies and supplement dispensaries.",
    },
    {
      title: "Proactive Care",
      description:
        "Monthly OptimaleMD Coach check-ins, treatment refills, follow-up lab work, and continuous support for health optimization.",
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "Partnered with licensed Medical Providers" },
    { icon: Users, text: "Insurance not required" },
    { icon: Clock, text: "Treatments delivered" },
    { icon: Users, text: "Partnered with licensed Medical Providers" },
  ];

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);

  const handleStartTreatment = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const { top } = cardRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (top < windowHeight * 0.8) {
        setCardVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-custom">
        <div
          ref={cardRef}
          className="p-8 lg:p-16 rounded-3xl bg-white border-2 border-white"
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "scale(1)" : "scale(0.85)",
            transition:
              "opacity 1.2s cubic-bezier(0.4,0,0.2,1), transform 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content - Phone Image */}
            <div className="relative">
              <img
                src={phoneImage}
                alt="OptimaleMD consultation on phone"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-[var(--shadow-card)]"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-black">
                  Invest in your health with
                  <br />
                  <span className="text-gradient">Guided Optimization</span>®
                </h2>
                <p className="text-lg text-black">
                  The first step towards optimizing your health online is to
                  book your intake assessment, which includes:
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-black">
                        {benefit.title}:
                      </h4>
                      <p className="leading-relaxed text-black">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4 pt-4">
                <Button className="btn-hero" onClick={handleStartTreatment}>Start treatment online</Button>
                <div className="text-right">
                  <div className="text-3xl font-bold text-black">$250</div>
                  <div className="line-through text-black/50">$500</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Banner */}
        <div className="relative w-full mt-12 pt-8 border-t border-border">
          <div className="w-full bg-primary rounded-full overflow-hidden h-20 flex items-center">
            <div
              className="flex gap-16 items-center animate-trust-banner whitespace-nowrap px-2"
              style={{
                animation: "trustBanner 16s linear infinite",
                width: "100%",
              }}
            >
              {[...trustBadges, ...trustBadges].map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-primary-foreground px-8"
                >
                  <badge.icon size={16} className="text-primary-foreground" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;

/* Add this to your global CSS (index.css):
@keyframes trustBanner {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
*/
