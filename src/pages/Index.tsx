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
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProblemsSection />
      <OptimizationSection />
      <InvestmentSection />
      <TreatmentGoalsSection />
      <TestimonialsSection />
      <FounderSection />
      <ExpertsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
