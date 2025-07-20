import { Check, Phone, Shield, Truck, Users } from "lucide-react";
import { Button } from "./ui/button";
import phoneImage from "../assets/phone-consultation.jpg";

const InvestmentSection = () => {
  const benefits = [
    {
      title: "Personalized Assessment",
      description: "Meet your expert OptimalMD Coach to discuss your symptoms and goals. Unlock exclusive discounted pricing on advanced lab testing— minimum $450 lab panel purchase required."
    },
    {
      title: "In-Depth Lab Analysis", 
      description: "Receive a custom report with actionable recommendations based on your individual lab results."
    },
    {
      title: "Expert Medical Oversight",
      description: "A 25-minute consultation with a licensed medical provider to discuss your health blueprint and prescription treatments."
    },
    {
      title: "Delivered To Your Door",
      description: "Exclusive access to OptimalMD's FDA-approved pharmacies and supplement dispensaries."
    },
    {
      title: "Proactive Care",
      description: "Monthly OptimalMD Coach check-ins, treatment refills, follow-up lab work, and continuous support for health optimization."
    }
  ];

  const trustBadges = [
    { icon: Shield, text: "Partnered with licensed Medical Providers" },
    { icon: Users, text: "Insurance not required" },
    { icon: Truck, text: "Treatments delivered" },
    { icon: Users, text: "Partnered with licensed Medical Providers" }
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-custom">
        <div className="card-gradient p-8 lg:p-16 rounded-3xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content - Phone Image */}
            <div className="relative">
              <img 
                src={phoneImage}
                alt="OptimalMD consultation on phone"
                className="w-full max-w-md mx-auto rounded-2xl shadow-[var(--shadow-card)]"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Invest in your health with
                  <br />
                  <span className="text-gradient">Guided Optimization</span>®
                </h2>
                <p className="text-muted-foreground text-lg">
                  The first step towards optimizing your health online is to book your intake 
                  assessment, which includes:
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{benefit.title}:</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4 pt-4">
                <Button className="btn-hero">
                  Start treatment online
                </Button>
                <div className="text-right">
                  <div className="text-3xl font-bold">$250</div>
                  <div className="text-muted-foreground line-through">$500</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-border">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                <badge.icon size={16} className="text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;