"use client";

import React from 'react';
import { MapPin, Calendar, Search, ArrowLeftRight } from 'lucide-react';

export interface BusSearchFormState {
  from: string;
  to: string;
  date: string;
  busType: string;
}

interface BusSearchFormProps {
  searchForm: BusSearchFormState;
  onChange: (form: BusSearchFormState) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSwap: () => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export const BusSearchForm: React.FC<BusSearchFormProps> = ({
  searchForm,
  onChange,
  activeFilter,
  onFilterChange,
  onSwap,
  onSearchSubmit,
}) => {
  return (
    <div className="mt-4 sm:mt-6 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-300/80 dark:border-slate-700 text-left">
      <div className="p-2 sm:p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
          
          {/* From */}
          <div className="md:col-span-3 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
            <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">From</label>
              <input 
                type="text" 
                value={searchForm.from} 
                onChange={(e) => onChange({ ...searchForm, from: e.target.value })}
                className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none truncate"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-0.5 sm:py-0">
            <button 
              onClick={onSwap}
              type="button"
              aria-label="Swap Locations"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all hover:rotate-180 duration-300 shadow-sm cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-3 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
            <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">To</label>
              <input 
                type="text" 
                value={searchForm.to} 
                onChange={(e) => onChange({ ...searchForm, to: e.target.value })}
                className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none truncate"
              />
            </div>
          </div>

          {/* Date */}
          <div className="md:col-span-2 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
            <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
              <input 
                type="date" 
                value={searchForm.date} 
                onChange={(e) => onChange({ ...searchForm, date: e.target.value })}
                className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3">
            <button 
              type="button"
              onClick={onSearchSubmit}
              className="w-full h-full min-h-[44px] md:min-h-[52px] bg-[#E8A11A] hover:bg-[#d69013] text-slate-955 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-955" />
              Search Buses
            </button>
          </div>

        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick Filters:</span>
        {["AC Sleeper", "Volvo Luxury", "Express Coach", "Inter-Country"].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              onFilterChange(filter);
              onChange({ ...searchForm, busType: filter });
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusSearchForm;
