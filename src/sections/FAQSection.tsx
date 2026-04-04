import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What are peptides and how do they work?',
    answer: 'Peptides are short chains of amino acids that serve as building blocks for proteins. In research settings, peptides are studied for their potential effects on various biological processes. Our peptides are synthesized for laboratory research purposes only and are not intended for human or animal consumption.',
  },
  {
    question: 'Do these products come with instructions?',
    answer: 'Yes, all products include detailed handling instructions and safety data sheets (SDS) for proper laboratory use. These documents provide information on storage conditions, handling precautions, and recommended research protocols.',
  },
  {
    question: 'How long do products take to deliver?',
    answer: 'We offer same-day fulfillment for orders placed before 2 PM EST. Domestic shipping typically takes 2-5 business days depending on your location. We also offer expedited shipping options at checkout for faster delivery.',
  },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section 
      id="faq"
      className="relative bg-[#F6F7F9] z-[80] py-16 lg:py-24"
      style={{ paddingTop: '140px' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#0B0D12] mb-10">
          Frequently Asked Questions
        </h2>

        {/* Accordion */}
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="text-base font-medium text-[#0B0D12] pr-4">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
