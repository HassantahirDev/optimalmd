import React from "react";
import ServiceCard from "@/components/Service/ServiceCard";
import Navigation from "@/components/LandingPage/Navigation";
import PageBanner from "@/components/HowItWork/Pagebanner";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import Footer from "@/components/LandingPage/Footer";

const OurServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Navigation */}
      <Navigation />
      <PageBanner
        title="Our Services"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        backgroundImage="bg.png"
        className="h-[371px] w-[1440px] mx-auto"
      />
      {/* Page Content */}
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white text-center mb-12">
            Our Services
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Hormone optimization/TRT"
              description="Testosterone Replacement Therapy (TRT) is designed for men experiencing symptoms of low testosterone."
              whatsIncluded="Comprehensive lab work, physician evaluation, personalized treatment."
              eligibility="Based on lab results, symptoms, and medical history."
              pricing="Transparent monthly plans available."
            />

            <ServiceCard
              title="Weight Management Program"
              description="Comprehensive weight loss program combining medical supervision with lifestyle coaching."
              whatsIncluded="Medical consultation, custom meal plans, progress tracking, supplements."
              eligibility="Adults with BMI over 25 or metabolic concerns."
              pricing="Starting at $199/month with flexible payment options."
            />

            <ServiceCard
              title="Peptide Therapy"
              description="Advanced peptide treatments to enhance recovery, anti-aging, and overall wellness."
              whatsIncluded="Consultation, peptide selection, injection training, ongoing monitoring."
              eligibility="Health assessment required, age 21+."
              pricing="Custom pricing based on selected peptides and duration."
            />

            <ServiceCard
              title="IV Nutrient Therapy"
              description="Intravenous vitamin and mineral infusions for optimal health and energy boost."
              whatsIncluded="Pre-treatment assessment, IV infusion, post-treatment monitoring."
              eligibility="General health screening, no severe medical conditions."
              pricing="$150-400 per session, packages available."
            />

            <ServiceCard
              title="Hormone Replacement (Women)"
              description="Bioidentical hormone replacement therapy for women experiencing hormonal imbalances."
              whatsIncluded="Comprehensive testing, customized hormone plan, regular follow-ups."
              eligibility="Women 35+ with hormonal symptoms or menopause."
              pricing="Monthly plans starting at $250."
            />

            <ServiceCard
              title="Sexual Wellness"
              description="Comprehensive approach to improving sexual health and performance for all genders."
              whatsIncluded="Medical evaluation, treatment options, ongoing support."
              eligibility="Adults 18+ with sexual health concerns."
              pricing="Consultation $150, treatment plans vary."
            />

            <ServiceCard
              title="Anti-Aging Program"
              description="Complete anti-aging protocol including hormones, peptides, and lifestyle optimization."
              whatsIncluded="Full biomarker panel, personalized protocol, quarterly reviews."
              eligibility="Adults 30+ interested in longevity optimization."
              pricing="Premium packages starting at $500/month."
            />
          </div>
        </div>
      </main>
      <StartNowBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurServicesPage;
