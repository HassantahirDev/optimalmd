const founderImage = "https://images.unsplash.com/photo-1698510047345-ff32de8a3b74?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D";

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
                <p className="text-xl lg:text-2xl leading-relaxed text-foreground">
                  Over time, I found it incredibly difficult to get medical oversight for myself and my 
                  family that reflected the most cutting-edge literature, and that was preventative- 
                  that's why I started OptimaleMD.
                </p>
              </div>
              
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