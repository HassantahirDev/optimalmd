import Navigation from "@/components/LandingPage/Navigation";
import PageBanner from "@/components/HowItWork/Pagebanner";
import phoneConsultation from "@/assets/phone-consultation.jpg";
import StepProcess from "@/components/HowItWork/StepProcess";
import FAQSection from "@/components/LandingPage/FAQSection";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import Footer from "@/components/LandingPage/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageBanner
        title="How It Works"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How It Works" }]}
        backgroundImage="/bg.png"
        className="h-[320px]"
      />

      <StepProcess />
      <FAQSection />
      <StartNowBanner />

      <Footer />
    </div>
  );
};

export default HowItWorks;
