import { Star } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Cheyanne",
      date: "Oct 5, 2025",
      text: "OptimaleMD gave me the clarity and support I needed to truly transform my health.",
      rating: 5
    },
    {
      name: "L.R.",
      date: "Sep 28, 2025", 
      text: "I never imagined feeling this energetic and focused until I joined OptimaleMD.",
      rating: 5
    },
    {
      name: "Jack",
      date: "Oct 2, 2025",
      text: "The OptimaleMD team helped me unlock a new level of wellness and confidence.",
      rating: 5
    },
    {
      name: "Alexander Sutton", 
      date: "Sep 25, 2025",
      text: "OptimaleMD's approach made a real difference in my daily life and happiness.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < rating ? 'fill-green-400 text-green-400' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold leading-tight text-white mb-2">
              Our community has a lot to say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We can tell you why OptimaleMD is the future of health optimization all day long, but we'd rather you hear it from our clients. You can read all of our 5 star reviews... but it's gonna take a while.
            </p>
          </div>

          {/* Testimonials Grid - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-black border border-gray-400 rounded-xl p-6 space-y-4 flex flex-col justify-between min-h-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-lg">{testimonial.name}</span>
                  <span className="text-sm text-gray-400">{testimonial.date}</span>
                </div>
                <p className="text-xl lg:text-2xl text-white leading-relaxed mb-4 font-normal">
                  "{testimonial.text}"
                </p>
                <div className="flex space-x-1">
                  {/* Trustpilot stars inside green boxes, centered */}
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="inline-block w-6 h-6 relative">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <rect width="24" height="24" rx="4" fill="#00b67a" />
                      </svg>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Star size={16} className="text-white" fill="white" />
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Carousel - Mobile */}
          <div className="lg:hidden">
            <div className="bg-black border border-gray-400 rounded-xl p-6 space-y-4 min-h-[220px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-lg">{testimonials[currentSlide].name}</span>
                <span className="text-sm text-gray-400">{testimonials[currentSlide].date}</span>
              </div>
              <p className="text-2xl lg:text-3xl text-white leading-relaxed mb-4 font-medium">
                "{testimonials[currentSlide].text}"
              </p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="inline-block w-6 h-6">
                    <svg viewBox="0 0 24 24" fill="#00b67a" width="24" height="24"><rect width="24" height="24" rx="4"/></svg>
                  </span>
                ))}
              </div>
            </div>
            {/* Carousel Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center ${currentSlide === index ? 'bg-red-600' : ''}`}
                >
                  {currentSlide === index && <span className="block w-2 h-2 rounded-full bg-red-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;