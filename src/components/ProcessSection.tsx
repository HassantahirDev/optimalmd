import { useState } from "react";

const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const steps = [
    {
      number: 1,
      title: "Schedule a 1 on 1 intake with an OptimaleMD Coach.",
      description: "Meet with your health coach via video conference to examine your symptoms and goals so they can get started with your personalized protocol."
    },
    {
      number: 2, 
      title: "Complete comprehensive lab testing.",
      description: "Get detailed lab work to understand your current health markers, hormones, vitamins, and metabolic indicators."
    },
    {
      number: 3,
      title: "Receive your personalized health blueprint.",
      description: "Get a custom treatment plan based on your lab results, symptoms, and health goals designed specifically for you."
    },
    {
      number: 4,
      title: "Begin your optimization journey.",
      description: "Start your personalized treatment with ongoing support, regular check-ins, and continuous protocol adjustments."
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Our expert process.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our 4 step process was developed with convenience in mind. We partner with medical 
                providers to bring high quality treatment straight to your door.
              </p>
            </div>

            {/* Steps Navigation */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">The 4 Steps</h3>
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    activeStep === step.number 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      activeStep === step.number 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.number}
                    </div>
                    <span className={`font-medium ${
                      activeStep === step.number ? 'text-primary' : 'text-foreground'
                    }`}>
                      {step.number === 1 ? 'One' : 
                       step.number === 2 ? 'Two' :
                       step.number === 3 ? 'Three' : 'Four'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Active Step Details */}
          <div className="lg:pl-8">
            <div className="card-gradient p-8 lg:p-12 space-y-6 min-h-[400px] flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {activeStep}
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
                {steps[activeStep - 1].title}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {steps[activeStep - 1].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;