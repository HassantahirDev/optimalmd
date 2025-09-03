import React from "react";
import { Phone, Mail } from "lucide-react";

const ContactSupportSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl bg-[#e04845] text-white p-8 sm:p-10 md:p-14">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
            Still Have Questions?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Box */}
            <div className="bg-black rounded-xl p-8 flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-red-500 mb-4" />
              <p className="text-xl font-bold mb-2">+1 254-314-8990</p>
              <p className="text-gray-400">We Are Always Ready to Help</p>
            </div>

            {/* Email Box */}
            <div className="bg-black rounded-xl p-8 flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-red-500 mb-4" />
              <p className="text-xl font-bold mb-2">support@optimalemd.health</p>
              <p className="text-gray-400">The Best Way to get Faster Answer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupportSection;
