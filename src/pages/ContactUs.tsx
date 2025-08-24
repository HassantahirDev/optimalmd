import ContactForm from "@/components/ContactUs/contactForm";
import ContactSupportSection from "@/components/ContactUs/ContactSupportSection";
import PageBanner from "@/components/HowItWork/Pagebanner";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";

const ContactPage = () => {
  return (
    <div>
      <Navigation />
      <PageBanner
        title="Contact Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        backgroundImage="/bd.png"
        className="h-[320px] "
      />
      <ContactForm />
      <ContactSupportSection />
      <Footer />
    </div>
  );
};

export default ContactPage;
