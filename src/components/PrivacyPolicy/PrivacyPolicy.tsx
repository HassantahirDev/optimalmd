// components/PrivacyPolicy.tsx
import React from "react";
import { Mail, Phone } from "lucide-react";

interface PrivacyPolicyProps {
  className?: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ className = "" }) => {
  return (
    <div className={`bg-black text-white min-h-screen p-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            At OptimaleMD, your privacy and security are our top priority. This
            Privacy Policy explains how we collect, use, and protect your
            personal and health information.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">1. HIPAA Compliance</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            We are fully compliant with the Health Insurance Portability and
            Accountability Act (HIPAA). All Protected Health Information (PHI)
            is encrypted, securely stored, and only accessed by authorized
            healthcare providers.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">2. Information We Collect</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We may collect the following types of data:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Personal identifiers (name, email, phone, date of birth)
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Medical history and treatment data
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Lab results and prescriptions
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Insurance and billing information (if applicable)
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Communication through our platform
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">3. How We Use Your Data</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Your information is used solely for:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Communicating with you (e.g. appointment reminders, care updates)
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Improving our services and platform
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Meeting legal and regulatory obligations
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">4. Data Sharing</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            We do not sell or share your data with third parties for marketing
            purposes. We may share your information with:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Licensed providers within OptimaleMD
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Labs, pharmacies, or other healthcare partners involved in your
              care
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Regulatory agencies when legally required
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">5. Your Rights</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Access your medical records
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Request corrections
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Limit sharing of your data
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              File a complaint if you believe your privacy has been violated
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">6. Contact Us</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            For privacy questions or concerns, contact:
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-gray-300 text-lg">
              <Mail className="w-5 h-5 mr-3 text-blue-400" />
              <span>privacy@OptimaleMD.com</span>
            </div>
            <div className="flex items-center text-gray-300 text-lg">
              <Phone className="w-5 h-5 mr-3 text-blue-400" />
              <span>(327) 545-3309</span>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
