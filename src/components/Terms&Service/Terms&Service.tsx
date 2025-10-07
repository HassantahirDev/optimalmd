import React, { useState } from "react";
import { Mail, Phone, User, Video, Stethoscope, DollarSign, FileText, ChevronDown, ChevronUp, Check } from "lucide-react";

interface TermsOfServiceProps {
  className?: string;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ className = "" }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]); // Start with first section expanded

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sections = [
    {
      title: "Eligibility & Use",
      icon: User,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You must be 18+ and located in a state where our doctors are licensed.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            You must be 18 years or older and reside in a state where we are
            licensed to receive care from OptimaleMD. You agree to provide
            accurate, complete, and current information.
          </p>
        </>
      )
    },
    {
      title: "Telemedicine Consent",
      icon: Video,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Your visits are private, secure, and just as confidential as an in-person visit.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            By using OptimaleMD, you consent to receive healthcare services via
            telemedicine. This includes video visits, messaging, and electronic
            prescriptions. You understand:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Telemedicine is not a substitute for in-person care in emergencies
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Your provider will determine if you're a good candidate for
              treatment
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              You may decline or withdraw consent at any time
            </li>
          </ul>
        </>
      )
    },
    {
      title: "Medical Disclaimer",
      icon: Stethoscope,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Our providers follow evidence-based medicine, but individual results may vary.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            OptimaleMD provides services through licensed clinicians. However,
            the information on our website is for educational purposes only and
            should not be used as a substitute for professional medical advice
            outside the provider-patient relationship.
          </p>
        </>
      )
    },
    {
      title: "User Responsibilities",
      icon: FileText,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You agree to:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <Check className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
              Provide accurate health info
            </li>
            <li className="flex items-start">
              <Check className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
              Keep your account secure
            </li>
            <li className="flex items-start">
              <Check className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
              Follow treatment instructions
            </li>
            <li className="flex items-start">
              <Check className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
              Not share login credentials
            </li>
            <li className="flex items-start">
              <Check className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
              Not record sessions without consent
            </li>
          </ul>
        </>
      )
    },
    {
      title: "Payment & Cancellation Policy",
      icon: DollarSign,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Charges occur when you book or subscribe. Refunds may apply only in cases of billing error.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Fees for services will be clearly disclosed prior to billing. By
            booking a consultation or subscribing, you authorize OptimaleMD to
            charge your payment method.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            <strong>Cancellation Policy:</strong> Cancellations must be made at least 24 hours before the appointment. 
            You will be charged $25 if you cancel within less than 24 hours, and $50 if you miss your appointment.
          </p>
        </>
      )
    },
    {
      title: "Changes to Terms",
      icon: FileText,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We'll notify you if major updates occur.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            We may update these terms periodically. Continued use of our
            services indicates your agreement to the updated terms.
          </p>
        </>
      )
    },
    {
      title: "Contact Us",
      icon: Phone,
      content: (
        <>
          <p className="text-gray-300 text-lg mb-6">
            For questions about these terms, reach out:
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-gray-300 text-lg">
              <Mail className="w-5 h-5 mr-3 text-red-400" />
              <a href="mailto:support@optimalemd.health" className="hover:text-white transition-colors">
                support@optimalemd.health
              </a>
            </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className={`bg-black text-white min-h-screen p-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-6">Effective: September 2025</p>
        </div>

        {/* Quick Summary */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Summary:</h2>
          <ul className="space-y-2 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              You must be in a state where we're licensed to provide care.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              You consent to telemedicine (video visits, secure messages, prescriptions).
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              All care is provided by licensed physicians.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              You agree to keep your login private.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              Payments are final; refunds may be limited.
            </li>
          </ul>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSections.includes(index);
            
            return (
              <div key={index} className="bg-gray-900 rounded-lg border border-gray-700">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <IconComponent className="w-6 h-6 text-red-400 mr-4" />
                    <h2 className="text-xl font-semibold text-white">
                      {index + 1}. {section.title}
                    </h2>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">
            Effective: September 2025
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center text-gray-400">
              <Stethoscope className="w-4 h-4 mr-2 text-red-400" />
              Licensed Physicians
            </div>
            <div className="flex items-center text-gray-400">
              <Video className="w-4 h-4 mr-2 text-red-400" />
              Secure Telemedicine
            </div>
            <div className="flex items-center text-gray-400">
              <User className="w-4 h-4 mr-2 text-red-400" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
