"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CheapestFlights from './CheapestFlights';
import AirportAutocomplete, { resolveIataCode } from './AirportAutocomplete';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  ArrowLeftRight, 
  Search, 
  Sparkles, 
  Headphones, 
  ShieldCheck, 
  Star, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Tag,
  Users,
  ChevronDown,
  Clock,
  Zap,
  Globe,
  Award,
  BadgePercent
} from 'lucide-react';

interface FlightSearchForm {
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

const scrollRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 35, 
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

export default function FlightsPage() {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: "JFK - New York, USA",
    to: "LHR - London, UK",
    departDate: "2026-08-10",
    returnDate: "2026-08-24",
    tripType: "round-trip",
    travelClass: "Economy",
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("Non-Stop");
  const [activeOfferTab, setActiveOfferTab] = useState<'All' | 'International' | 'Domestic' | 'Business' | 'Student'>("All");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offerSliderRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (offerSliderRef.current) {
      offerSliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (offerSliderRef.current) {
      offerSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleSwap = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = resolveIataCode(searchForm.from);
    const toCode = resolveIataCode(searchForm.to);
    const query = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date: searchForm.departDate,
      class: searchForm.travelClass,
    }).toString();
    router.push(`/?${query}`);
  };

  const totalPassengers = searchForm.adults + searchForm.children + searchForm.infants;

  const flightOffers = [
    {
      id: "f1",
      category: "International" as const,
      badgeLabel: "International Flight",
      code: "FLYHIGH",
      title: "Save up to $250 on transatlantic flights",
      validity: "Valid till 31 Aug",
      bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#C7D2FE]",
    },
    {
      id: "f2",
      category: "Business" as const,
      badgeLabel: "Business Class",
      code: "BIZLUX",
      title: "Flat $500 Off on Business Class seats",
      validity: "Valid till 15 Aug",
      bgClass: "bg-gradient-to-br from-[#FEF08A] via-[#FACC15] to-[#EAB308]",
    },
    {
      id: "f3",
      category: "Domestic" as const,
      badgeLabel: "Domestic Flight",
      code: "FLYUS50",
      title: "Save $50 on US domestic round trips",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#FEF08A]",
    },
    {
      id: "f4",
      category: "Student" as const,
      badgeLabel: "Student Special",
      code: "STUDENTX",
      title: "Extra 15% Off + 1 Free Extra Baggage",
      validity: "Valid till 30 Sep",
      bgClass: "bg-gradient-to-br from-[#FEE2E2] via-[#FCE7F3] to-[#FFEDD5]",
    },
    {
      id: "f5",
      category: "International" as const,
      badgeLabel: "Europe Special",
      code: "EUROFLY",
      title: "Up to $300 Instant Discount to Europe",
      validity: "Valid till 31 Aug",
      bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#C7D2FE] to-[#DDD6FE]",
    }
  ];

  const filteredFlightOffers = activeOfferTab === 'All' 
    ? flightOffers 
    : flightOffers.filter(o => o.category === activeOfferTab);

  const featuredFlightDeals = [
    {
      destination: "London, United Kingdom 🇬🇧",
      code: "LHR",
      origin: "New York (JFK)",
      price: "$499",
      type: "Return Fare",
      airline: "British Airways / Virgin",
      features: ["Meal Included", "2x 23kg Luggage", "Free Selection"],
      img: "/Images/Flight/London Retun Fare.webp",
      badgeColor: "bg-blue-600",
      gradient: "from-blue-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      destination: "Paris, France 🇫🇷",
      code: "CDG",
      origin: "New York (JFK)",
      price: "$529",
      type: "Return Fare",
      airline: "Air France / Delta",
      features: ["In-flight Wi-Fi", "Hot Meals", "Direct Flight"],
      img: "/Images/Flight/paris return fare.webp",
      badgeColor: "bg-indigo-600",
      gradient: "from-indigo-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      destination: "Tokyo, Japan 🇯🇵",
      code: "HND",
      origin: "Los Angeles (LAX)",
      price: "$680",
      type: "Return Fare",
      airline: "ANA / Japan Airlines",
      features: ["Premium Economy Option", "2 Free Bags", "Entertainment"],
      img: "/Images/Flight/Tokyo Retun Fare.webp",
      badgeColor: "bg-red-600",
      gradient: "from-red-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      destination: "Dubai, UAE 🇦🇪",
      code: "DXB",
      origin: "Chicago (ORD)",
      price: "$590",
      type: "Return Fare",
      airline: "Emirates / United",
      features: ["Award Winning Dining", "Non-stop", "Flexible Date"],
      img: "/Images/Flight/Dubai Retun Fare.webp",
      badgeColor: "bg-emerald-600",
      gradient: "from-emerald-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      destination: "Sydney, Australia 🇦🇺",
      code: "SYD",
      origin: "San Francisco (SFO)",
      price: "$790",
      type: "Return Fare",
      airline: "Qantas / United",
      features: ["Spacious Seats", "Complimentary Drinks", "Priority"],
      img: "/Images/Flight/Sydney Retun Fare.webp",
      badgeColor: "bg-amber-600",
      gradient: "from-amber-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      destination: "Singapore 🇸🇬",
      code: "SIN",
      origin: "Los Angeles (LAX)",
      price: "$610",
      type: "Return Fare",
      airline: "Singapore Airlines",
      features: ["5-Star Airline", "World Class Service", "Instant Refund"],
      img: "/Images/Flight/Singapore Retun Fare.webp",
      badgeColor: "bg-purple-600",
      gradient: "from-purple-950/90 via-slate-900/85 to-slate-950/90"
    }
  ];

