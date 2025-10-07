import Navigation from "@/components/LandingPage/Navigation";
import PageBanner from "@/components/HowItWork/Pagebanner";
import heroCollage from "@/assets/hero-collage.jpg";
import StepProcess from "@/components/HowItWork/StepProcess";
import FAQSection from "@/components/LandingPage/FAQSection";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import Footer from "@/components/LandingPage/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageBanner
        title="Your Path to Health Optimization — Simple, Clear, Effective"
        subHeadline="In just 3 steps, you'll move from symptoms and frustration to energy, confidence, and results."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How It Works" }]}
        backgroundImage={heroCollage}
        className="h-[400px]"
        ctaButton={{
          text: "Start Your Journey",
          href: "/register"
        }}
      />

      <StepProcess />
      <FAQSection />
      <StartNowBanner />

      <Footer />
    </div>
  );
};

export default HowItWorks;
