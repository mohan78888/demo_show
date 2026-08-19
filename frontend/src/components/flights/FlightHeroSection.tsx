"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Users, ChevronDown, Plane, MapPin, Calendar, ArrowLeftRight, Search, Home, Bookmark, FileText, Settings, User } from 'lucide-react';
import AirportAutocomplete from '../AirportAutocomplete';
import FlightSearchForm, { FlightSearchFormState } from '../forms/FlightSearchForm';

interface FlightHeroSectionProps {
  isCheapFlights?: boolean;
  searchForm: FlightSearchFormState;
  onSearchFormChange: (form: FlightSearchFormState) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSwap: () => void;
}

const scrollRevealVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const FlightHeroSection: React.FC<FlightHeroSectionProps> = ({
  isCheapFlights = false,
  searchForm,
  onSearchFormChange,
  onSearchSubmit,
  onSwap
}) => {
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("Non-Stop");
  const totalPassengers = searchForm.adults + searchForm.children + searchForm.infants;

  return (
    <section className="relative bg-slate-950 overflow-hidden">
      {/* MOBILE ONLY VIEW (< md screen sizes) */}
      <div className="block md:hidden pb-8">
        <div className="relative bg-slate-950 h-44 sm:h-52 px-4 text-white overflow-hidden rounded-b-[28px] shadow-lg">
          <div className="absolute inset-0 z-0">
            <Image
              src={isCheapFlights ? "/cheap-flight/nils-nedel-ONpGBpns3cs-unsplash.webp" : "/flight hero/hero3.webp"}
              alt="Flight Hero Background"
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center ${isCheapFlights ? 'opacity-100' : 'opacity-100'}`}
            />
            {isCheapFlights ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/15 to-slate-950/85"></div>
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/20 to-slate-950/70"></div>
            )}
          </div>
        </div>

        <FlightSearchForm
          searchForm={searchForm}
          onChange={onSearchFormChange}
          activeQuickFilter={activeQuickFilter}
          onQuickFilterChange={setActiveQuickFilter}
          onSwap={onSwap}
          onSubmit={onSearchSubmit}
          compact={isCheapFlights}
        />

        {/* Floating Mobile Bottom Navigation */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-3 py-2 rounded-full shadow-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="bg-slate-950 dark:bg-blue-600 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-extrabold shadow-md"
          >
            <Home className="w-3.5 h-3.5 text-white" />
            <span>Home</span>
          </button>
          <button type="button" aria-label="Saved" className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button type="button" aria-label="Bookings" className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <button type="button" aria-label="Settings" className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button type="button" aria-label="Profile" className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW (>= md screen sizes) */}
      <div className="hidden md:block pt-28 pb-12 sm:pt-36 sm:pb-16 md:pt-44 md:pb-20 relative min-h-[480px] lg:min-h-[520px] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={isCheapFlights ? "/cheap-flight/nils-nedel-ONpGBpns3cs-unsplash.webp" : "/flight hero/fligth hero.jpg"}
            alt="Flight Hero Background"
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center transition-all duration-300 ${
              isCheapFlights ? 'opacity-100' : 'opacity-90 md:opacity-95'
            }`}
          />
          {isCheapFlights ? (
            <>
              {/* Light & Real Natural Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/65"></div>
              <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/25 to-slate-950/75"></div>
          )}
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 text-center w-full mt-8 sm:mt-12"
        >
          {/* Multi-Field Search Card */}
          <motion.div
            variants={scrollRevealVariants}
            className={`max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border-2 border-slate-300/80 dark:border-slate-700 text-left ${
              isCheapFlights ? 'p-2 sm:p-2.5 rounded-xl' : 'p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl'
            }`}
          >
            <form onSubmit={onSearchSubmit}>
              {/* Top Controls: Trip Type, Passengers, Class */}
              <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 ${
                isCheapFlights ? 'mb-1.5 pb-1.5' : 'mb-2 pb-2 sm:mb-4 sm:pb-3'
              }`}>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                  {(['one-way', 'round-trip', 'multi-city'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onSearchFormChange({ ...searchForm, tripType: type })}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-extrabold capitalize transition-all ${
                        searchForm.tripType === type
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white"
                      }`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Passenger Counter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all`}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showPassengerDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xl z-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Adults</p>
                            <p className="text-[10px] text-slate-400">12+ years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, adults: Math.max(1, searchForm.adults - 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.adults}</span>
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, adults: Math.min(9, searchForm.adults + 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Children</p>
                            <p className="text-[10px] text-slate-400">2-11 years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, children: Math.max(0, searchForm.children - 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.children}</span>
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, children: Math.min(6, searchForm.children + 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Infants</p>
                            <p className="text-[10px] text-slate-400">Under 2 years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, infants: Math.max(0, searchForm.infants - 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.infants}</span>
                            <button
                              type="button"
                              onClick={() => onSearchFormChange({ ...searchForm, infants: Math.min(4, searchForm.infants + 1) })}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >+</button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowPassengerDropdown(false)}
                          className="w-full py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs uppercase"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Travel Class Selector */}
                  <select
                    value={searchForm.travelClass}
                    onChange={(e) => onSearchFormChange({ ...searchForm, travelClass: e.target.value as any })}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500`}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
              </div>

              {/* Grid Search Inputs */}
              <div className={`rounded-xl sm:rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 shadow-xs ${
                isCheapFlights ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 sm:gap-2.5 items-center">
                  {/* Origin */}
                  <div className={`md:col-span-3 flex items-center gap-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs ${
                    isCheapFlights ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3.5'
                  }`}>
                    <Plane className="w-4 h-4 text-blue-600 shrink-0 rotate-45" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">From / Origin</label>
                      <AirportAutocomplete
                        name="from"
                        placeholder="Departure City (e.g. DEL)"
                        value={searchForm.from}
                        onChange={(code) => onSearchFormChange({ ...searchForm, from: code })}
                        flat={true}
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="md:col-span-1 flex justify-center py-0 sm:py-0">
                    <button
                      onClick={onSwap}
                      type="button"
                      aria-label="Swap Airports"
                      className={`rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all hover:rotate-180 duration-300 shadow-sm ${
                        isCheapFlights ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-7 h-7 sm:w-10 sm:h-10'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className={`md:col-span-3 flex items-center gap-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs ${
                    isCheapFlights ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3.5'
                  }`}>
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">To / Destination</label>
                      <AirportAutocomplete
                        name="to"
                        placeholder="Arrival City (e.g. BOM)"
                        value={searchForm.to}
                        onChange={(code) => onSearchFormChange({ ...searchForm, to: code })}
                        flat={true}
                      />
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className={`${searchForm.tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-2'} flex items-center gap-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs ${
                    isCheapFlights ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3.5'
                  }`}>
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
                      <input
                        type="date"
                        value={searchForm.departDate}
                        onChange={(e) => onSearchFormChange({ ...searchForm, departDate: e.target.value })}
                        className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  {searchForm.tripType === 'round-trip' && (
                    <div className={`md:col-span-2 flex items-center gap-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors shadow-xs ${
                      isCheapFlights ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3.5'
                    }`}>
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Return</label>
                        <input
                          type="date"
                          value={searchForm.returnDate}
                          onChange={(e) => onSearchFormChange({ ...searchForm, returnDate: e.target.value })}
                          className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Search Button */}
                  <div className={`${searchForm.tripType === 'round-trip' ? 'md:col-span-12 lg:col-span-12' : 'md:col-span-3'} mt-1 sm:mt-0`}>
                    <button
                      type="submit"
                      className={`w-full h-full py-2 bg-[#E8A11A] hover:bg-[#d69013] text-slate-955 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer ${
                        isCheapFlights ? 'min-h-[36px] sm:min-h-[40px]' : 'min-h-[38px] sm:min-h-[46px] md:min-h-[50px]'
                      }`}
                    >
                      <Search className="w-4 h-4 text-slate-955" />
                      <span>Search Flights</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className={`border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 sm:gap-2 ${
                isCheapFlights ? 'mt-2 pt-1.5' : 'mt-2.5 pt-2 sm:mt-4 sm:pt-3'
              }`}>
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">Flight Preferences:</span>
                {["Non-Stop", "Student Discount", "Senior Citizen", "Refundable Fares", "Direct Flights"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveQuickFilter(filter)}
                    className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                      activeQuickFilter === filter
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlightHeroSection;
