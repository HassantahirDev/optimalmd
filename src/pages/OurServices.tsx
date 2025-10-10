import React from "react";
import ServiceCard from "@/components/Service/ServiceCard";
import Navigation from "@/components/LandingPage/Navigation";
import PageBanner from "@/components/HowItWork/Pagebanner";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import Footer from "@/components/LandingPage/Footer";
import heroCollage from "@/assets/hero-collage.jpg";

const OurServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navigation />
      <PageBanner
        title="Services Designed to Help You Look, Feel, and Perform Better"
        subHeadline="At OptimaleMD, we provide physician-led programs that address the root causes of fatigue, weight gain, hair loss, low libido, and aging. Every treatment is customized to your labs, lifestyle, and goals."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        backgroundImage={heroCollage}
        className="h-[450px]"
        ctaButton={{
          text: "Book Your Physician Consult",
          href: "/book-appointment"
        }}
      />
      {/* Page Content */}
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
            Services We Provide{" "}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Hormone Optimization / TRT"
              subtitle="Restore energy, focus, and drive."
              description="Low testosterone can leave you feeling tired, unmotivated, and weaker than you should. Our doctor-supervised testosterone replacement therapy helps restore hormone balance, improve performance, and bring back your vitality."
              imageUrl="/imageforservice/trt.png"
            />

            <ServiceCard
              title="Hair Loss Treatment"
              subtitle="Regrow with confidence."
              description="Hair loss doesn't just affect appearance — it affects confidence. We offer oral and topical medications, advanced PRP therapy, and combination treatments designed to stop shedding and stimulate healthy regrowth."
              imageUrl="/ImageforBlog/Hairloss.png"
            />

            <ServiceCard
              title="Weight Loss & Obesity Medicine"
              subtitle="Lose weight safely — and keep it off."
              description="Whether you're struggling with stubborn fat or want to break through a plateau, we provide GLP-1 medications, metabolic programs, and lifestyle coaching to help you lose weight and maintain results long-term."
              imageUrl="/imageforservice/loss.png"
            />

            <ServiceCard
              title="Sexual Health"
              subtitle="Stronger performance, renewed confidence."
              description="From erectile dysfunction to low libido, we help men overcome performance issues with evidence-based therapies, advanced procedures like the P-Shot, and personalized protocols that restore sexual health."
              imageUrl="/imageforservice/sexual.png"
            />

            <ServiceCard
              title="Peptide & Longevity Medicine"
              subtitle="Cutting-edge science for recovery, performance, and aging."
              description="Our peptide and longevity programs leverage advanced therapies to accelerate recovery, improve fat metabolism, sharpen focus, and slow the effects of aging — helping you stay at your best for longer."
              imageUrl="/imageforservice/long.png"
            />

            <ServiceCard
              title="Lab Testing"
              subtitle="Know your numbers."
              description="Optimization starts with knowledge. Our comprehensive lab panels check hormones, lipids, metabolism, and key health markers so we can design the right treatment plan for you."
              imageUrl="/imageforservice/test.png"
            />

            <ServiceCard
              title="Supplements"
              subtitle="Daily essentials for optimal health."
              description="We offer physician-recommended supplements that support hormones, immunity, energy, and longevity. Designed to complement your treatment plan and maximize results."
              imageUrl="/imageforservice/supplement.png"
            />
          </div>
          
          {/* Explore More Button */}
          <div className="text-center mt-12">
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
            >
              Explore More Services →
            </a>
          </div>
        </div>
      </main>
      <StartNowBanner 
        title="Not Sure Where to Start? Book your labs & initial consult to find out what works for you best."
        ctaLabel="Start Now"
        ctaHref="/register"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurServicesPage;
