"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Tag, Plane } from 'lucide-react';
import { FLIGHT_OFFERS } from '../../constants/flightData';

export const ExclusiveFlightOffers: React.FC = () => {
  const [activeOfferTab, setActiveOfferTab] = useState<'All' | 'International' | 'Domestic' | 'Business' | 'Student'>("All");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const offerSliderRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (offerSliderRef.current) {
      offerSliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (offerSliderRef.current) {
      offerSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const filteredOffers = activeOfferTab === 'All'
    ? FLIGHT_OFFERS
    : FLIGHT_OFFERS.filter(o => o.category === activeOfferTab);

  return (
    <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Exclusive Flight Offers & Coupon Codes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium"
          >
            Save big on international and domestic flight tickets with our promo codes.
          </motion.p>
        </div>

        {/* Slider Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleScrollLeft}
            type="button"
            aria-label="Previous Offers"
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
          <button
            onClick={handleScrollRight}
            type="button"
            aria-label="Next Offers"
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowRight className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {(['All', 'International', 'Domestic', 'Business', 'Student'] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveOfferTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 shrink-0 relative ${
              activeOfferTab === tab
                ? "bg-[#E8A11A] text-slate-950 shadow-md shadow-[#E8A11A]/30 scale-105 border-2 border-[#c88812] font-black"
                : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Sliding Offer Cards */}
      <div
        ref={offerSliderRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory pt-1 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`w-[280px] sm:w-[320px] shrink-0 snap-start relative rounded-2xl ${offer.bgClass} p-5 shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between min-h-[195px] hover:shadow-md cursor-pointer`}
            >
              <div>
                <span className="inline-block bg-slate-800/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-3">
                  {offer.badgeLabel}
                </span>
                <h3 className="text-slate-900 font-extrabold text-base sm:text-lg leading-snug max-w-[85%]">
                  {offer.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-700/90 mt-1">
                  {offer.validity}
                </p>
              </div>

              <div className="flex items-end justify-between mt-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleCopyCode(offer.code)}
                  className="bg-white shadow-md text-slate-900 rounded-full px-3.5 py-1.5 font-black text-xs border border-slate-100 flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-[#E8A11A] fill-[#E8A11A]/20" />
                  <span>{copiedCode === offer.code ? "COPIED" : offer.code}</span>
                </motion.button>

                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                  <Plane className="w-5 h-5 text-blue-600 rotate-45" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExclusiveFlightOffers;
