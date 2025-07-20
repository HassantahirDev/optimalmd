import { useState } from "react";

const ExpertsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const experts = [
    {
      name: "Jordan Peterson",
      title: "Psychologist & Author",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Jordan Syatt", 
      title: "Health & Fitness Expert",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Brett Cooper",
      title: "Podcast Host", 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-left space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Recommended
              <br />
              by the best.
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              OptimalMD only partners with the best in the health and fitness industries.
            </p>
          </div>

          {/* Experts Grid - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-muted">
                  <img 
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-bold">{expert.name}</h3>
                    <p className="text-white/80 text-sm">{expert.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experts Carousel - Mobile */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-muted">
              <img 
                src={experts[currentSlide].image}
                alt={experts[currentSlide].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-bold">{experts[currentSlide].name}</h3>
                <p className="text-white/80 text-sm">{experts[currentSlide].title}</p>
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {experts.map((_, index) => (
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

export default ExpertsSection;