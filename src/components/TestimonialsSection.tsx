import { Star } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Cheyanne",
      date: "Dec 16, 2023",
      text: "Not to sound dramatic, but OptimalMD has literally changed the course of my life. After having my first consultation with Derek and learning about the blood work, I was amazed at how much information was available about my health that I had never known before.",
      rating: 5
    },
    {
      name: "L.R.",
      date: "Jul 26, 2022", 
      text: "I waited too long to seek hormonal health optimization. The symptoms crept into my life slowly and I just accepted them as part of aging. Working with OptimalMD has been life-changing.",
      rating: 5
    },
    {
      name: "Jack",
      date: "Jun 29, 2023",
      text: "Life Changer. OptimalMD's team and solutions are nothing short of life changing. In 2.5 months, I've seen incredible improvements in energy, focus, and overall well-being.",
      rating: 5
    },
    {
      name: "Alexander Sutton", 
      date: "Mar 11, 2024",
      text: "I've had an excellent experience!!! So much more Energy! I've been using their service for a little over a year now and I couldn't be happier with the results.",
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
    <section className="section-padding">
      <div className="container-custom">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Our community has a lot to say
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We can tell you why OptimalMD is the future of health optimization 
              all day long, but we'd rather you hear it from our clients. You can read 
              all of our 5 star reviews... but it's gonna take a while.
            </p>
          </div>

          {/* Testimonials Grid - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-gradient p-6 space-y-4 hover:shadow-[var(--shadow-card)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className="text-sm text-muted-foreground">{testimonial.date}</span>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Carousel - Mobile */}
          <div className="lg:hidden">
            <div className="card-gradient p-6 space-y-4 min-h-[300px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{testimonials[currentSlide].name}</span>
                <span className="text-sm text-muted-foreground">{testimonials[currentSlide].date}</span>
              </div>
              
              <p className="text-foreground leading-relaxed">
                "{testimonials[currentSlide].text}"
              </p>
              
              <div className="flex space-x-1">
                {renderStars(testimonials[currentSlide].rating)}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
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

export default TestimonialsSection;