"use client";

import React, { useRef } from 'react';
import ScrollReveal from '../ScrollReveal';

interface CarouselProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  scrollAmount?: number;
  containerClassName?: string;
  sectionClassName?: string;
  headerRightContent?: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  children,
  scrollAmount = 340,
  containerClassName = "flex gap-5 overflow-x-auto scrollbar-hide py-3 px-1 snap-x snap-mandatory scroll-smooth",
  sectionClassName = "",
  headerRightContent,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className={sectionClassName}>
      {(title || subtitle || headerRightContent) && (
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              {title && (
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerRightContent}
              <button
                onClick={() => handleScroll('left')}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Scroll Right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      <div ref={scrollContainerRef} className={containerClassName}>
        {children}
      </div>
    </div>
  );
};

export default Carousel;