  const TOP_DESTINATIONS = [
    {
      id: '1',
      name: 'New York',
      dates: '25AUG26-18SEP26',
      price: '$474',
      img: '/Images/Flight/London Retun Fare.webp',
    },
    {
      id: '2',
      name: 'Las Vegas',
      dates: '25FEB27-04MAR27',
      price: '$577',
      img: '/Images/Flight/Dubai Retun Fare.webp',
    },
    {
      id: '3',
      name: 'Washington',
      dates: '05SEP26-17OCT26',
      price: '$469',
      img: '/Images/Flight/Capetown Retun Fare.webp',
    },
    {
      id: '4',
      name: 'Bangkok',
      dates: '04SEP26-30SEP26',
      price: '$557',
      img: '/Images/Flight/Singapore Retun Fare.webp',
    },
    {
      id: '5',
      name: 'Miami',
      dates: '24JAN27-01FEB27',
      price: '$508',
      img: '/Images/Flight/Cancun Retun Fare.webp',
    },
    {
      id: '6',
      name: 'Toronto',
      dates: '16SEP26-30SEP26',
      price: '$463',
      img: '/Images/Flight/Sydney Retun Fare.webp',
    },
    {
      id: '7',
      name: 'Mumbai',
      dates: '19DEC26-15JAN27',
      price: '$405',
      img: '/Images/Flight/Tokyo Retun Fare.webp',
    },
    {
      id: '8',
      name: 'Amritsar',
      dates: '06SEP26-20SEP26',
      price: '$565',
      img: '/Images/Flight/Beijing Retun Fare.webp',
    },
    {
      id: '9',
      name: 'Goa',
      dates: '04AUG26-31AUG26',
      price: '$368',
      img: '/Images/Flight/paris return fare.webp',
    },
  ];

  const airlinePartners = [
    { name: "Emirates", logo: "🇦🇪", rating: "4.9★", tag: "5-Star Airline" },
    { name: "British Airways", logo: "🇬🇧", rating: "4.8★", tag: "Flag Carrier" },
    { name: "Delta Air Lines", logo: "🇺🇸", rating: "4.7★", tag: "Top USA" },
    { name: "Qatar Airways", logo: "🇶🇦", rating: "4.9★", tag: "World Best" },
    { name: "Singapore Airlines", logo: "🇸🇬", rating: "4.9★", tag: "Luxury Comfort" },
    { name: "Lufthansa", logo: "🇩🇪", rating: "4.8★", tag: "Europe Express" }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO & FLIGHT SEARCH ENGINE SECTION */}
      <section className="relative bg-slate-900 pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-24 md:pb-12 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/flight hero/fligth hero.jpg" 
            alt="Flight Hero Background" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55 md:opacity-65 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/90"></div>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 text-center"
        >
          {/* Badge */}
          <motion.div variants={scrollRevealVariants} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/40 border border-blue-400/50 text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Lowest Airfares Guaranteed • 24/7 Phone Desk
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={scrollRevealVariants} className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-lg">
            Book Flights Worldwide <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-300">with Unpublished Phone Deals</span>
          </motion.h1>
          <motion.p variants={scrollRevealVariants} className="mt-1 text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto font-semibold drop-shadow-md">
            Search over 500+ top airlines across 10,000+ routes with zero hidden fees.
          </motion.p>

          {/* FLIGHT-SPECIFIC MULTI-FIELD SEARCH CARD */}
          <motion.div variants={scrollRevealVariants} className="mt-4 sm:mt-6 max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800 text-left">
            <form onSubmit={handleSearchSubmit}>
              
