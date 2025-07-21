import { useState } from "react";

const ExpertsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(2); // default to step 3

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

  const steps = [
    {
      number: "①",
      title: "Complete your online intake form",
      description:
        "Fill out a secure online form to provide your health history, symptoms, and goals. This helps us tailor your experience from the start.",
    },
    {
      number: "②",
      title: "Get your labs done",
      description:
        "Visit a partnered lab location or use our at-home kit to complete your lab work. Results are sent directly to your OptimaleMD provider.",
    },
    {
      number: "③",
      title: "Review your plan with a Health Care Provider",
      description:
        "One of our partnered medical providers will meet with you via video conference to discuss your results in detail, answer questions in real time, and formulate a customized treatment plan.",
    },
    {
      number: "④",
      title: "Start your personalized treatment",
      description:
        "Receive your customized treatment protocol and medications delivered to your door. Ongoing support and follow-ups are included.",
    },
  ];

  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-left space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Our expert process.
            </h2>
            <p className="text-lg text-white/80 max-w-2xl">
              Our 4 step process was developed with convenience in mind. We partner with medical providers to bring high quality treatment straight to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 items-start">
            {/* Steps List */}
            <div>
              <h3 className="text-4xl font-light text-white mb-4">The 4 Steps</h3>
              <div className="border-b border-white/30 mb-2"></div>
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(idx)}
                    className={`text-white text-xl text-left w-full transition-opacity ${
                      currentStep === idx ? "opacity-100 font-bold" : "opacity-70 font-normal"
                    }`}
                    style={{ outline: "none" }}
                  >
                    {['One', 'Two', 'Three', 'Four'][idx]}
                  </button>
                ))}
              </div>
              <div className="border-b border-white/30 mt-8"></div>
            </div>
            {/* Step Detail Card */}
            <div className="flex items-center h-full">
              <div className="bg-black border border-white/30 rounded-2xl p-10 flex flex-col justify-center w-full max-w-2xl ml-auto shadow-[0_2px_24px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center mb-6">
                  <span className="text-red-400 text-4xl font-bold mr-4">{steps[currentStep].number}</span>
                  <span className="text-white text-2xl font-medium">{steps[currentStep].title}</span>
                </div>
                <p className="text-white/80 text-xl">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertsSection;