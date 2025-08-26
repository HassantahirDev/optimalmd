import React from "react";

const PrivacyHipaaSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 p-8 max-w-7xl mx-auto">
      {/* Left Side - Privacy Content */}
      <div className="flex-1 bg-red-500 rounded-3xl p-12 text-white">
        <h2 className="text-5xl font-bold leading-tight mb-8">
          Your Privacy
          <br />
          Comes First
        </h2>

        <div className="text-lg leading-relaxed space-y-4">
          <p>
            We take your privacy and care seriously. OptimaleMD is fully{" "}
            <span className="font-bold">HIPAA-compliant</span> and all services
            are provided under{" "}
            <span className="font-bold">state specific medical licensure</span>{" "}
            by qualified, licensed professionals.
          </p>

          <p>intake assessment, which includes:</p>
        </div>
      </div>

      {/* Right Side - HIPAA Certificate Image */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <img
            src="/certificate.png"
            alt="HIPAA Training Certificate of Completion"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyHipaaSection;
