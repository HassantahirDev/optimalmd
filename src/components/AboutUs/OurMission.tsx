import React from "react";

const OurMission: React.FC = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Our Mission
          </h2>
          <p className="text-lg mb-6 leading-relaxed">
            We started <span className="font-semibold">OptimaleMD</span> with
            one goal: to help men feel like themselves again.
          </p>
          <p className="text-lg mb-6 leading-relaxed">
            Too many guys are told to just "deal with it" — the fatigue, low
            energy, weight gain, and all the things that slowly chip away at
            their confidence and quality of life. We think that's unacceptable.
          </p>
          <p className="text-lg mb-10 leading-relaxed">
            At <span className="font-semibold">OptimaleMD</span>, we believe men
            deserve real answers, real treatment, and real results. We're here
            to support your health, your goals, and your longevity — with care
            that's modern, judgment-free, and built around you.
          </p>

          {/* Bottom Stats */}
          <div className="flex flex-col sm:flex-row gap-10 mt-10">
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-red-500">
                100%
              </p>
              <p className="text-gray-300">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-red-500">
                12+
              </p>
              <p className="text-gray-300">Certified Professionals</p>
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="grid grid-rows-2 gap-4">
          {/* Top Large Image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src="/dd.png"
              alt="Doctor consulting patient"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bottom Three Images */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl overflow-hidden">
              <img
                src="/s3.png"
                alt="Medical staff"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="/cv.png"
                alt="Hospital corridor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="cvv.png"
                alt="Doctor smiling"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
