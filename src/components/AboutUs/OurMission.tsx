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
          <p className="text-lg mb-6 leading-relaxed text-justify">
            At <span className="font-semibold">OptimaleMD</span>, we believe every man deserves to feel energized, confident, and in control of his health.
          </p>
          <p className="text-lg mb-10 leading-relaxed text-justify">
            We combine advanced medical therapies with personal coaching to deliver care that is transparent, effective, and designed around your lifestyle.
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
              className="w-full h-full object-contain"
            />
          </div>
          {/* Bottom Three Images */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl overflow-hidden">
              <img
                src="/s3.png"
                alt="Medical staff"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="/cv.png"
                alt="Hospital corridor"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="cvv.png"
                alt="Doctor smiling"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
