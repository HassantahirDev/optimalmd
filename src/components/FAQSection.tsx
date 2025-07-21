import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  
  const faqs = [
    {
      question: "I am NOT a United States Resident, can I still work with OptimaleMD?",
      answer: "Currently, OptimaleMD services are only available to residents of the United States due to regulatory requirements."
    },
    {
      question: "What qualifies for Hormone Replacement Therapy?",
      answer: "Hormone Replacement Therapy qualification is determined through comprehensive lab testing and medical consultation to assess your individual hormone levels and health profile."
    },
    {
      question: "Do you accept health insurance?",
      answer: "OptimaleMD operates as a direct-pay service and does not accept traditional health insurance. This allows us to provide personalized care without insurance limitations."
    },
    {
      question: "What is OptimaleMD?",
      answer: "OptimaleMD is a personalized health optimization platform that combines advanced lab testing, expert coaching, and medical oversight to help you achieve optimal health and performance."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              More questions and answers can be found on our FAQ page
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
                  <span className="text-lg font-medium pr-4">{faq.question}</span>
                  <div className={`w-6 h-6 text-primary transition-transform duration-200 ${
                    openItems.includes(index) ? 'rotate-45' : ''
                  }`}>
                    <Plus size={24} />
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="pb-6 animate-fade-in">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Link to more FAQs */}
          <div className="text-center">
            <a 
              href="#faqs" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              See more FAQs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;