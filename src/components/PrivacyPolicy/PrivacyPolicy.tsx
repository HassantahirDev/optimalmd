// components/PrivacyPolicy.tsx
import React, { useState } from "react";
import { Mail, Phone, Shield, CreditCard, Lock, Share2, Key, ChevronDown, ChevronUp } from "lucide-react";

interface PrivacyPolicyProps {
  className?: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ className = "" }) => {
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
      title: "HIPAA Compliance",
      icon: Shield,
      content: (
        <ul className="space-y-3 text-gray-300 text-lg">
          <li className="flex items-start">
            <span className="text-white mr-3">•</span>
            We follow HIPAA (Health Insurance Portability and Accountability Act) rules.
          </li>
          <li className="flex items-start">
            <span className="text-white mr-3">•</span>
            Your health information is encrypted, stored securely, and only accessible to licensed providers.
          </li>
        </ul>
      )
    },
    {
      title: "Information We Collect",
      icon: CreditCard,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We only collect information needed to provide safe and effective care:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Basic details (name, email, phone, date of birth).
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Health history and treatment details.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Lab results and prescriptions.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Insurance or payment information (if applicable).
            </li>
          </ul>
        </>
      )
    },
    {
      title: "How We Use Your Data",
      icon: Lock,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We use your data to:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Deliver medical care (diagnosis, prescriptions, labs).
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Send appointment reminders and updates.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Track treatment progress.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Comply with medical and legal requirements.
            </li>
          </ul>
          <p className="text-gray-300 text-lg leading-relaxed mt-4">
            <strong className="text-white">For example:</strong> We use your lab results to adjust your treatment plan, and your email to send appointment reminders.
          </p>
        </>
      )
    },
    {
      title: "Data Sharing",
      icon: Share2,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            <strong className="text-white">We never sell your data to marketers or third parties.</strong>
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We may share your information with:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Licensed OptimaleMD providers.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Labs, pharmacies, or other healthcare partners directly involved in your care.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Regulators or authorities only when legally required.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "Your Rights",
      icon: Key,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Access your records.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Request corrections.
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Ask us to delete data (where legally allowed).
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              File a complaint if you believe your privacy has been violated.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "Contact Us",
      icon: Phone,
      content: (
        <>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            For privacy concerns or requests, contact:
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
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-6">Effective: September 2025</p>
        </div>

        {/* Plain Language Summary */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-12">
          <ul className="space-y-2 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              We keep your data private and secure.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              We never sell your information.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              Only your care team has access to your records.
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3">✓</span>
              You control your data and can request copies anytime.
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
              <Shield className="w-4 h-4 mr-2 text-red-400" />
              HIPAA Compliant
            </div>
            <div className="flex items-center text-gray-400">
              <Lock className="w-4 h-4 mr-2 text-red-400" />
              Secure Telehealth
            </div>
            <div className="flex items-center text-gray-400">
              <CreditCard className="w-4 h-4 mr-2 text-red-400" />
              Licensed Providers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
