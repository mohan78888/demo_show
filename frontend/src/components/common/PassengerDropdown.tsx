"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface PassengerDropdownProps {
  adults: number;
  onAdultsChange: (val: number) => void;
  childrenCount?: number;
  onChildrenChange?: (val: number) => void;
  infantsCount?: number;
  onInfantsChange?: (val: number) => void;
  minAdults?: number;
  maxAdults?: number;
  label?: string;
  className?: string;
}

export const PassengerDropdown: React.FC<PassengerDropdownProps> = ({
  adults,
  onAdultsChange,
  minAdults = 1,
  maxAdults = 9,
  label = "Travelers",
  className = "p-3 bg-white dark:bg-white rounded-2xl border-2 border-slate-300 dark:border-slate-300 flex items-center justify-between shadow-xs",
}) => {
  const totalPassengers = adults;

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-600" />
        <div>
          <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-500">{label}</label>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-800">
            {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Stepper Control [- 01 +] */}
      <div className="flex items-center gap-2 bg-white dark:bg-white px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-300 shadow-xs">
        <button
          type="button"
          onClick={() => onAdultsChange(Math.max(minAdults, adults - 1))}
          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-100 text-slate-700 dark:text-slate-800 font-black text-xs flex items-center justify-center active:scale-90 cursor-pointer"
        >-</button>
        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-900 px-1">
          {String(adults).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => onAdultsChange(Math.min(maxAdults, adults + 1))}
          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-100 text-slate-700 dark:text-slate-800 font-black text-xs flex items-center justify-center active:scale-90 cursor-pointer"
        >+</button>
      </div>
    </div>
  );
};

export default PassengerDropdown;
