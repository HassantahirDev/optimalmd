const founderImage = "/sam.jpeg";

const FounderSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Quote */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Quote */}
              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl lg:text-3xl font-bold leading-tight text-foreground mb-4">
                  "I started OptimaleMD because men deserve better care."
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                As a board-certified physician, I saw firsthand how insurance-driven medicine failed men. OptimaleMD was built to deliver cutting-edge therapies, personalized coaching, and care that puts you first.
              </p>
              <p className="text-muted-foreground text-lg">
                - Sam Samarrai, MD
              </p>
              
            </div>

            {/* Founder Info Card */}
            <div className="card-gradient p-6 lg:p-8 space-y-4">
              <h3 className="text-2xl font-bold">
                Meet OptimaleMD's Founder Sam Samarrai, MD.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dr. Sam Samarrai is a highly skilled and board-certified family medicine physician specializing in Men's health and wellbeing. He is dedicated to providing comprehensive and compassionate healthcare to his patients. With a strong educational background and a patient-centered approach, he has established himself as a trusted healthcare professional.
              </p>
            </div>
          </div>

          {/* Right Content - Founder Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
              <img 
                src={founderImage}
                alt="Saad, Co-Founder of OptimaleMD"
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full blur-xl opacity-40" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent rounded-full blur-lg opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;