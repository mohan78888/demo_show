"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  num?: number;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const displayNum = item.num !== undefined ? item.num : idx + 1;

        return (
          <div
            key={idx}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs sm:text-sm shrink-0">
                  {displayNum}.
                </span>
                <span>{item.question}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-normal">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
