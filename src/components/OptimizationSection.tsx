import { Beaker, Video, FileText } from "lucide-react";

const OptimizationSection = () => {
  const features = [
    {
      icon: Beaker,
      title: "Personalized lab work",
      description: "Discover the full picture of your health with our in-depth lab work that cover hormones, vitamins, metabolic markers, and more.",
      color: "text-red-400"
    },
    {
      icon: Video, 
      title: "1 on 1 expert health coaching",
      description: "OptimalMD coaches are your health strategists, dedicated to understanding your specific health circumstances, goals, and challenges.",
      color: "text-green-400"
    },
    {
      icon: FileText,
      title: "Customized treatment protocol",
      description: "OptimalMD Coaches create a personalized blueprint for each client, continuously refining and adapting it to your evolving health profile.",
      color: "text-blue-400"
    }
  ];

  const logos = [
    "Jordan B. Peterson",
    "MARK MANSON", 
    "MODERN WISDOM",
    "POWER PROJECT"
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              What is Guided Optimization®?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every OptimalMD client receives the following:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="card-gradient p-8 text-center space-y-6 hover:shadow-[var(--shadow-card)] transition-all duration-300">
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full border-2 border-current ${feature.color} flex items-center justify-center`}>
                    <feature.icon size={32} />
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Featured On Section */}
          <div className="text-center space-y-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-muted-foreground">
              Featured On
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
              {logos.map((logo, index) => (
                <div key={index} className="text-lg lg:text-xl font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptimizationSection;