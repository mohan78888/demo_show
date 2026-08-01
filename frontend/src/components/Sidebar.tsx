"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeItem?: 'cruises' | 'flights' | 'hotels' | 'car-rental' | 'trains' | 'holidays' | 'activities' | 'insurance' | 'visa' | 'bus' | 'app';
  isCollapsed?: boolean;
}

export default function Sidebar({ activeItem, isCollapsed = false }: SidebarProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleItemClick = (item: string, route?: string) => {
    if (route) {
      router.push(route);
    } else {
      setToastMessage(
        `${item} booking is available exclusively through our 24/7 Phone Help Desk. Call now for unpublished deals!`
      );
    }
  };

  const getItemClass = (itemKey: typeof activeItem) => {
    const base = isCollapsed
      ? "w-full flex items-center justify-center p-2.5 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 text-center group transition-all duration-200 cursor-pointer relative rounded-xl"
      : "w-full flex items-center gap-3 pl-3.5 pr-2 py-2.5 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 text-left group transition-all duration-200 cursor-pointer relative rounded-xl";
    
    if (activeItem === itemKey) {
      return `${base} bg-[#F8FAFC] dark:bg-slate-800/60 text-[#E8A11A] font-extrabold`;
    }
    return `${base} text-[#0F172A] dark:text-slate-200 hover:text-[#E8A11A] dark:hover:text-[#E8A11A] font-semibold`;
  };

  const getIconClass = (itemKey: typeof activeItem) => {
    if (activeItem === itemKey) {
      return "w-5.5 h-5.5 text-[#E8A11A] transition-colors shrink-0";
    }
    return "w-5.5 h-5.5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors shrink-0";
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-950 py-4 select-none relative transition-all duration-300`}>
      <div className={`flex flex-col gap-0.5 ${isCollapsed ? 'px-1' : 'pl-1 pr-2'}`}>
        
        {/* GROUP 1 */}
        <div>
          <button 
            onClick={() => handleItemClick('Cruises')}
            className={getItemClass('cruises')}
            title={isCollapsed ? "Cruises" : undefined}
          >
            {activeItem === 'cruises' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('cruises')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-3.18a2 2 0 00-1.737 1.01l-1.026 1.78a2 2 0 01-1.737 1.01H9.943a2 2 0 01-1.737-1.01l-1.026-1.78A2 2 0 005.44 13H2" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Cruises</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Flights', '/flights')}
            className={getItemClass('flights')}
            title={isCollapsed ? "Flights" : undefined}
          >
            {activeItem === 'flights' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#E8A11A] rounded-r shadow-sm shadow-[#E8A11A]/40" />}
            <svg className={getIconClass('flights')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15a1.5 1.5 0 011.5 1.5v2.25a1.5 1.5 0 000 3v2.25a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5V13.5a1.5 1.5 0 000-3V8.25a1.5 1.5 0 011.5-1.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2" d="M15 6.75v10.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l2-2 1.5 1.5m-3.5 0l2 2 1.5-1.5" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Flights</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Hotels', '/hotels')}
            className={getItemClass('hotels')}
            title={isCollapsed ? "Hotels" : undefined}
          >
            {activeItem === 'hotels' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('hotels')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V19M21 10V19M3 14H21M3 10C3 10 6 7 12 7C18 7 21 10 21 10M5 19H19" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Hotels</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Car Rental', '/car-rental')}
            className={getItemClass('car-rental')}
            title={isCollapsed ? "Car Rental" : undefined}
          >
            {activeItem === 'car-rental' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('car-rental')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 5h-16l1-5zm2 12a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Car Rental</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Trains')}
            className={getItemClass('trains')}
            title={isCollapsed ? "Trains" : undefined}
          >
            {activeItem === 'trains' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('trains')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 18H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1ZM4 15V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7M16 11H8M12 4v7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 18v3M16 18v3" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Trains</span>}
          </button>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 2 */}
        <div>
          <button 
            onClick={() => handleItemClick('Holidays', '/offers')}
            className={getItemClass('holidays')}
            title={isCollapsed ? "Holidays" : undefined}
          >
            {activeItem === 'holidays' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('holidays')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 0112.728 0M12 3v15M12 18a3 3 0 100-6 3 3 0 000 6zM5.636 5.636L12 12m6.364-6.364L12 12" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Holidays</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Activities')}
            className={getItemClass('activities')}
            title={isCollapsed ? "Activities" : undefined}
          >
            {activeItem === 'activities' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('activities')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-9l2 4-4-2 2-2z" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Activities</span>}
          </button>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 3 */}
        <div>
          <button 
            onClick={() => handleItemClick('Insurance')}
            className={getItemClass('insurance')}
            title={isCollapsed ? "Insurance" : undefined}
          >
            {activeItem === 'insurance' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('insurance')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Insurance</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Visa')}
            className={getItemClass('visa')}
            title={isCollapsed ? "Visa" : undefined}
          >
            {activeItem === 'visa' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('visa')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Visa</span>}
          </button>

          <button 
            onClick={() => handleItemClick('Bus', '/bus')}
            className={getItemClass('bus')}
            title={isCollapsed ? "Bus" : undefined}
          >
            {activeItem === 'bus' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('bus')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8M16 7v8M3 9v7a2 2 0 002 2h14a2 2 0 002-2V9M3 9a2 2 0 012-2h14a2 2 0 012 2M3 9h18M6 21h2m8 0h2" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">Bus</span>}
          </button>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 4 */}
        <div>
          <button 
            onClick={() => handleItemClick('App')}
            className={getItemClass('app')}
            title={isCollapsed ? "App" : undefined}
          >
            {activeItem === 'app' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <svg className={getIconClass('app')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {!isCollapsed && <span className="text-[15px] truncate">App</span>}
          </button>
        </div>
      </div>

      {/* Premium Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[100] max-w-sm bg-slate-900/95 dark:bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 dark:border-slate-800/80 backdrop-blur-md animate-slide-in flex items-start gap-3 transition-all">
          <div className="w-8 h-8 rounded-full bg-[#E8A11A]/20 text-[#E8A11A] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-normal text-slate-100">{toastMessage}</p>
            <div className="mt-2.5 flex items-center gap-4">
              <a href="tel:18887918007" className="text-xs font-black text-[#E8A11A] hover:text-[#f4b63a] transition-colors">Call 1888 791 8007</a>
              <button 
                onClick={() => setToastMessage(null)} 
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
