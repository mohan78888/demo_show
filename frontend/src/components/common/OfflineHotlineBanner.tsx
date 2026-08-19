"use client";

import React from 'react';
import { CONTACT_INFO } from '../../constants/config';

interface OfflineHotlineBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export const OfflineHotlineBanner: React.FC<OfflineHotlineBannerProps> = ({
  title = "Online inventory currently unavailable",
  subtitle = "We have 21+ unpublished offline flights available for this route.",
  description = "Call our offline booking desk for exclusive deals and instant connection. No waiting time.",
  buttonText = "Call Booking Desk",
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="mb-6 md:mb-8 relative z-10 bg-slate-50 dark:bg-slate-900/60 p-4 md:p-6 rounded-xl border border-slate-100 dark:border-slate-800 w-full text-center md:text-left">
        <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">
          {title}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2 text-sm md:text-base">
          {subtitle}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
          {description}
        </p>
      </div>

      <a
        href={CONTACT_INFO.HOTLINE_TEL}
        className="relative z-10 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-xl text-base md:text-lg transition-all shadow-md group w-full sm:w-auto"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
        <span>{buttonText}</span>
      </a>
    </div>
  );
};

export default OfflineHotlineBanner;
