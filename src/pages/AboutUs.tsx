import HealthcareTeamSection from "@/components/AboutUs/HealthcareTeamSection";
import OurMission from "@/components/AboutUs/OurMission";
import PrivacyHipaaSection from "@/components/AboutUs/PrivacyHipaaSection";
import PageBanner from "@/components/HowItWork/Pagebanner";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";

const AboutPage = () => {
  return (
    <div>
      <Navigation />
      <PageBanner
        title="ABout Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        backgroundImage="/bd.png"
        className="h-[320px] "
      />
      <OurMission />
      <HealthcareTeamSection />
      <PrivacyHipaaSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
