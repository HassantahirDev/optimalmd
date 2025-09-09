import React, { useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Home,
  Calendar,
  Users,
  UserPlus,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  videoUrl?: string;
}

const DashboardFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQ[] = [
    {
      question: "How do I start a video visit?",
      answer:
        "Navigate to 'My Schedule', select the patient appointment, and click 'Start Video Call'. Ensure your camera and microphone are enabled.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      question: "How do I release lab results?",
      answer:
        "Go to 'My Patients' → Select Patient → 'Lab Results' → Check the results you want to release → Add optional notes → Click 'Release Selected Results'.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      question: "Where can I update my profile?",
      answer:
        "Click your profile picture → 'Profile Settings' → Update details like contact info, specialties, and availability → Save changes.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Email support@optimalemd.com or call 1-800-555-1234. For urgent issues during visits, use the hotline in the Help menu.",
    },
    {
      question: "How do I manage patient appointments?",
      answer:
        "Go to 'My Schedule' to view, reschedule, or cancel appointments. You can also add notes and set availability preferences.",
    },
    {
      question: "How do I access patient medical records?",
      answer:
        "Navigate to 'My Patients' → Select the patient → View their history, labs, prescriptions, and consultation notes.",
    },
  ];

  // aliases for better search
  const aliases: Record<string, string[]> = {
    labs: ["lab results", "release labs", "test results"],
    schedule: ["appointments", "my schedule", "booking", "reschedule"],
    profile: ["account", "settings", "update profile"],
    support: ["help", "contact", "tech support"],
  };

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const matchesAlias = (faq: FAQ, query: string) => {
    for (const key in aliases) {
      if (
        aliases[key].some((alias) =>
          alias.toLowerCase().includes(query.toLowerCase())
        )
      ) {
        if (faq.question.toLowerCase().includes(key)) return true;
      }
    }
    return false;
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matchesAlias(faq, searchQuery)
  );

  return (
    <div className="min-h-screen bg-black-900 text-white flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Help Center (For Providers)
          </h1>
          <p className="text-gray-400 text-lg">
            Need support? We're here to assist.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="How can we help you?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-[#2A2A2A] rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-[#2A2A2A] rounded-lg p-6 mb-8 border border-[#2A2A2A]">
          <h2 className="text-2xl font-bold mb-6">FAQs List</h2>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-700 last:border-b-0"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 flex items-center justify-between text-left hover:text-red-400 transition-colors group"
                >
                  <span className="text-lg font-medium pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 text-red-500 transition-transform duration-200 ${
                      openItems.includes(index) ? "rotate-45" : ""
                    }`}
                  >
                    <Plus size={24} />
                  </div>
                </button>

                {openItems.includes(index) && (
                  <div className="pb-4 animate-fade-in">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.videoUrl && (
                      <div className="mt-4 aspect-video">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={faq.videoUrl}
                          title="Tutorial video"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No FAQs found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Live Support Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-600 transition">
          💬 Live Support
        </button>
      </div>
    </div>
  );
};

export default DashboardFAQ;
