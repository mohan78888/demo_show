"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CONTACT_INFO } from '../constants/config';

interface SidebarProps {
  activeItem?: 'cruises' | 'flights' | 'hotels' | 'car-rental' | 'trains' | 'holidays' | 'activities' | 'insurance' | 'visa' | 'bus' | 'app';
  isCollapsed?: boolean;
}

export default function Sidebar({ activeItem, isCollapsed = false }: SidebarProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Proactively prefetch common routes in background on mount
    router.prefetch('/hotels');
    router.prefetch('/flights');
    router.prefetch('/bus');
    router.prefetch('/car-rental');
    router.prefetch('/offers');
  }, [router]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleToastClick = (item: string) => {
    setToastMessage(
      `${item} booking is available exclusively through our 24/7 Phone Help Desk. Call now for unpublished deals!`
    );
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
      return "material-symbols-outlined text-[22px] text-[#E8A11A] transition-colors shrink-0 select-none";
    }
    return "material-symbols-outlined text-[22px] text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors shrink-0 select-none";
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-950 py-4 select-none relative transition-all duration-300`}>
      <div className={`flex flex-col gap-0.5 ${isCollapsed ? 'px-1' : 'pl-1 pr-2'}`}>
        
        {/* GROUP 1 */}
        <div>
          <button 
            onClick={() => handleToastClick('Cruises')}
            className={getItemClass('cruises')}
            title={isCollapsed ? "Cruises" : undefined}
          >
            {activeItem === 'cruises' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('cruises')}>directions_boat</span>
            {!isCollapsed && <span className="text-[15px] truncate">Cruises</span>}
          </button>

          <Link 
            href="/flights"
            prefetch={true}
            className={getItemClass('flights')}
            title={isCollapsed ? "Flights" : undefined}
          >
            {activeItem === 'flights' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#E8A11A] rounded-r shadow-sm shadow-[#E8A11A]/40" />}
            <span className={getIconClass('flights')}>flight</span>
            {!isCollapsed && <span className="text-[15px] truncate">Flights</span>}
          </Link>

          <Link 
            href="/hotels"
            prefetch={true}
            className={getItemClass('hotels')}
            title={isCollapsed ? "Hotels" : undefined}
          >
            {activeItem === 'hotels' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('hotels')}>hotel</span>
            {!isCollapsed && <span className="text-[15px] truncate">Hotels</span>}
          </Link>

          <Link 
            href="/car-rental"
            prefetch={true}
            className={getItemClass('car-rental')}
            title={isCollapsed ? "Car Rental" : undefined}
          >
            {activeItem === 'car-rental' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('car-rental')}>directions_car</span>
            {!isCollapsed && <span className="text-[15px] truncate">Car Rental</span>}
          </Link>

          <button 
            onClick={() => handleToastClick('Trains')}
            className={getItemClass('trains')}
            title={isCollapsed ? "Trains" : undefined}
          >
            {activeItem === 'trains' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('trains')}>train</span>
            {!isCollapsed && <span className="text-[15px] truncate">Trains</span>}
          </button>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 2 */}
        <div>
          <Link 
            href="/offers"
            prefetch={true}
            className={getItemClass('holidays')}
            title={isCollapsed ? "Holidays" : undefined}
          >
            {activeItem === 'holidays' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('holidays')}>luggage</span>
            {!isCollapsed && <span className="text-[15px] truncate">Holidays</span>}
          </Link>

          <button 
            onClick={() => handleToastClick('Activities')}
            className={getItemClass('activities')}
            title={isCollapsed ? "Activities" : undefined}
          >
            {activeItem === 'activities' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('activities')}>local_activity</span>
            {!isCollapsed && <span className="text-[15px] truncate">Activities</span>}
          </button>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 3 */}
        <div>
          <button 
            onClick={() => handleToastClick('Insurance')}
            className={getItemClass('insurance')}
            title={isCollapsed ? "Insurance" : undefined}
          >
            {activeItem === 'insurance' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('insurance')}>verified_user</span>
            {!isCollapsed && <span className="text-[15px] truncate">Insurance</span>}
          </button>

          <button 
            onClick={() => handleToastClick('Visa')}
            className={getItemClass('visa')}
            title={isCollapsed ? "Visa" : undefined}
          >
            {activeItem === 'visa' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('visa')}>travel_explore</span>
            {!isCollapsed && <span className="text-[15px] truncate">Visa</span>}
          </button>

          <Link 
            href="/bus"
            prefetch={true}
            className={getItemClass('bus')}
            title={isCollapsed ? "Bus" : undefined}
          >
            {activeItem === 'bus' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('bus')}>directions_bus</span>
            {!isCollapsed && <span className="text-[15px] truncate">Bus</span>}
          </Link>
        </div>

        <div className={`h-px bg-slate-100 dark:bg-slate-800/80 my-2.5 ${isCollapsed ? 'mx-2' : 'mx-5'}`} />

        {/* GROUP 4 */}
        <div>
          <button 
            onClick={() => handleToastClick('App')}
            className={getItemClass('app')}
            title={isCollapsed ? "App" : undefined}
          >
            {activeItem === 'app' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#E8A11A] rounded-r" />}
            <span className={getIconClass('app')}>smartphone</span>
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
              <a href={CONTACT_INFO.HOTLINE_TEL} className="text-xs font-black text-[#E8A11A] hover:text-[#f4b63a] transition-colors">Call {CONTACT_INFO.HOTLINE_DISPLAY}</a>
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
