import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageBanner from '@/components/Pagebanner';
import phoneConsultation from '@/assets/phone-consultation.jpg';
import StepProcess from '@/components/StepProcess';
import FAQSection from '@/components/FAQSection';
import StartNowBanner from '@/components/StartNowBanner';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageBanner
        title="How It Works"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'How It Works' },
        ]}
        backgroundImage={phoneConsultation}
        className="h-[320px] sm:h-[380px] md:h-[440px]"
      />

      <StepProcess />
      <FAQSection />
      <StartNowBanner />

      <Footer />
    </div>
  );
};

export default HowItWorks;
