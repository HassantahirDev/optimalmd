import { Beaker, Video, FileText } from "lucide-react";

const OptimizationSection = () => {
  const features = [
    {
      icon: Beaker,
      title: "Licensed Physician Consultation with Personalized Lab orders",
      description: "Discover the full picture of your health with our in-depth lab work that cover hormones, vitamins, metabolic markers, and more.",
      color: "text-red-400"
    },
    {
      icon: Video, 
      title: "Complete your labs and receive Expert Coaching",
      description: "OptimaleMD coaches are your health strategists, dedicated to understanding your specific health circumstances, goals, and challenges.",
      color: "text-green-400"
    },
    {
      icon: FileText,
      title: "Customized Treatment Plan",
      description: "OptimaleMD Coaches create a personalized blueprint for each client, continuously refining and adapting it to your evolving health profile.",
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
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
              What is Guided Optimization®?
            </h2>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Every OptimaleMD client receives:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              // Map tailwind color to box-shadow color
              const shadowColor = {
                'text-red-400': 'rgba(255, 102, 102, 0.5)',
                'text-green-400': 'rgba(102, 255, 153, 0.5)',
                'text-blue-400': 'rgba(102, 204, 255, 0.5)',
              }[feature.color] || 'rgba(255,255,255,0.3)';
              return (
                <div
                  key={index}
                  className="p-8 text-center space-y-6 transition-all duration-300 rounded-2xl border border-white/20 bg-black/80"
                  style={{ boxShadow: 'none', transition: 'box-shadow 0.3s' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 0 32px 8px ${shadowColor}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full border-2 border-current ${feature.color} flex items-center justify-center`}>
                      <feature.icon size={32} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {feature.description.split('.').slice(0,2).join('. ')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Featured On Section */}
          <div className="text-center space-y-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-muted-foreground">
              Featured On
            </h3>
            <div className="relative w-full overflow-hidden">
              <div
                className="flex gap-16 items-center animate-featured-banner whitespace-nowrap px-2"
                style={{ animation: 'featuredBanner 16s linear infinite' }}
              >
                {[...logos, ...logos].map((logo, index) => (
                  <div
                    key={index}
                    className="text-lg lg:text-xl font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer px-8"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptimizationSection;

/* Add this to the file (or your global CSS/tailwind config):
@keyframes featuredBanner {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
*/