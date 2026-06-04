"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do you offer Home Sample Collection?",
    answer: "Yes, our HM EASY service provides secure and hygienic home sample collection by certified phlebotomists. You can select your preferred time slot, and the samples will be processed at NABL-accredited partner labs."
  },
  {
    question: "How long does it take to get my reports?",
    answer: "Most routine diagnostic reports are generated within 24 to 48 hours. Once ready, they are automatically uploaded to your HM OHR (Digital Health Records) account, where you can view, download, or share them securely."
  },
  {
    question: "I am an NRI. Can I book tests or doctor visits for my parents in India?",
    answer: "Absolutely. With our HM RELY service, you can create a profile for your parents, book tests or doctor consultations for them anywhere in India, and receive real-time notifications and access to their health records from abroad."
  },
  {
    question: "Are your doctors available for online consultations?",
    answer: "Yes, our HM TRUST service connects you with verified specialists for both online video consultations and Doctor-at-Home visits. You will also receive digital prescriptions directly in your app."
  },
  {
    question: "Are my medical records secure?",
    answer: "Security is our highest priority. The HM OHR system uses end-to-end encryption to store your family's health history safely. Only authorized users and your consulting doctors can access your data."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Support
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground opacity-70">
            Got questions about our services? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-primary/10 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none group"
              >
                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors pr-8">{faq.question}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-primary text-white rotate-180' : 'bg-primary/5 text-primary'}`}>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 py-6 px-8 border-t border-primary/5 bg-primary/[0.02]' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <p className="text-foreground opacity-80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
