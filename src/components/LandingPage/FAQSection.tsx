import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const FAQSection = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "How soon will I see results?",
      answer:
        "Most patients notice changes in energy, mood, and performance within weeks.",
    },
    {
      question: "What's included in the monthly cost?",
      answer:
        "Regular appointments with your health coaches, discounted medications, lab work every 3 to 6 months, personalized treatment plans.",
    },
    {
      question: "Do you ship nationwide?",
      answer:
        "Yes — we serve most U.S. states through telemedicine.",
    },
    {
      question: "Are treatments safe and FDA-approved?",
      answer:
        "Yes. All programs are physician-supervised and use FDA-approved medications when available.",
    },
    {
      question: "What qualifies for Hormone Replacement Therapy?",
      answer:
        "Hormone Replacement Therapy qualification is determined through comprehensive lab testing and medical consultation to assess your individual hormone levels and health profile.",
    },
    {
      question: "Do you accept health insurance?",
      answer:
        "OptimaleMD operates as a direct-pay service and does not accept traditional health insurance. This allows us to provide personalized care without insurance limitations.",
    },
    {
      question: "What is OptimaleMD?",
      answer:
        "OptimaleMD is a personalized health optimization platform that combines advanced lab testing, expert coaching, and medical oversight to help you achieve optimal health and performance.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              More questions? See our FAQ page.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors group"
                >
                  <span className="text-xl font-medium pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 text-primary transition-transform duration-200 ${
                      openItems.includes(index) ? "rotate-45" : ""
                    }`}
                  >
                    <Plus size={24} />
                  </div>
                </button>

                {openItems.includes(index) && (
                  <div className="pb-6 animate-fade-in">
                    <p className="text-lg text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">
              Still have questions?
            </p>
            <Button 
              className="btn-hero"
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
