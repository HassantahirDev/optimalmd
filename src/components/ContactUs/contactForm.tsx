import React, { useState } from "react";
import { MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { contactApi, ContactFormData } from "../../services/contactApi";

interface ContactFormProps {}

const App: React.FC<ContactFormProps> = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await contactApi.submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-900 text-white font-inter p-4 sm:p-8 lg:p-12 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section: Contact Form */}
          <div className="p-6 sm:p-10 lg:p-14 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Send Us a Message
              </h2>
              <p className="text-neutral-400 text-lg">
                Have a general question? Fill out the form below and we'll
                respond within 1-2 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-400">Thank you! Your message has been sent successfully. We'll respond within 1-2 business days.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-neutral-200 text-sm font-semibold mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Your Name"
                    required
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-neutral-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-neutral-200 text-sm font-semibold mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    required
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-neutral-200 text-sm font-semibold mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Phone Number"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-neutral-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-neutral-200 text-sm font-semibold mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter Subject"
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-neutral-500"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-neutral-200 text-sm font-semibold mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Enter Your Message"
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-neutral-500 resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition duration-300 ease-in-out shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Now!'}
              </button>
            </form>

            <p className="text-neutral-500 text-xs text-center">
              By Contacting us, you agree to our{" "}
              <a href="/terms&service" className="text-red-500 hover:underline">
                Terms of service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                className="text-red-500 hover:underline"
              >
                privacy Policy
              </a>
            </p>
          </div>

          {/* Right Section: Address & Map */}
          <div className="bg-black p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-red-500">
                <MapPin size={24} />
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  2027 S 61st Street, STE 120, Temple TX
                </h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Note: We primarily offer telemedicine services, but our licensed
                providers are based in Texas for regulatory compliance.
              </p>
            </div>
            {/* Map Placeholder Image */}
            <div className="mt-8 lg:mt-0">
              <img
                src="https://placehold.co/600x400/1C1C1C/FFFFFF?text=Map+Placeholder" // Placeholder image for the map
                alt="Map showing location"
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/1C1C1C/FFFFFF?text=Map+Unavailable"; // Fallback
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
