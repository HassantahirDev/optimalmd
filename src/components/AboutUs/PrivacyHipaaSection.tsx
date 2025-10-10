import React from "react";
import { Shield, UserCheck, Lock } from "lucide-react";

const PrivacyHipaaSection = () => {
  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-7xl mx-auto">
      {/* Privacy Content - Full Width */}
      <div className="w-full bg-red-500 rounded-3xl p-12 text-white">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          Your Privacy, Protected by Law
        </h2>

        <p className="text-lg leading-relaxed mb-8">
          We are HIPAA-compliant and take your confidentiality seriously. Every consultation and prescription is secure and private.
        </p>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-sm mb-1">HIPAA Compliant</h3>
            <p className="text-xs opacity-90">Full privacy protection</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-sm mb-1">Licensed Providers</h3>
            <p className="text-xs opacity-90">State-licensed physicians</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-sm mb-1">Secure Telehealth</h3>
            <p className="text-xs opacity-90">Encrypted consultations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyHipaaSection;
