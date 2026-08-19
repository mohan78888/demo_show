"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CONTACT_INFO } from '../constants/config';

const FAQ_ITEMS = [
  {
    category: 'Bookings',
    questions: [
      { q: 'How do I book a flight with Tour Help Desk?', a: 'You can book a flight directly from our homepage by entering your departure and arrival cities, selecting your dates, and choosing from the available flights.' },
      { q: 'Can I book for multiple passengers?', a: 'Yes, you can select up to 9 passengers in a single booking through our website. For group bookings larger than 9, please contact our support desk.' },
      { q: 'Is it safe to pay online?', a: 'Absolutely. We use industry-standard 256-bit SSL encryption and follow PCI-DSS compliance to ensure your payment details are always secure.' }
    ]
  },
  {
    category: 'Cancellations & Refunds',
    questions: [
      { q: 'How can I cancel my booking?', a: 'You can cancel your booking by logging into your account and selecting "My Bookings". Alternatively, you can call our support line with your Reference ID.' },
      { q: 'When will I receive my refund?', a: 'Refunds are typically processed within 7-10 working days after cancellation. For instant credit, you can opt for the Tour Help Desk Wallet.' },
      { q: 'Are there cancellation fees?', a: 'Cancellation fees depend on the airline policy and how close to departure you cancel. Flights cancelled 96+ hours before departure often have zero or minimal fees.' }
    ]
  }
];

const CustomerService: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">How can we help you?</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Our team is here to ensure your journey is seamless. From booking assistance to real-time flight updates, we've got you covered.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-500 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Toll-Free Support</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Available 24/7 for urgent help.</p>
            <a href={CONTACT_INFO.HOTLINE_TEL} className="text-2xl font-black text-blue-600 dark:text-blue-400 hover:underline">{CONTACT_INFO.HOTLINE_DISPLAY}</a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Replies within 2 hours.</p>
            <a href="mailto:care@tourhelpdesk.com" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">care@tourhelpdesk.com</a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Live Chat</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Chat with our AI Agent.</p>
            <button className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">Start Chatting</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Find quick answers to common traveler concerns.</p>
        </div>

        <div className="space-y-12">
          {FAQ_ITEMS.map((cat, catIdx) => (
            <div key={catIdx}>
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-2">{cat.category}</h4>
              <div className="space-y-4">
                {cat.questions.map((item, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/10 shadow-lg dark:shadow-none' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                      <button 
                        onClick={() => toggleAccordion(id)}
                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.q}</span>
                        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500' : 'text-slate-400 dark:text-slate-500'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2">
                           <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                             {item.a}
                           </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 text-orange-400 mb-6">
            {[...Array(5)].map((_, i) => <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 italic leading-relaxed">
            "Tour Help Desk's customer support handled my emergency cancellation within minutes. I was stressed about my refund, but they credited it instantly to my wallet. Truly premium service!"
          </h3>
          <div className="mt-8 flex items-center justify-center gap-4">
             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md relative">
               <Image src="https://picsum.photos/seed/customer1/100/100" alt="Customer" fill sizes="48px" className="object-cover" />
             </div>
             <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">Aditi Sharma</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Frequent Flyer</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerService;