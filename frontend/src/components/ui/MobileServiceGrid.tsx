"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';

export interface MobileServiceGridProps {
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const MobileServiceGrid: React.FC<MobileServiceGridProps> = ({
  onSelectCategory,
  className,
}) => {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  const handleItemClick = (id: string, action: () => void) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    }
    action();
  };

  // Shared Footer Navy (#0E255E) + Golden Ring/Icon (#E8A11A) styling
  const brandIconStylePrimary = 'bg-[#0E255E] dark:bg-[#0b1a3e] text-[#E8A11A] border-2 border-[#E8A11A] shadow-md shadow-[#0E255E]/30 group-hover:border-amber-300 group-hover:text-amber-300 group-hover:shadow-amber-500/20';
  const brandIconStyleSecondary = 'bg-[#0E255E]/90 dark:bg-[#0b1a3e]/90 text-[#E8A11A] border border-[#E8A11A]/80 shadow-sm shadow-[#0E255E]/20 group-hover:border-[#E8A11A] group-hover:text-amber-300';

  // Row 1: Fixed 4 Equal Columns (Primary)
  const firstRowServices = [
    {
      id: 'cruises',
      name: 'Cruises',
      action: () => {
        const cruisesTab = document.querySelector('button[data-tab="cruises"]');
        if (cruisesTab instanceof HTMLElement) cruisesTab.click();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-3.18a2 2 0 00-1.737 1.01l-1.026 1.78a2 2 0 01-1.737 1.01H9.943a2 2 0 01-1.737-1.01l-1.026-1.78A2 2 0 005.44 13H2" />
        </svg>
      )
    },
    {
      id: 'flights',
      name: 'Flights',
      action: () => {
        const flightsTab = document.querySelector('button[data-tab="flights"]');
        if (flightsTab instanceof HTMLElement) flightsTab.click();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      },
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2L16 11l3.5-3.5C20.1 6.9 20.1 6 19.5 5.4c-.6-.6-1.5-.6-2.1.1L13.9 9 5.7 7.2c-.5-.1-1 .1-1.3.5l-.8 1.1c-.3.4-.2.9.2 1.2l5.4 4.1-3.1 3.1-2.2-.6c-.3-.1-.7 0-.9.2l-.7.7c-.3.3-.3.7 0 1l2.5 2.5c.3.3.7.3 1 0l.7-.7c.2-.2.3-.6.2-.9l-.6-2.2 3.1-3.1 4.1 5.4c.3.4.8.5 1.2.2l1.1-.8c.4-.3.6-.8.5-1.3z" />
        </svg>
      )
    },
    {
      id: 'hotels',
      name: 'Hotels',
      action: () => router.push('/hotels'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'cars',
      name: 'Car Rental',
      action: () => router.push('/car-rental'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 5h-16l1-5zm2 12a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      )
    }
  ];

  // Row 2: Exactly 4 Items Visible at Once in Viewport (Swipeable for remaining items)
  const secondRowServices = [
    {
      id: 'trains',
      name: 'Trains',
      action: () => router.push('/bus'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 22V12M16 22V12M4 12h16M4 6h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
      )
    },
    {
      id: 'holidays',
      name: 'Holidays',
      action: () => router.push('/offers'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 0112.728 0M12 3v15M12 18a3 3 0 100-6 3 3 0 000 6zM5.636 5.636L12 12m6.364-6.364L12 12" />
        </svg>
      )
    },
    {
      id: 'activities',
      name: 'Activities',
      action: () => {
        const el = document.getElementById('outdoor-activities');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else router.push('/offers');
      },
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'insurance',
      name: 'Insurance',
      action: () => router.push('/customer-service'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'visa',
      name: 'Visa',
      action: () => router.push('/customer-service'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'bus',
      name: 'Bus',
      action: () => router.push('/bus'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-8 4h8m-9 8h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2zm2 0v2m8-2v2" />
        </svg>
      )
    },
    {
      id: 'app',
      name: 'App',
      action: () => router.push('/special-offer'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-slate-900 pt-3.5 pb-2 px-2 block md:hidden select-none',
        className
      )}
    >
      <div className="w-full max-w-md mx-auto">
        {/* ROW 1: 4 Fixed Equal Columns (Primary - 52px) */}
        <div className="grid grid-cols-4 gap-1 mb-3.5">
          {firstRowServices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.action)}
              className="flex flex-col items-center justify-start group cursor-pointer active:scale-95 transition-transform duration-150 outline-none w-full"
            >
              <div
                className={cn(
                  'w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                  brandIconStylePrimary
                )}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white mt-1.5 text-center leading-tight tracking-tight">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* ROW 2: Exactly 4 Columns Visible at a time (Auto 25% width), swipeable */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="grid grid-flow-col auto-cols-[25%] overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory scroll-smooth w-full"
        >
          {secondRowServices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.action)}
              className="flex flex-col items-center justify-start snap-start w-full group cursor-pointer active:scale-95 transition-transform duration-150 outline-none px-1"
            >
              <div
                className={cn(
                  'w-[42px] h-[42px] min-w-[42px] min-h-[42px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                  brandIconStyleSecondary
                )}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1 text-center leading-tight tracking-tight truncate w-full">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Swipe Indicator Dots (Hidden) */}
        <div className="hidden justify-center items-center gap-1.5 mt-2.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              scrollProgress < 0.5 ? 'w-4 bg-[#E8A11A]' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
            )}
          />
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              scrollProgress >= 0.5 ? 'w-4 bg-[#E8A11A]' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileServiceGrid;
