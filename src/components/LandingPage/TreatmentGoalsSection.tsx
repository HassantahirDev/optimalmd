import { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const TreatmentGoalsSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const goals = [
    {
      problem: "Low Energy?",
      solution: "Optimize Your Testosterone",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      benefit: "Boost energy, build muscle, and reclaim your vitality",
    },
    {
      problem: "Thinning Hair?",
      solution: "Regrow with Proven Therapies",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      benefit: "Stop hair loss and restore natural thickness",
    },
    {
      problem: "Aging Skin & Body?",
      solution: "Longevity & Anti-Aging Programs",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      benefit: "Look and feel younger with science-backed treatments",
    },
    {
      problem: "Performance Issues?",
      solution: "Improve Sexual Health & Libido",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      benefit: "Restore confidence and peak performance in the bedroom",
    },
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
                    alt={`${goal.problem} ${goal.solution}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  
                  {/* Default State */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-2 group-hover:opacity-0 transition-opacity duration-300">
                    <p className="text-white/90 text-sm font-medium">
                      {goal.problem}
                    </p>
                    <h3 className="text-white text-xl font-bold leading-tight">
                      {goal.solution}
                    </h3>
                  </div>
                  
                  {/* Hover State */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center space-y-4">
                    <p className="text-white text-base leading-relaxed">
                      {goal.benefit}
                    </p>
                    <Button
                      variant="outline"
                      className="bg-white text-primary hover:bg-white/90 border-0 font-semibold"
                      onClick={() => navigate("/register")}
                    >
                      Explore Treatment
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
                alt={`${goals[currentSlide].problem} ${goals[currentSlide].solution}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-white/90 text-sm font-medium">
                    {goals[currentSlide].problem}
                  </p>
                  <h3 className="text-white text-2xl font-bold leading-tight">
                    {goals[currentSlide].solution}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {goals[currentSlide].benefit}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-white text-primary hover:bg-white/90 border-0 font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Explore Treatment
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
                    currentSlide === index ? "bg-primary" : "bg-muted"
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
