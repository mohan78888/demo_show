"use client";

import React from 'react';
import AirportAutocomplete from '../AirportAutocomplete';
import LocationSwapButton from '../common/LocationSwapButton';
import PassengerDropdown from '../common/PassengerDropdown';
import { Plane, MapPin, Calendar, Search } from 'lucide-react';

export interface FlightSearchFormState {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  tripType: 'one-way' | 'round-trip' | 'multi-city';
  travelClass: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  adults: number;
  children: number;
  infants: number;
}

interface FlightSearchFormProps {
  searchForm: FlightSearchFormState;
  onChange: (form: FlightSearchFormState) => void;
  activeQuickFilter: string;
  onQuickFilterChange: (filter: string) => void;
  onSwap: () => void;
  onSubmit: (e: React.FormEvent) => void;
  compact?: boolean;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  searchForm,
  onChange,
  activeQuickFilter,
  onQuickFilterChange,
  onSwap,
  onSubmit,
  compact = false,
}) => {
  return (
    <div className={`relative z-20 -mt-7 mx-3 bg-white dark:bg-white shadow-2xl border border-slate-200 dark:border-slate-200 text-left ${
      compact ? 'rounded-xl sm:rounded-2xl p-2.5 sm:p-3' : 'rounded-[28px] p-3.5 sm:p-4.5'
    }`}>
      <form onSubmit={onSubmit} className={compact ? "space-y-2" : "space-y-3"}>

        {/* TOP CONTROLS: Trip Type Toggle, Travel Class */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-200">
          {/* Trip Type Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-100 border border-slate-200 p-1 rounded-xl">
            {(['one-way', 'round-trip', 'multi-city'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...searchForm, tripType: type })}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer ${searchForm.tripType === type
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-slate-700"
                  }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Travel Class Selector */}
          <select
            value={searchForm.travelClass}
            onChange={(e) => onChange({ ...searchForm, travelClass: e.target.value as any })}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-white border border-slate-300 dark:border-slate-300 text-xs font-extrabold text-slate-700 dark:text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium</option>
            <option value="Business">Business</option>
            <option value="First Class">First</option>
          </select>
        </div>

        {/* SEARCH FIELDS */}
        <div className="space-y-2.5">

          {/* From / Origin Field */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-white border-2 border-slate-300 dark:border-slate-300 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
            <Plane className="w-4 h-4 text-blue-600 shrink-0 rotate-45" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-500">From / Origin</label>
              <AirportAutocomplete
                name="from"
                placeholder="Departure City (e.g. DEL)"
                value={searchForm.from}
                onChange={(code) => onChange({ ...searchForm, from: code })}
                flat={true}
              />
            </div>
          </div>

          {/* Swap Button Divider */}
          <LocationSwapButton onSwap={onSwap} ariaLabel="Swap Airports" />

          {/* To / Destination Field */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-white border-2 border-slate-300 dark:border-slate-300 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-500">To / Destination</label>
              <AirportAutocomplete
                name="to"
                placeholder="Arrival City (e.g. BOM)"
                value={searchForm.to}
                onChange={(code) => onChange({ ...searchForm, to: code })}
                flat={true}
              />
            </div>
          </div>

          {/* Date Fields Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Departure Date */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white border-2 border-slate-300 dark:border-slate-300 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-500">Departure</label>
                <input
                  type="date"
                  value={searchForm.departDate}
                  onChange={(e) => onChange({ ...searchForm, departDate: e.target.value })}
                  className="w-full bg-transparent font-bold text-slate-900 dark:text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Return Date */}
            <div className={`flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white border-2 border-slate-300 dark:border-slate-300 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs ${searchForm.tripType === 'one-way' ? 'opacity-40 pointer-events-none' : ''}`}>
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-500">Return</label>
                <input
                  type="date"
                  disabled={searchForm.tripType === 'one-way'}
                  value={searchForm.returnDate}
                  onChange={(e) => onChange({ ...searchForm, returnDate: e.target.value })}
                  className="w-full bg-transparent font-bold text-slate-900 dark:text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Passengers Stepper Row */}
          <PassengerDropdown
            adults={searchForm.adults}
            onAdultsChange={(val) => onChange({ ...searchForm, adults: val })}
          />

        </div>

        {/* Primary Search CTA Button */}
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-[#E8A11A] hover:bg-[#d69013] text-slate-955 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-955" />
          <span>Search Flights</span>
        </button>

        {/* Quick Filter Chips */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-200 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
          {["Non-Stop", "Student Discount", "Refundable", "Direct"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onQuickFilterChange(filter)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${activeQuickFilter === filter
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-100 text-slate-600 dark:text-slate-700 border border-slate-200 dark:border-slate-300"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default FlightSearchForm;
