import React from 'react';
import { CalendarDays, ClipboardCheck, Handshake, Headphones, UserPlus } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

type StepItem = {
  id: number;
  title: string;
  description: string;
  Icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  imgSrc?: string;
  imgAlt?: string;
};

const steps: StepItem[] = [
  {
    id: 1,
    title: 'Step 1: Create Your Account',
    description:
      'Register securely, complete your health profile, and verify your identity.',
    imgSrc: '/icon1.svg',
  },
  {
    id: 2,
    title: 'Step 2: Book Your Appointment',
    description:
      'Choose a service, select a provider, and schedule a convenient time.',
      imgSrc: "/icon2.svg",
  },
  {
    id: 3,
    title: 'Step 3: Meet Your Provider Online',
    description:
      'Expect up to a 30 minute appointment to develop an individualized treatment plan.',
      imgSrc: '/icon3.svg  ',
  },
  {
    id: 4,
    title: 'Step 4: Receive Your Care Plan',
    description:
      'Get prescriptions, lab orders, and follow-up instructions electronically.',
      imgSrc: '/icon4.svg',
  },
  {
    id: 5,
    title: 'Step 5: Ongoing Support',
    description:
      'Message your provider securely and manage your health through the patient portal.',
      imgSrc: '/icon5.svg',
  },
];

const StepCard: React.FC<StepItem> = ({ title, description, Icon, imgSrc, imgAlt }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 shadow-xl p-6 md:p-8">
      <div className="h-12 w-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={imgAlt || ''} className="h-12 w-12 object-contain" />
        ) : (
          Icon && <Icon size={24} />
        )}
      </div>
      <h3 className="mt-6 text-lg md:text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">{description}</p>
    </div>
  );
};

const StepProcess: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const timerRef = React.useRef<number | null>(null);

  const startAutoPlay = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!api) return;
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);
  }, [api]);

  const stopAutoPlay = React.useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!api) return;
    startAutoPlay();
    return () => stopAutoPlay();
  }, [api, startAutoPlay, stopAutoPlay]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">Step-by-Step Process</h2>
          <p className="mt-3 text-base md:text-lg text-white/70">Every OptimaleMD client receives:</p>
        </div>

        <div className="mt-14" onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}>
          <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent>
              {steps.map((s) => (
                <CarouselItem key={s.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <StepCard {...s} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 md:-left-10" />
            <CarouselNext className="-right-6 md:-right-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default StepProcess;

