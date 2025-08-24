import React from "react";
import ServiceCard from "@/components/Service/ServiceCard";
import Navigation from "@/components/LandingPage/Navigation";
import PageBanner from "@/components/HowItWork/Pagebanner";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import Footer from "@/components/LandingPage/Footer";

const OurServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navigation />
      <PageBanner
        title="Our Services"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        backgroundImage="bg.png"
        className="h-[320px]"
      />
      {/* Page Content */}
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
            Services We Provide{" "}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Hormone optimization/TRT"
              description="Testosterone Replacement Therapy (TRT) is designed for men experiencing symptoms of low testosterone."
              whatsIncluded="Comprehensive lab work, physician evaluation, personalized treatment."
              eligibility="Based on lab results, symptoms, and medical history."
              pricing="Transparent monthly plans available."
              link=""
              imageUrl="/imageforservice/trt.png"
            />

            <ServiceCard
              title="Hair Loss Treatment"
              description="Thinning hair? We offer proven treatments like oral medications, topical solutions, and regenerative therapies to slow hair loss."
              whatsIncluded="Consultation, treatment recommendations, optional prescription."
              eligibility="Men and women with genetic or hormonal hair loss."
              pricing="Varies by treatment type."
              link=""
              imageUrl="/ImageforBlog/Hairloss.png"
            />

            <ServiceCard
              title="Weight Loss & Obesity Medicine"
              description="Our weight management program goes beyond generic diets. We combine metabolic testing and prescription support."
              whatsIncluded="Medical consultation, custom meal plans, progress tracking, supplements."
              eligibility="Adults with BMI over 25 or metabolic concerns."
              pricing="Starting at $199/month with flexible payment options."
              link=""
              imageUrl="/imageforservice/loss.png"
            />

            <ServiceCard
              title="Sexual Health"
              description="We help address sexual performance concerns such as erectile dysfunction, low libido, and performance anxiety."
              whatsIncluded="Confidential consultation, treatment options including medications."
              eligibility="Men over 18, based on symptoms and evaluation."
              pricing="$600/month."
              link=""
              imageUrl="/imageforservice/sexual.png"
            />

            <ServiceCard
              title="Peptides & Longevity Medicine"
              description="Peptide therapy is a cutting-edge approach to improving cellular health, recovery, sleep, and aging."
              whatsIncluded="Physician-guided peptide protocols, lab testing, & ongoing evaluation."
              eligibility="Based on specific goals, symptoms, and labs."
              pricing="$300/month.."
              link=""
              imageUrl="/imageforservice/long.png"
            />

            <ServiceCard
              title="lab Testing"
              description="We offer comprehensive lab panels that help uncover the root causes of fatigue, weight gain, low libido, and more."
              whatsIncluded="At-home or local lab draw, hormone panels & metabolic markers."
              eligibility="All patients are required to undergo lab testing for most programs."
              pricing="$90 for a full panel."
              link=""
              imageUrl="/imageforservice/test.png"
            />

            <ServiceCard
              title="Anti-Aging Program"
              description="Our curated line of medical-grade supplements supports your wellness goals — from immune health to hormonal balance."
              whatsIncluded="Recommendations based on your labs and symptoms."
              eligibility="Available to patients and non-patients."
              pricing="$500/month."
              link=""
              imageUrl="/imageforservice/supplement.png"
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
