import React from "react";
import { Mail, Phone } from "lucide-react";

interface TermsOfServiceProps {
  className?: string;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ className = "" }) => {
  return (
    <div className={`bg-black text-white min-h-screen p-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-300 text-lg">
            Welcome to OptimaleMD. By using our services, you agree to the
            following Terms of Service. Please read them carefully.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">1. Eligibility & Use</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            You must be 18 years or older and reside in a state where we are
            licensed to receive care from OptimaleMD. You agree to provide
            accurate, complete, and current information.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">2. Telemedicine Consent</h2>
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
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">3. Medical Disclaimer</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            OptimaleMD provides services through licensed clinicians. However,
            the information on our website is for educational purposes only and
            should not be used as a substitute for professional medical advice
            outside the provider-patient relationship.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">4. User Responsibilities</h2>
          <p className="text-gray-300 text-lg mb-4">You agree not to:</p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Share your login credentials
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Use the service for unlawful purposes
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Provide false health information
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">•</span>
              Record or distribute telemedicine sessions without consent
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">5. Payment & Cancellation Policy</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Fees for services will be clearly disclosed prior to billing. By
            booking a consultation or subscribing, you authorize OptimaleMD to
            charge your payment method.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            <strong>Cancellation Policy:</strong> Cancellations must be made at least 24 hours before the appointment. 
            You will be charged $25 if you cancel within less than 24 hours, and $50 if you miss your appointment.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">6. Changes to Terms</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            We may update these terms periodically. Continued use of our
            services indicates your agreement to the updated terms.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">7. Contact Us</h2>
          <p className="text-gray-300 text-lg mb-6">
            For questions about these terms, reach out:
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-gray-300 text-lg">
              <Mail className="w-5 h-5 mr-3 text-blue-400" />
              <span>support@OptimaleMD.com</span>
            </div>
            <div className="flex items-center text-gray-300 text-lg">
              <Phone className="w-5 h-5 mr-3 text-blue-400" />
              <span>(123) 456-7890</span>
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

export default TermsOfService;
