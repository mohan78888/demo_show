"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CHEAP_FLIGHT_FAQS, WHY_CHOOSE_US_ITEMS, TOP_AIRLINE_ROUTES, GLOBAL_FLIGHTS } from '../../constants/flightData';

interface FlightSeoFaqProps {
  isCheapFlights?: boolean;
}

export const FlightSeoFaq: React.FC<FlightSeoFaqProps> = ({ isCheapFlights = false }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (isCheapFlights) {
    return (
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-slate-200 dark:border-slate-800/80 text-left">
        
        {/* FAQ HEADING & INTERACTIVE ACCORDION */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2"
          >
            Frequently Asked Questions (FAQ)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-6"
          >
            Everything you need to know about booking cheap flights with unpublished discounts.
          </motion.p>

          <div className="space-y-3">
            {CHEAP_FLIGHT_FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg sm:text-xl font-bold ml-3 text-slate-400">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* WHY CHOOSE TOUR HELP DESK INC - FAMILY FIRST & CLIENT OBLIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4"
          >
            Why Choose Tour Help Desk Inc?
          </motion.h3>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              At <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk Inc (tourhelpdeskinc)</strong>, we are committed to providing the absolute best travel service for our clients. We treat every single traveler like our own family member. You are always our first and highest priority. It is our heartfelt obligation and promise to deliver the best flight deals, transparent advice, and dependable service rather than poor automated support.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              While many websites exist across the internet to book flights, our purpose is to be truly helpful and make international and domestic travel easy and affordable for people all over the world. With 24/7 personal customer care, unpublished phone discounts, and secure booking, we ensure you travel with complete confidence and peace of mind.
            </motion.p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { title: "Client First Priority", desc: "You are treated like family with personalized care on every flight." },
              { title: "Best Deals Guaranteed", desc: "Access unpublished offline airfares not found on standard travel sites." },
              { title: "24/7 Live Assistance", desc: "Speak directly to real travel experts anytime from anywhere in the world." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.1, ease: "easeOut" }}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                  ✓
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </section>
    );
  }

  // Standard Flights Page SEO Content
  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-slate-200 dark:border-slate-800/80 text-left">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4"
      >
        Affordable Flights to Destinations Worldwide
      </motion.h2>

      <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          At <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong>, we believe that exceptional travel experiences should be accessible to everyone. Whether you're planning a business trip, a family vacation, a romantic getaway, or a solo adventure, we help you find affordable domestic and international flights without compromising on quality or convenience.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Our advanced flight search platform compares fares from trusted airlines and travel partners, allowing you to discover competitive prices for destinations across the globe. From bustling metropolitan cities to breathtaking island escapes and hidden gems, your next journey begins with the right fare.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        >
          We are committed to making flight booking simple, secure, and stress-free. With an intuitive booking experience, transparent pricing, and reliable customer support, planning your trip has never been easier.
        </motion.p>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4"
      >
        Why Choose Tour Help Desk?
      </motion.h3>

      <div className="space-y-3 mb-8">
        {WHY_CHOOSE_US_ITEMS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.12, 0.6), ease: "easeOut" }}
            className="flex items-start gap-2.5"
          >
            <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-1 text-[10px] font-black">
              ✓
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-normal">
              <strong className="text-slate-900 dark:text-white font-bold">{item.title}</strong> – {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3"
      >
        Your Journey Starts Here
      </motion.h3>

      <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          Every journey begins with the perfect flight. Whether you're travelling for business, leisure, education, or a special occasion, <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong> is dedicated to helping you reach your destination comfortably, affordably, and with complete peace of mind.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Start exploring the world with confidence and let <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong> be your trusted travel partner for every adventure.
        </motion.p>
      </div>
    </section>
  );
};

export default FlightSeoFaq;
