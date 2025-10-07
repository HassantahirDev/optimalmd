import HealthcareTeamSection from "@/components/AboutUs/HealthcareTeamSection";
import OurMission from "@/components/AboutUs/OurMission";
import PrivacyHipaaSection from "@/components/AboutUs/PrivacyHipaaSection";
import PageBanner from "@/components/HowItWork/Pagebanner";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";
import heroCollage from "@/assets/hero-collage.jpg";

const AboutPage = () => {
  return (
    <div>
      <Navigation />
      <PageBanner
        title="A New Era of Men's Health Care"
        subHeadline="OptimaleMD was founded to give men the personalized, doctor-led care they deserve — without insurance hassles or rushed visits."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        backgroundImage={heroCollage}
        className="h-[420px]"
      />
      <OurMission />
      <HealthcareTeamSection />
      <PrivacyHipaaSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
