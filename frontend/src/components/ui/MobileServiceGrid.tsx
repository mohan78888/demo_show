"use client";

import React, { useRef, useState, useEffect } from 'react';
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

  useEffect(() => {
    // Proactively prefetch common mobile navigation destinations in background
    router.prefetch('/hotels');
    router.prefetch('/flights');
    router.prefetch('/bus');
    router.prefetch('/car-rental');
    router.prefetch('/offers');
    router.prefetch('/customer-service');
    router.prefetch('/special-offer');
  }, [router]);

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

  // High-contrast clean styling: Deep Royal Navy background with crisp white icon and sleek blue accent border
  const brandIconStylePrimary = 'bg-[#0E255E] dark:bg-blue-900/40 text-white border-2 border-blue-500/30 shadow-md shadow-blue-950/20 group-hover:border-blue-500 group-hover:bg-blue-700 transition-all';
  const brandIconStyleSecondary = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:border-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all';

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
      icon: <span className="material-symbols-outlined text-[24px]">directions_boat</span>
    },
    {
      id: 'flights',
      name: 'Flights',
      action: () => {
        const flightsTab = document.querySelector('button[data-tab="flights"]');
        if (flightsTab instanceof HTMLElement) {
          flightsTab.click();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        } else {
          router.push('/flights');
        }
      },
      icon: <span className="material-symbols-outlined text-[24px]">flight</span>
    },
    {
      id: 'hotels',
      name: 'Hotels',
      action: () => router.push('/hotels'),
      icon: <span className="material-symbols-outlined text-[24px]">hotel</span>
    },
    {
      id: 'cars',
      name: 'Car Rental',
      action: () => router.push('/car-rental'),
      icon: <span className="material-symbols-outlined text-[24px]">directions_car</span>
    }
  ];

  // Row 2: Exactly 4 Items Visible at Once in Viewport (Swipeable for remaining items)
  const secondRowServices = [
    {
      id: 'trains',
      name: 'Trains',
      action: () => router.push('/bus'),
      icon: <span className="material-symbols-outlined text-[20px]">train</span>
    },
    {
      id: 'holidays',
      name: 'Holidays',
      action: () => router.push('/offers'),
      icon: <span className="material-symbols-outlined text-[20px]">luggage</span>
    },
    {
      id: 'activities',
      name: 'Activities',
      action: () => {
        const el = document.getElementById('outdoor-activities');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else router.push('/offers');
      },
      icon: <span className="material-symbols-outlined text-[20px]">local_activity</span>
    },
    {
      id: 'insurance',
      name: 'Insurance',
      action: () => router.push('/customer-service'),
      icon: <span className="material-symbols-outlined text-[20px]">verified_user</span>
    },
    {
      id: 'visa',
      name: 'Visa',
      action: () => router.push('/customer-service'),
      icon: <span className="material-symbols-outlined text-[20px]">travel_explore</span>
    },
    {
      id: 'bus',
      name: 'Bus',
      action: () => router.push('/bus'),
      icon: <span className="material-symbols-outlined text-[20px]">directions_bus</span>
    },
    {
      id: 'app',
      name: 'App',
      action: () => router.push('/special-offer'),
      icon: <span className="material-symbols-outlined text-[20px]">smartphone</span>
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
