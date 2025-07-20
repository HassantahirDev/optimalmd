import { Button } from "./ui/button";
import { useState } from "react";

const TreatmentGoalsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const goals = [
    {
      title: "Optimize your testosterone",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      description: "Enhance energy, muscle mass, and overall vitality"
    },
    {
      title: "Hair loss prevention", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      description: "Advanced treatments to prevent and reverse hair loss"
    },
    {
      title: "Look younger",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", 
      description: "Anti-aging therapies for youthful appearance"
    },
    {
      title: "Increase your libido",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      description: "Restore and enhance sexual health and performance"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % goals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + goals.length) % goals.length);
  };

  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-custom">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Personalized treatment based on
              <br />
              your goals.
            </h2>
          </div>

          {/* Goals Grid - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {goals.map((goal, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
                  <img 
                    src={goal.image}
                    alt={goal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-4">
                    <h3 className="text-white text-xl font-bold">{goal.title}</h3>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Explore treatment
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Goals Carousel - Mobile */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
              <img 
                src={goals[currentSlide].image}
                alt={goals[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-4">
                <h3 className="text-white text-2xl font-bold">{goals[currentSlide].title}</h3>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Explore treatment
                </Button>
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center space-x-2">
              {goals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentGoalsSection;