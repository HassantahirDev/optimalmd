import Navigation from "../components/LandingPage/Navigation";
import HeroSection from "../components/LandingPage/HeroSection";
import ProblemsSection from "../components/LandingPage/ProblemsSection";
import OptimizationSection from "../components/LandingPage/OptimizationSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import FounderSection from "../components/LandingPage/FounderSection";
import ExpertsSection from "../components/LandingPage/ExpertsSection";
import FAQSection from "../components/LandingPage/FAQSection";
import InvestmentSection from "@/components/LandingPage/InvestmentSection";
import TreatmentGoalsSection from "@/components/LandingPage/TreatmentGoalsSection";
import NewsletterSection from "@/components/LandingPage/NewsletterSection";
import Footer from "@/components/LandingPage/Footer";

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
