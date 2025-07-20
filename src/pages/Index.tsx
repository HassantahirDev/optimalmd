import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import ProblemsSection from "../components/ProblemsSection";
import OptimizationSection from "../components/OptimizationSection";
import InvestmentSection from "../components/InvestmentSection";
import TreatmentGoalsSection from "../components/TreatmentGoalsSection";
import ProcessSection from "../components/ProcessSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FounderSection from "../components/FounderSection";
import ExpertsSection from "../components/ExpertsSection";
import FAQSection from "../components/FAQSection";
import NewsletterSection from "../components/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProblemsSection />
      <OptimizationSection />
      <InvestmentSection />
      <TreatmentGoalsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FounderSection />
      <ExpertsSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
