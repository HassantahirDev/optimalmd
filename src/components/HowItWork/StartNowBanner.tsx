import React from "react";
import { Button } from "@/components/ui/button";
import leftImage from "@/assets/phone-consultation.jpg";
import rightImage from "@/assets/hero-collage.jpg";
import { useNavigate } from "react-router-dom";


type StartNowBannerProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageLeftSrc?: string;
  imageRightSrc?: string;
};

const StartNowBanner: React.FC<StartNowBannerProps> = ({
  title = "Start now",
  description = "The first step towards optimizing your health online is to book your intake assessment, which includes:",
  ctaLabel = "Register Today",
  ctaHref = "/register",
  imageLeftSrc,
  imageRightSrc,
}) => {
  const navigate = useNavigate();
  const leftSrc = imageLeftSrc || leftImage;
  const rightSrc = imageRightSrc || rightImage;

  const handleStartNow = () => {
    navigate("/login");
  };

  return (
    <section className="py-10 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl bg-[#e04845] text-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: Content */}
            <div className="p-8 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center">
              <h2 className="text-[40px] sm:text-[48px] md:text-[56px] font-extrabold leading-tight">
                {title}
              </h2>
              <p className="mt-6 text-base sm:text-lg max-w-xl opacity-95">
                {description}
              </p>
              <div className="mt-8">
                <Button 
                  className="h-10 px-6 rounded-full bg-black text-white hover:bg-black/90"
                  onClick={handleStartNow}
                >
                  {ctaLabel}
                </Button>
              </div>
            </div>

            {/* Right: Images */}
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="h-full w-full grid grid-cols-2 gap-4 items-center">
                <div className="col-span-1 h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] rounded-2xl overflow-hidden">
                  <img
                    src={leftSrc}
                    alt="Consultation"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="col-span-1 h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] rounded-2xl overflow-hidden">
                  <img
                    src={rightSrc}
                    alt="Provider"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartNowBanner;
