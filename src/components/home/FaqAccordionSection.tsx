import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquareText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FaqAccordionSection: React.FC = () => {
  const { setIsChatbotOpen } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'How does PawVerse verify breeders and kennels?',
      answer: 'Every breeder and kennel on PawVerse undergoes rigorous multi-step auditing. We verify government identification, Kennel Club of India (KCI) registry records, kennel hygiene conditions, and past litter health histories before approving any seller on the platform.'
    },
    {
      id: 2,
      question: 'What health guarantees and documentation accompany each puppy?',
      answer: 'Every companion comes with an official Veterinary Health Certificate, 100% DNA breed purity clearance, up-to-date core vaccination card (DHPP & Rabies), deworming record, and an ISO-standard microchip ID tag. We offer a 15-day genetic health replacement guarantee.'
    },
    {
      id: 3,
      question: 'Can I inspect the puppy over a live video call before placing a deposit?',
      answer: 'Yes! Transparency is our core value. You can schedule or launch an instant 1-on-1 HD live video inspection directly with the verified breeder through our platform to observe the puppy\'s activity, playfulness, and interaction with its mother.'
    },
    {
      id: 4,
      question: 'How does the secure escrow payment system work?',
      answer: 'When you reserve a puppy, your payment is held securely in an RBI-compliant escrow account via Razorpay/UPI. The breeder does not receive payment until the puppy arrives at your home, passes your personal visual inspection, and is officially accepted.'
    },
    {
      id: 5,
      question: 'How are puppies transported safely across Tamil Nadu and India?',
      answer: 'Puppies travel exclusively in dedicated, temperature-controlled AC pet transport vehicles accompanied by trained animal welfare handlers. The vehicle maintains optimal climate (20-22°C), provides hydration stops every 2-3 hours, and includes live GPS tracking for real-time customer monitoring.'
    },
    {
      id: 6,
      question: 'How can certified breeders register on PawVerse?',
      answer: 'Legitimate KCI registered breeders and ethical kennel owners can submit their credentials via the "Sell a Pet / Breeder Portal" button in the navigation header. Our verification team reviews government ID, kennel permits, and photographs within 24-48 hours.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF9C3] dark:bg-[#18181B] text-[#713F12] dark:text-[#FACC15] border border-[#FDE047] dark:border-[#27272A] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#EAB308]" /> Common Queries
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] dark:text-white tracking-tight font-heading">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] font-normal">
          Everything you need to know about purchasing, health guarantees, video inspections, and delivery.
        </p>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#0A0A0A] border-[#FACC15] shadow-card'
                  : 'bg-white/80 dark:bg-[#0A0A0A]/80 border-[#E4E4E7] dark:border-[#27272A] hover:border-[#FACC15] hover:bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className={`text-sm sm:text-base font-bold transition-colors font-heading ${
                  isOpen ? 'text-[#EAB308]' : 'text-[#0A0A0A] dark:text-[#FAFAFA]'
                }`}>
                  {faq.question}
                </span>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'bg-[#FEF08A] text-[#713F12] rotate-180' : 'bg-[#FAFAFA] dark:bg-[#18181B] text-[#71717A]'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-[#E4E4E7]/40 dark:border-[#27272A] animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#FAFAFA] font-heading">
            Still have questions about adoption or specific breeds?
          </h4>
          <p className="text-xs text-[#71717A]">
            Our veterinary counselors and pet care advisors are available 7 days a week.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+918779692292"
            className="btn-outline text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Call Helpline</span>
          </a>

          <button
            onClick={() => setIsChatbotOpen(true)}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>
    </section>
  );
};
