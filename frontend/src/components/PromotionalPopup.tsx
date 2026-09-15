"use client";

import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants/config';
import { Badge } from '@/components/ui/Badge';

interface PromotionalPopupProps {
  onClose: () => void;
  minPrice: number;
  route: string;
}

const PromotionalPopup: React.FC<PromotionalPopupProps> = ({ onClose, minPrice, route }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[100] animate-in slide-in-from-bottom duration-500">
        <div 
          onClick={() => setIsMinimized(false)}
          className="bg-white dark:bg-slate-900 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 p-2 sm:p-2.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group relative pr-10 sm:pr-14"
        >
          {/* Circular Glowing Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/40 group-hover:scale-105 transition-transform relative">
             <div className="absolute inset-0 border-2 border-white/20 text-white rounded-full animate-ping"></div>
             <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
             </svg>
          </div>
          
          {/* Banner Text (Hidden on very small screens, visible on sm and up) */}
          <div className="hidden sm:block">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Offline Promo</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{route || "Secret Deal"}</p>
          </div>
          <div className="block sm:hidden px-1">
             <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Sale</p>
          </div>

          {/* Close Widget Button */}
          <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                onClose(); // Completely destroys the component in App.tsx
            }}
            className="absolute right-2 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-black dark:hover:bg-slate-700 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl w-full max-w-[280px] sm:max-w-xs md:max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-500 border border-transparent dark:border-slate-800">
        
        {/* Minimize Button in Top Right */}
        <button 
          onClick={() => setIsMinimized(true)}
          className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-400 md:text-slate-500 md:hover:bg-slate-200 transition-colors z-20"
        >
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col h-full">
          <div className="bg-blue-600 dark:bg-blue-700 p-3 md:p-4 text-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
            
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white animate-float">
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
               </svg>
            </div>
            
            <h2 className="text-white text-sm md:text-base font-black mb-1.5 leading-tight px-2 md:px-0">Unpublished Price Alert</h2>
            <Badge variant="warning" className="shadow-lg bg-orange-500 text-white border-transparent">
              Flash Deal Available
            </Badge>
          </div>
          
          <div className="p-3 md:p-4 flex flex-col items-center">
            <div className="text-center mb-3">
              <div className="text-slate-800 dark:text-white text-[13px] md:text-sm font-semibold leading-snug mx-auto max-w-[260px] md:max-w-[300px]">
                <span className="block mb-1">Route: <span className="font-black">{route || "Premium Flights"}</span></span>
                Online Fare: <span className="text-slate-400 dark:text-slate-500 line-through font-bold">${minPrice.toLocaleString()}</span>
                <span className="block mt-1.5 text-[14px] md:text-base font-black text-purple-600 dark:text-purple-400">21+ Unpublished Flights Available!</span>
                <span className="block mt-1.5 font-black text-slate-900 dark:text-slate-200">Offline Offer: <span className="text-orange-600 dark:text-orange-500 text-lg md:text-xl underline decoration-2 underline-offset-4">${Math.floor(minPrice * 0.85).toLocaleString()}</span></span>
              </div>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-2.5 md:p-3 flex flex-col items-center mb-3 group hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Direct Booking Hotline</span>
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center animate-pulse shrink-0">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <a href={CONTACT_INFO.HOTLINE_TEL} className="text-lg md:text-xl font-black text-blue-900 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors whitespace-nowrap">{CONTACT_INFO.HOTLINE_DISPLAY}</a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full">
              <a href={CONTACT_INFO.HOTLINE_TEL} className="bg-orange-500 hover:bg-orange-600 text-white text-xs md:text-sm font-bold py-2.5 rounded-xl shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                Call Now
              </a>
              <button 
                onClick={() => setIsMinimized(true)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] md:text-xs py-2 rounded-xl transition-all active:scale-95"
              >
                No Thanks, Continue Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;