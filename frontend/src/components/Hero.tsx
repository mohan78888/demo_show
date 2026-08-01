"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SearchParams } from '../types';
import AirportAutocomplete, { resolveIataCode } from './AirportAutocomplete';

interface HeroProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
}

type SearchTab = 'cruises' | 'flights' | 'hotels' | 'cars' | 'holiday' | 'activities';

const HERO_SLIDER_IMAGES = [
  // ✈️ FLIGHTS IN DIFFERENT COUNTRIES
  'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=1920', // Passenger Flight In Blue Sky
  'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=1920', // Transatlantic Flight Sunset
  'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1920', // Flight to Dubai / Middle East
  'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=1920', // Airplane over European Coast

  // 🚢 LUXURY CRUISES IN DIFFERENT COUNTRIES
  'https://images.pexels.com/photos/813011/pexels-photo-813011.jpeg?auto=compress&cs=tinysrgb&w=1920', // Caribbean Cruise Ship & Turquoise Sea
  'https://images.pexels.com/photos/1548008/pexels-photo-1548008.jpeg?auto=compress&cs=tinysrgb&w=1920', // Mediterranean Cruise Ship Greek Isles
  'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1920', // Ocean Liner Voyage
  'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1920', // Fjord & Ocean Cruise Ship

  // 🏨 HOTELS & RESORTS IN DIFFERENT COUNTRIES
  'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1920', // Maldives Overwater Villa Resort
  'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1920', // Bali Luxury Private Pool Resort
  'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1920', // Swiss Alps Ski Resort Chalet
  'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1920', // Santorini Greece Cave Suite Hotel
  'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1920', // Dubai 7-Star Hotel Skyline
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1920', // Luxury Beach Hotel Resort Pool

  // 🌍 TOP COUNTRY DESTINATIONS & HOLIDAY TOURS
  'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1920', // London Big Ben UK Tour
  'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=1920', // Paris Eiffel Tower France
  'https://images.pexels.com/photos/161963/tokyo-japan-night-lights-161963.jpeg?auto=compress&cs=tinysrgb&w=1920', // Tokyo Japan Neon Tour
  'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1920', // Rome Colosseum Italy Sightseeing
  'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=1920', // Sydney Opera House Australia
  'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=1920', // Venice Canal Cruise Italy
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920', // Thailand Maya Bay Island Tour
  'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1920', // Family Traveling Vacation Beach
  'https://images.pexels.com/photos/1682699/pexels-photo-1682699.jpeg?auto=compress&cs=tinysrgb&w=1920', // Airport Family Flight Trip
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1920'  // Tropical Island Holiday
];

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('cruises');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDER_IMAGES.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleFlightSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const rawFrom = (formData.get('from') as string || '').trim();
    const rawTo = (formData.get('to') as string || '').trim();
    const from = resolveIataCode(rawFrom);
    const to = resolveIataCode(rawTo);
    const date = formData.get('date') as string;
    const returnDate = formData.get('returnDate') as string;
    const passengers = Number(formData.get('passengers')) || 1;
    const travelClass = (formData.get('travelClass') as string) || 'Economy';

    if (!from || !to || !date) {
      setError('Please fill all required fields');
      setIsPending(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      await onSearch({ from, to, date, returnDate, passengers, travelClass });
      setIsPending(false);
    }, 600); // 600ms debounce
  };

  const handleHotelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const destination = (formData.get('destination') as string || '').trim();
    const checkIn = formData.get('checkIn') as string;
    const checkOut = formData.get('checkOut') as string;
    const guests = formData.get('guests') as string || '2';

    if (!destination) {
      setError('Please enter a destination');
      return;
    }

    router.push(
      `/hotels?destination=${encodeURIComponent(destination)}&checkIn=${checkIn || ''}&checkOut=${checkOut || ''}&guests=${guests}`
    );
  };

  const handleUnsupportedSubmit = (event: React.FormEvent<HTMLFormElement>, categoryName: string) => {
    event.preventDefault();
    setToastMessage(
      `${categoryName} booking is available exclusively through our 24/7 Phone Help Desk. Call now for unpublished offline deals!`
    );
  };

  const tabClass = (tabKey: SearchTab) => {
    const base = "flex items-center gap-1.5 px-6 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 cursor-pointer select-none whitespace-nowrap";
    if (activeTab === tabKey) {
      return `${base} bg-white text-slate-900 shadow-md`;
    }
    return `${base} text-white/90 hover:bg-white/10 hover:text-white`;
  };

  return (
    <div className="w-full px-2 sm:px-6 lg:px-8 pt-3 pb-8 md:pt-8 md:pb-16 flex flex-col">
      
      {/* 1. Blue Hero Banner Background (Compact Mobile Height 190px / Desktop 360px) */}
      <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-r from-[#0b3372] via-[#0d459c] to-[#041a42] h-[190px] sm:h-[260px] md:h-[360px] flex flex-col justify-center items-center text-center px-4 sm:px-8 select-none shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#F8FAFC] dark:border-slate-800/20">
        
        {/* Auto-playing background image slider layer */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          {HERO_SLIDER_IMAGES.map((imgSrc, index) => (
            <div
              key={imgSrc}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === heroSlideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              <Image 
                src={imgSrc} 
                alt="Luxury Travel Background" 
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
          {/* Subtle dark gradient overlay to improve text readability */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#0b3372]/35 via-[#0d2857]/45 to-[#041a42]/85"></div>
        </div>

        {/* Slide Indicator Dots (Hidden completely) */}
        <div className="hidden absolute top-3 right-3 sm:top-4 sm:right-6 z-30 items-center gap-1.5 bg-black/20 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10">
          {HERO_SLIDER_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === heroSlideIndex ? 'w-4 sm:w-5 bg-[#E8A11A]' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to background slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-20 w-full flex flex-col items-center text-center -mt-4 sm:-mt-8">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight text-white drop-shadow-md">
            Your Trip Starts Here
          </h1>
          
          {/* Glassmorphism badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-extrabold text-white tracking-wide shadow-sm flex items-center gap-1.5">
              <span className="text-[#E8A11A] font-black">✔</span> Secure Payment
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-extrabold text-white tracking-wide shadow-sm flex items-center gap-1.5">
              <span className="text-[#E8A11A] font-black">✔</span> Support in approx. 30s
            </span>
          </div>
        </div>

      </div>

      {/* 2. Floating Navigation & Overlapping Search Card */}
      <div className="relative z-20 w-[98%] sm:w-[92%] lg:w-[94%] max-w-5xl mx-auto flex flex-col items-center gap-2.5 sm:gap-3.5 -mt-10 sm:-mt-16 md:-mt-20">
        
        {/* Floating Dark Navy Navigation Bar */}
        <div className="bg-[#0b3372]/90 backdrop-blur-md border border-white/15 p-1.5 rounded-full flex gap-1 items-center max-w-full overflow-x-auto select-none scrollbar-hide shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          
          <button 
            onClick={() => { setActiveTab('cruises'); setError(null); }}
            className={tabClass('cruises')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'cruises' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-3.18a2 2 0 00-1.737 1.01l-1.026 1.78a2 2 0 01-1.737 1.01H9.943a2 2 0 01-1.737-1.01l-1.026-1.78A2 2 0 005.44 13H2" />
            </svg>
            <span>Cruises</span>
          </button>

          <button 
            onClick={() => { setActiveTab('flights'); setError(null); }}
            className={tabClass('flights')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'flights' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span>Flights</span>
          </button>

          <button 
            onClick={() => { setActiveTab('hotels'); setError(null); }}
            className={tabClass('hotels')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'hotels' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Hotels</span>
          </button>

          <button 
            onClick={() => { setActiveTab('cars'); setError(null); }}
            className={tabClass('cars')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'cars' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 5h-16l1-5zm2 12a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>Car Rental</span>
          </button>

          <button 
            onClick={() => { setActiveTab('holiday'); setError(null); }}
            className={tabClass('holiday')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'holiday' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 0112.728 0M12 3v15M12 18a3 3 0 100-6 3 3 0 000 6zM5.636 5.636L12 12m6.364-6.364L12 12" />
            </svg>
            <span>Holiday</span>
          </button>

          <button 
            onClick={() => { setActiveTab('activities'); setError(null); }}
            className={tabClass('activities')}
          >
            <svg className={`w-4.5 h-4.5 mr-0.5 shrink-0 ${activeTab === 'activities' ? 'text-[#E8A11A]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-9l2 4-4-2 2-2z" />
            </svg>
            <span>Activities</span>
          </button>
        </div>

        {/* Floating Search Card (Compact Mobile Padding & Height) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[30px] p-3.5 sm:p-6 w-full shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#F8FAFC] dark:border-slate-800">
          
          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          {/* CRUISES SEARCH FORM */}
          {activeTab === 'cruises' && (
            <form onSubmit={(e) => handleUnsupportedSubmit(e, 'Cruises')}>
              <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-4 items-center">
                
                {/* Flat Separated Fields */}
                <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 lg:border-0 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-0 bg-slate-50/40 dark:bg-slate-950/20 lg:bg-transparent">
                  
                  {/* Destination */}
                  <div className="lg:col-span-5 lg:px-5 lg:py-2 flex items-start gap-2.5">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">WHERE TO? (CRUISE DESTINATION)</label>
                      <input 
                        type="text" 
                        name="destination" 
                        defaultValue="Caribbean"
                        placeholder="Destination or cruise line"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-xs sm:text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className="lg:col-span-4 lg:px-5 lg:py-2 flex items-start gap-2.5">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">DEPARTURE DATE</label>
                      <input 
                        type="text" 
                        name="date" 
                        defaultValue="Sat, Aug 15, 2026"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-xs sm:text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Cabins & Guests */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-2.5">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">CABINS & GUESTS</label>
                      <select 
                        name="cabins"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-xs sm:text-[15px] focus:ring-0 focus:outline-none cursor-pointer"
                        defaultValue="1"
                      >
                        <option value="1">1 Cabin, 2 Guests</option>
                        <option value="2">1 Cabin, 1 Guest</option>
                        <option value="3">2 Cabins, 4 Guests</option>
                        <option value="4">3+ Cabins, 6+ Guests</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Compact Rounded Search Button */}
                <div className="w-full lg:w-auto shrink-0 flex items-center">
                  <button
                    type="submit"
                    className="w-full lg:w-[150px] bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 font-black py-2.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 h-[44px] sm:h-[56px] cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-950 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Search</span>
                  </button>
                </div>

              </div>
            </form>
          )}

          {/* FLIGHTS SEARCH FORM */}
          {activeTab === 'flights' && (
            <form onSubmit={handleFlightSubmit}>
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Inputs Grid Container */}
                <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 lg:border-0 rounded-2xl p-4 lg:p-0 bg-slate-50/40 dark:bg-slate-950/20 lg:bg-transparent">
                  
                  {/* From */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">From</label>
                      <AirportAutocomplete name="from" placeholder="Departure City" required={true} flat={true} />
                    </div>
                  </div>

                  {/* To */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">To</label>
                      <AirportAutocomplete name="to" placeholder="Arrival City" required={true} flat={true} />
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className="lg:col-span-2 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Departure</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="lg:col-span-2 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Return</label>
                      <input
                        type="date"
                        name="returnDate"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="lg:col-span-2 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Travelers</label>
                      <select
                        name="passengers"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none cursor-pointer"
                        defaultValue="1"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Large Yellow/Orange Rounded Search Button */}
                <div className="w-full lg:w-auto shrink-0 flex items-center">
                  <button
                    type="submit"
                    disabled={isLoading || isPending}
                    className="w-full lg:w-[150px] bg-[#E8A11A] hover:bg-[#d69013] text-slate-955 font-black py-2.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-xl active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 h-[44px] sm:h-[56px] cursor-pointer"
                  >
                    {(isLoading || isPending) ? (
                      <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-955 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm">Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <input type="hidden" name="travelClass" value="Economy" />
            </form>
          )}

          {/* HOTELS SEARCH FORM */}
          {activeTab === 'hotels' && (
            <form onSubmit={handleHotelSubmit}>
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Inputs Grid Container */}
                <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 lg:border-0 rounded-2xl p-4 lg:p-0 bg-slate-50/40 dark:bg-slate-950/20 lg:bg-transparent">
                  
                  {/* Destination */}
                  <div className="lg:col-span-4 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Where to?</label>
                      <input
                        type="text"
                        name="destination"
                        placeholder="Enter city, region or hotel name"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Check-in Date */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Check-in</label>
                      <input
                        type="date"
                        name="checkIn"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Check-out</label>
                      <input
                        type="date"
                        name="checkOut"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Rooms & Guests */}
                  <div className="lg:col-span-2 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Guests</label>
                      <select
                        name="guests"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none cursor-pointer"
                        defaultValue="2"
                      >
                        <option value="1">1 Room, 1 Guest</option>
                        <option value="2">1 Room, 2 Guests</option>
                        <option value="3">1 Room, 3+ Guests</option>
                        <option value="4">2 Rooms, 4+ Guests</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Large Yellow/Orange Rounded Search Button */}
                <div className="w-full lg:w-auto shrink-0 flex items-center">
                  <button
                    type="submit"
                    className="w-full lg:w-[150px] bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 font-black py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 h-[56px] cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-slate-955 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm">Search</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* OTHER TABS */}
          {activeTab !== 'flights' && activeTab !== 'hotels' && activeTab !== 'cruises' && (
            <form onSubmit={(e) => handleUnsupportedSubmit(e, activeTab === 'cars' ? 'Car Rental' : activeTab === 'holiday' ? 'Holiday' : 'Activities')}>
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Inputs Grid Container */}
                <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 lg:border-0 rounded-2xl p-4 lg:p-0 bg-slate-50/40 dark:bg-slate-950/20 lg:bg-transparent">
                  
                  {/* Origin */}
                  <div className="lg:col-span-5 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Location / Departure</label>
                      <input
                        type="text"
                        placeholder="Enter location or terminal"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="lg:col-span-4 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Destination</label>
                      <input
                        type="text"
                        placeholder="Where are you going?"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="lg:col-span-3 lg:px-5 lg:py-2 flex items-start gap-3">
                    <span className="text-[#E8A11A] shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Date</label>
                      <input
                        type="date"
                        className="w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-[15px] focus:ring-0 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Large Yellow/Orange Rounded Search Button */}
                <div className="w-full lg:w-auto shrink-0 flex items-center">
                  <button
                    type="submit"
                    className="w-full lg:w-[150px] bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 font-black py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 h-[56px] cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-slate-955 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm">Search</span>
                  </button>
                </div>

              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};

export default Hero;
