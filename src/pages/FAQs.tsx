import ContactForm from "@/components/ContactUs/contactForm";
import PageBanner from "@/components/HowItWork/Pagebanner";
import StartNowBanner from "@/components/HowItWork/StartNowBanner";
import FAQSection from "@/components/LandingPage/FAQSection";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";

const FAQsPage = () => {
  return (
    <div>
      <Navigation />
      <PageBanner
        title="FAQS"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        backgroundImage="/bd.png"
        className="h-[320px]"
      />
      <FAQSection />
      <StartNowBanner />
      <Footer />
    </div>
  );
};

export default FAQsPage;