              {/* TOP CONTROLS: Trip Type, Passengers Counter, Travel Class */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 sm:gap-3 sm:mb-4 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
                
                {/* Trip Type Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['one-way', 'round-trip', 'multi-city'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSearchForm({ ...searchForm, tripType: type })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                        searchForm.tripType === type
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white"
                      }`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Right Group: Passengers Selector & Travel Class Selector */}
                <div className="flex items-center gap-2.5">
                  
                  {/* Passenger Counter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all"
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Passenger Modal Popup */}
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
                              onClick={() => setSearchForm(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.adults}</span>
                            <button
                              type="button"
                              onClick={() => setSearchForm(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
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
                              onClick={() => setSearchForm(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.children}</span>
                            <button
                              type="button"
                              onClick={() => setSearchForm(p => ({ ...p, children: Math.min(6, p.children + 1) }))}
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
                              onClick={() => setSearchForm(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">{searchForm.infants}</span>
                            <button
                              type="button"
                              onClick={() => setSearchForm(p => ({ ...p, infants: Math.min(4, p.infants + 1) }))}
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
                    onChange={(e) => setSearchForm({ ...searchForm, travelClass: e.target.value as any })}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>

              </div>

              {/* SEARCH FIELDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* From Field */}
                <div className="md:col-span-3 flex items-center gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 rotate-45" />
                  <div className="min-w-0 flex-1">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">From / Origin</label>
                    <AirportAutocomplete 
                      name="from"
                      placeholder="Departure City (e.g. DEL)"
                      value={searchForm.from}
                      onChange={(code) => setSearchForm(prev => ({ ...prev, from: code }))}
                      flat={true}
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-1 flex justify-center py-0 sm:py-0">
                  <button 
                    onClick={handleSwap}
                    type="button"
                    aria-label="Swap Airports"
                    className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all hover:rotate-180 duration-300 shadow-sm"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* To Field */}
                <div className="md:col-span-3 flex items-center gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">To / Destination</label>
                    <AirportAutocomplete 
                      name="to"
                      placeholder="Arrival City (e.g. BOM)"
                      value={searchForm.to}
                      onChange={(code) => setSearchForm(prev => ({ ...prev, to: code }))}
                      flat={true}
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div className={`${searchForm.tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-2'} flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60`}>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
                    <input 
                      type="date" 
                      value={searchForm.departDate} 
                      onChange={(e) => setSearchForm({...searchForm, departDate: e.target.value})}
                      className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Return Date (Conditional for Round Trip) */}
                {searchForm.tripType === 'round-trip' && (
                  <div className="md:col-span-2 flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Return</label>
                      <input 
                        type="date" 
                        value={searchForm.returnDate} 
                        onChange={(e) => setSearchForm({...searchForm, returnDate: e.target.value})}
                        className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Search Flights CTA Button */}
                <div className={`${searchForm.tripType === 'round-trip' ? 'md:col-span-12 lg:col-span-12' : 'md:col-span-3'} mt-1.5 sm:mt-0`}>
                  <button 
                    type="submit"
                    className="w-full h-full min-h-[38px] sm:min-h-[46px] md:min-h-[50px] py-2 sm:py-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4" />
                    Search Flights
                  </button>
                </div>

              </div>

              {/* Quick Filter Chips */}
              <div className="mt-2.5 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">Flight Preferences:</span>
                {["Non-Stop", "Student Discount", "Senior Citizen", "Refundable Fares", "Direct Flights"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveQuickFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
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
      </section>

      {/* 2. EXCLUSIVE FLIGHT OFFERS SLIDER */}
      <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Exclusive Flight Offers & Coupon Codes
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Save big on international and domestic flight tickets with our promo codes.
            </p>
          </div>

          {/* Slider Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleScrollLeft}
              type="button"
              aria-label="Previous Offers"
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
            </button>
            <button 
              onClick={handleScrollRight}
              type="button"
              aria-label="Next Offers"
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <ArrowRight className="w-5 h-5 text-slate-800 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {(['All', 'International', 'Domestic', 'Business', 'Student'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveOfferTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 shrink-0 relative ${
                activeOfferTab === tab
                  ? "bg-[#E8A11A] text-slate-950 shadow-md shadow-[#E8A11A]/30 scale-105 border-2 border-[#c88812] font-black"
                  : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Sliding Offer Cards */}
        <div 
          ref={offerSliderRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory pt-1 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredFlightOffers.map((offer) => (
              <motion.div 
                key={offer.id} 
                layout
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`w-[280px] sm:w-[320px] shrink-0 snap-start relative rounded-2xl ${offer.bgClass} p-5 shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between min-h-[195px] hover:shadow-md cursor-pointer`}
              >
                <div>
                  <span className="inline-block bg-slate-800/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-3">
                    {offer.badgeLabel}
                  </span>
                  <h3 className="text-slate-900 font-extrabold text-base sm:text-lg leading-snug max-w-[85%]">
                    {offer.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-700/90 mt-1">
                    {offer.validity}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-4 relative z-10">
                  <motion.button 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopyCode(offer.code)}
                    className="bg-white shadow-md text-slate-900 rounded-full px-3.5 py-1.5 font-black text-xs border border-slate-100 flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#E8A11A] fill-[#E8A11A]/20" />
                    <span>{copiedCode === offer.code ? "COPIED" : offer.code}</span>
                  </motion.button>

                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                    <Plane className="w-5 h-5 text-blue-600 rotate-45" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* CHEAPEST FLIGHTS CAROUSEL SECTION */}
      <CheapestFlights />

      {/* 3. TOP DESTINATIONS SECTION */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60"
      >
        <motion.div variants={scrollRevealVariants} className="text-left mb-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Top Destinations
          </h2>
          <p className="mt-1.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-2xl">
            Explore handpicked flight deals to world-famous cities with guaranteed best fares.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TOP_DESTINATIONS.map((dest) => (
            <motion.div 
              key={dest.id}
              variants={scrollRevealVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              onClick={() => {
                setSearchForm(prev => ({
                  ...prev,
                  to: dest.name,
                }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative overflow-hidden rounded-2xl h-[175px] sm:h-[190px] md:h-[200px] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              {/* Background Image */}
              <Image 
                src={dest.img} 
                alt={dest.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Bottom Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4.5 flex items-end justify-between z-10">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                    {dest.dates}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                    {dest.price}
                  </span>
                  <span className="text-xs font-bold text-slate-300 ml-0.5">
                    pp
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. SEO CONTENT SECTION */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-slate-200 dark:border-slate-800/80 text-left">
        {/* Main Title & Overview */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Affordable Flights to Destinations Worldwide
        </h2>

        <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
          <p>
            At <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong>, we believe that exceptional travel experiences should be accessible to everyone. Whether you're planning a business trip, a family vacation, a romantic getaway, or a solo adventure, we help you find affordable domestic and international flights without compromising on quality or convenience.
          </p>
          <p>
            Our advanced flight search platform compares fares from trusted airlines and travel partners, allowing you to discover competitive prices for destinations across the globe. From bustling metropolitan cities to breathtaking island escapes and hidden gems, your next journey begins with the right fare.
          </p>
          <p>
            We are committed to making flight booking simple, secure, and stress-free. With an intuitive booking experience, transparent pricing, and reliable customer support, planning your trip has never been easier.
          </p>
        </div>

        {/* Why Choose Section (Stacked Checkmark List matching user image) */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Why Choose Tour Help Desk?
        </h3>

        <div className="space-y-3 mb-8">
          {[
            {
              title: "Competitive Airfares",
              desc: "Access great flight deals from leading airlines and trusted travel partners."
            },
            {
              title: "Worldwide Destinations",
              desc: "Explore thousands of domestic and international routes from one convenient platform."
            },
            {
              title: "Simple & Secure Booking",
              desc: "Search, compare, book, and receive your e-ticket instantly through our secure payment system."
            },
            {
              title: "24/7 Customer Assistance",
              desc: "Our travel experts are available around the clock to assist with bookings, cancellations, flight changes, and travel-related queries."
            },
            {
              title: "Exclusive Travel Deals",
              desc: "Enjoy seasonal promotions, special discounts, and last-minute offers to help you save more on every journey."
            },
            {
              title: "Trusted Travel Experience",
              desc: "We prioritize transparency, reliability, and customer satisfaction to ensure a seamless booking experience from start to finish."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-1 text-[10px] font-black">
                ✓
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-normal">
                <strong className="text-slate-900 dark:text-white font-bold">{item.title}</strong> – {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Your Journey Starts Here */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3">
          Your Journey Starts Here
        </h3>

        <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <p>
            Every journey begins with the perfect flight. Whether you're travelling for business, leisure, education, or a special occasion, <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong> is dedicated to helping you reach your destination comfortably, affordably, and with complete peace of mind.
          </p>
          <p>
            Start exploring the world with confidence and let <strong className="text-slate-900 dark:text-white font-bold">Tour Help Desk</strong> be your trusted travel partner for every adventure.
          </p>
        </div>
      </section>

    </div>
  );
}
