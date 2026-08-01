"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  ArrowLeftRight, 
  Search, 
  Wifi, 
  BatteryCharging, 
  Droplet, 
  Navigation, 
  Snowflake, 
  Leaf, 
  Sparkles, 
  Headphones, 
  ShieldCheck, 
  BadgePercent, 
  Star, 
  Globe, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Tag,
  Clock,
  Gift,
  Ticket
} from 'lucide-react';

interface BusSearchForm {
  from: string;
  to: string;
  date: string;
  busType: string;
}

const scrollRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BusPage() {
  const [searchForm, setSearchForm] = useState<BusSearchForm>({
    from: "New York, USA",
    to: "Boston, USA",
    date: "2026-07-30",
    busType: "AC Sleeper"
  });

  const [activeFilter, setActiveFilter] = useState<string>("AC Sleeper");
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
  const [activeOfferTab, setActiveOfferTab] = useState<'All' | 'Bus' | 'Train' | 'HOTEL' | 'Flight' | 'Cab'>("All");

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

  const allOfferCards = [
    {
      id: "b1",
      category: "Bus" as const,
      badgeLabel: "Bus",
      code: "FIRST",
      title: "Save up to Rs 250 on bus tickets",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#FEE2E2] via-[#FCE7F3] to-[#FFEDD5]",
      graphicType: "bus" as const
    },
    {
      id: "b2",
      category: "Bus" as const,
      badgeLabel: "Bus",
      code: "PRIMO200",
      title: "Save up to Rs 200 on Primo operators.",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#FEF08A] via-[#FACC15] to-[#EAB308]",
      graphicType: "primo" as const
    },
    {
      id: "b3",
      category: "Bus" as const,
      badgeLabel: "Bus",
      code: "BUS300",
      title: "Save up to Rs 300 on bus tickets",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#FEE2E2] via-[#FCE7F3] to-[#FFEDD5]",
      graphicType: "bus" as const
    },
    {
      id: "b4",
      category: "Bus" as const,
      badgeLabel: "Bus",
      code: "IDFC500",
      title: "Save up to Rs 500 on IDFC FIRST Bank Credit cards",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]",
      graphicType: "bank" as const
    },
    {
      id: "t1",
      category: "Train" as const,
      badgeLabel: "Train",
      code: "RAIL100",
      title: "Save up to Rs 100 on IRCTC train bookings",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#E0E7FF]",
      graphicType: "train" as const
    },
    {
      id: "t2",
      category: "Train" as const,
      badgeLabel: "Train",
      code: "SUPERFAST",
      title: "Zero service fee on Vande Bharat Express tickets",
      validity: "Valid till 15 Aug",
      bgClass: "bg-gradient-to-br from-[#FEF08A] via-[#FACC15] to-[#F59E0B]",
      graphicType: "train" as const
    },
    {
      id: "h1",
      category: "HOTEL" as const,
      badgeLabel: "Hotel",
      code: "HOTEL30",
      title: "Flat 30% Off on Luxury & Boutique Stays",
      validity: "Valid till 31 Aug",
      bgClass: "bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#FEF08A]",
      graphicType: "hotel" as const
    },
    {
      id: "h2",
      category: "HOTEL" as const,
      badgeLabel: "Hotel",
      code: "BANKHOTEL",
      title: "Up to Rs 1500 Instant Discount on HDFC Cards",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#FECDD3]",
      graphicType: "bank" as const
    },
    {
      id: "f1",
      category: "Flight" as const,
      badgeLabel: "Flight",
      code: "FLYHIGH",
      title: "Save up to Rs 2500 on International Flights",
      validity: "Valid till 31 Aug",
      bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#C7D2FE]",
      graphicType: "flight" as const
    },
    {
      id: "c1",
      category: "Cab" as const,
      badgeLabel: "Cab",
      code: "CAB50",
      title: "Save up to Rs 250 on Airport Taxi & Outstation Cabs",
      validity: "Valid till 31 Jul",
      bgClass: "bg-gradient-to-br from-[#FEF08A] via-[#FACC15] to-[#FED7AA]",
      graphicType: "cab" as const
    }
  ];

  const filteredOfferCards = activeOfferTab === 'All' 
    ? allOfferCards 
    : allOfferCards.filter(o => o.category === activeOfferTab);

  const countries = [
    { name: "United States", flag: "🇺🇸", routes: "3,400+", price: "$15", gradient: "from-blue-600/90 to-indigo-900/90", img: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=800&auto=format&fit=crop" },
    { name: "India", flag: "🇮🇳", routes: "12,800+", price: "₹299", gradient: "from-amber-600/90 to-orange-900/90", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop" },
    { name: "United Kingdom", flag: "🇬🇧", routes: "1,800+", price: "£12", gradient: "from-red-600/90 to-slate-900/90", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" },
    { name: "United Arab Emirates", flag: "🇦🇪", routes: "980+", price: "AED 25", gradient: "from-emerald-600/90 to-teal-900/90", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
    { name: "Thailand", flag: "🇹🇭", routes: "2,100+", price: "฿180", gradient: "from-purple-600/90 to-indigo-950/90", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop" },
  ];

  const busTypes = [
    {
      name: "Luxury Volvo / Scania",
      tag: "Premium",
      desc: "Business-class comfort with fully reclining leather seats and cabin-quiet rides.",
      features: ["Free Wi-Fi", "Leather Recliners", "Power Outlets", "Blankets"],
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    {
      name: "AC Sleeper",
      tag: "Overnight",
      desc: "Private berths for restful overnight journeys with fresh linen and reading lights.",
      features: ["Private Berths", "Fresh Linen", "Reading Light", "AC"],
      icon: <Snowflake className="w-5 h-5 text-blue-400" />,
      badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      name: "Electric Eco Express",
      tag: "Green",
      desc: "Zero-emission travel with whisper-quiet cabins and rapid-charging pit stops.",
      features: ["Zero Emissions", "Silent Ride", "Fast Charging", "Wi-Fi"],
      icon: <Leaf className="w-5 h-5 text-emerald-400" />,
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
      name: "Panoramic Tourist",
      tag: "Sightseeing",
      desc: "Glass-roof coaches with audio-guided commentary and generous legroom.",
      features: ["Glass Roof", "Audio Tour", "Extra Legroom", "Water Bottle"],
      icon: <Bus className="w-5 h-5 text-purple-400" />,
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
  ];

  const internationalBusCards = [
    {
      country: "United States 🇺🇸",
      title: "USA Intercity Bus Network",
      routes: "New York ⇄ Boston • LA ⇄ Las Vegas • NYC ⇄ DC",
      operators: "Greyhound • FlixBus USA • Megabus",
      features: ["Free Wi-Fi", "Power Outlets", "Leather Recliners"],
      price: "$15",
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
      badgeColor: "bg-blue-600",
      accentGradient: "from-blue-950/90 via-indigo-950/85 to-slate-950/90"
    },
    {
      country: "United Kingdom & Europe 🇬🇧 🇪🇺",
      title: "Euro Cross-Border Express",
      routes: "London ⇄ Paris • Amsterdam ⇄ Brussels • Berlin ⇄ Prague",
      operators: "National Express • FlixBus Europe • RegioJet",
      features: ["Luggage Included", "Quiet Cabin", "Reclining Seats"],
      price: "£12 / €15",
      img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
      badgeColor: "bg-red-600",
      accentGradient: "from-red-950/90 via-slate-900/85 to-slate-950/90"
    },
    {
      country: "United Arab Emirates 🇦🇪",
      title: "UAE Inter-Emirate Coach",
      routes: "Dubai ⇄ Abu Dhabi • Sharjah ⇄ Ras Al Khaimah",
      operators: "RTA Intercity • Dubai Express Coaches",
      features: ["Air Conditioned", "24/7 Departure", "Express Transit"],
      price: "AED 25",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
      badgeColor: "bg-emerald-600",
      accentGradient: "from-emerald-950/90 via-teal-950/85 to-slate-950/90"
    },
    {
      country: "Thailand & SE Asia 🇹🇭 🇻🇳",
      title: "SE Asia VIP Luxury Express",
      routes: "Bangkok ⇄ Phuket • Chiang Mai ⇄ Bangkok",
      operators: "Sombat Tour • GreenBus • Giant Ibis",
      features: ["VIP Sleeper Berths", "Free Snacks", "Personal TV"],
      price: "$10 / ฿290",
      img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop",
      badgeColor: "bg-purple-600",
      accentGradient: "from-purple-950/90 via-indigo-950/85 to-slate-950/90"
    }
  ];

  const offers = [
    {
      code: "FIRSTBUS25",
      title: "Flat 25% Off",
      desc: "On your very first bus ticket booking with Tour Help Desk.",
      tag: "First Booking",
      validity: "Valid till end of month",
      bgGradient: "from-blue-600 via-indigo-600 to-slate-900",
    },
    {
      code: "BUSPASS50",
      title: "Save up to $50",
      desc: "On inter-city Volvo, Scania & AC Sleeper luxury routes.",
      tag: "Inter-City Routes",
      validity: "Instant Discount",
      bgGradient: "from-amber-500 via-orange-600 to-slate-900",
    },
    {
      code: "GROUPBUS15",
      title: "15% Cashback",
      desc: "Instant cashback for group travel bookings of 4+ passengers.",
      tag: "Group Pass",
      validity: "All Countries",
      bgGradient: "from-emerald-600 via-teal-700 to-slate-900",
    },
    {
      code: "WEEKEND20",
      title: "Flat 20% Off",
      desc: "Special discount on Friday to Sunday weekend getaway bus trips.",
      tag: "Weekend Special",
      validity: "Fri - Sun Travel",
      bgGradient: "from-purple-600 via-indigo-700 to-slate-900",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Headphones className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "24/7 Dedicated Support",
      desc: "Instant help for trip disruptions, delays, or rescheduling — day or night."
    },
    {
      icon: <Navigation className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Live Bus GPS Tracking",
      desc: "Real-time GPS location sharing with your family and friends for complete peace of mind."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Zero Hidden Fees",
      desc: "Complete price transparency with all taxes, tolls, and reservation fees included upfront."
    },
    {
      icon: <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Verified 4.5★+ Operators",
      desc: "Only top-rated bus operators undergoing strict monthly safety and hygiene audits."
    },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO & SEARCH ENGINE SECTION */}
      <section className="relative bg-slate-900 pt-4 pb-4 sm:pt-12 sm:pb-8 md:pt-16 md:pb-10 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bus.jpg" 
            alt="Luxury Bus Highway" 
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75 sm:opacity-70 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/50 to-slate-950/90"></div>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 text-center"
        >
          {/* Badge */}
          <motion.div variants={scrollRevealVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Travel Further. Book Smarter.
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={scrollRevealVariants} className="text-xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Travel across the USA, Canada & beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">with trusted operators.</span>
          </motion.h1>
          <motion.p variants={scrollRevealVariants} className="mt-1.5 sm:mt-2 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium">
            Search over 100,000+ routes across top countries with our best-price guarantee & 24/7 helpline.
          </motion.p>

          {/* Multi-Field Search Card */}
          <motion.div variants={scrollRevealVariants} className="mt-4 sm:mt-6 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              
              {/* From */}
              <div className="md:col-span-3 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">From</label>
                  <input 
                    type="text" 
                    value={searchForm.from} 
                    onChange={(e) => setSearchForm({...searchForm, from: e.target.value})}
                    className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none truncate"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center py-0.5 sm:py-0">
                <button 
                  onClick={handleSwap}
                  type="button"
                  aria-label="Swap Locations"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all hover:rotate-180 duration-300 shadow-sm"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">To</label>
                  <input 
                    type="text" 
                    value={searchForm.to} 
                    onChange={(e) => setSearchForm({...searchForm, to: e.target.value})}
                    className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none truncate"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-2 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
                  <input 
                    type="date" 
                    value={searchForm.date} 
                    onChange={(e) => setSearchForm({...searchForm, date: e.target.value})}
                    className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-3">
                <button 
                  type="button"
                  className="w-full h-full min-h-[44px] md:min-h-[52px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  Search Buses
                </button>
              </div>

            </div>

            {/* Quick Filter Chips */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick Filters:</span>
              {["AC Sleeper", "Volvo Luxury", "Express Coach", "Inter-Country"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setSearchForm(prev => ({ ...prev, busType: filter }));
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. EXCLUSIVE OFFERS SECTION WITH CATEGORY TABS & SLIDER */}
      <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Exclusive Offers For Bus
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Find amazing bus offers before they're gone.
            </p>
          </div>

          {/* Left & Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleScrollLeft}
              type="button"
              aria-label="Previous Offers"
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-white" />
            </button>
            <button 
              onClick={handleScrollRight}
              type="button"
              aria-label="Next Offers"
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
            >
              <ArrowRight className="w-5 h-5 text-slate-800 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Category Tabs (Framer Motion Animated Pills) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {(['All', 'Bus', 'Train', 'HOTEL', 'Flight', 'Cab'] as const).map((tab) => (
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

        {/* Horizontal Sliding Offer Cards Container with Framer Motion */}
        <div 
          ref={offerSliderRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory pt-1 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredOfferCards.map((offer) => (
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
                {/* Background Silhouette Pattern */}
                <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="#E11D48">
                    <path d="M50 90 Q40 50 10 40 Q40 30 50 10 Q60 30 90 40 Q60 50 50 90 Z" />
                  </svg>
                </div>

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
                  {/* White Tag Pill with Golden #E8A11A Tag Icon */}
                  <motion.button 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopyCode(offer.code)}
                    className="bg-white shadow-md text-slate-900 rounded-full px-3.5 py-1.5 font-black text-xs border border-slate-100 flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#E8A11A] fill-[#E8A11A]/20" />
                    <span>{copiedCode === offer.code ? "COPIED" : offer.code}</span>
                  </motion.button>

                  {/* Graphic Illustration based on type */}
                  {offer.graphicType === "bus" && <RedBusGraphic />}
                  {offer.graphicType === "primo" && <PrimoOfferGraphic />}
                  {offer.graphicType === "train" && <TrainGraphic />}
                  {offer.graphicType === "hotel" && <HotelGraphic />}
                  {offer.graphicType === "flight" && <FlightGraphic />}
                  {offer.graphicType === "cab" && <CabGraphic />}
                  {offer.graphicType === "bank" && <BankBadgeGraphic />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
       {/* 3. INTERNATIONAL & USA BUS TRAVEL CARDS (RIGHT BELOW OFFER CARDS) */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60"
      >
        <motion.div variants={scrollRevealVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-2 border border-blue-200 dark:border-blue-800">
              International & USA Bus Travel
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Buses Outside India (USA, Europe & Global)
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-2xl">
              Book top-rated intercity buses across the USA, UK, Europe, UAE, and Southeast Asia at guaranteed lowest prices.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {internationalBusCards.map((card) => (
            <motion.div 
              key={card.country}
              variants={scrollRevealVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[340px]"
            >
              {/* Background Image with Dark Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={card.img} 
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${card.accentGradient}`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      {card.country}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow">
                      From {card.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-200/90 mb-3">
                    {card.routes}
                  </p>

                  <div className="text-[11px] font-medium text-slate-300 mb-3 bg-slate-900/60 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                    <span className="block font-bold text-white text-[10px] uppercase tracking-wider mb-1">Top Operators:</span>
                    {card.operators}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1">
                    {card.features.map(f => (
                      <span key={f} className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Book {card.country.split(' ')[0]} Bus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. BUS FLEET & COMFORT CLASS SELECTOR */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 md:py-24 bg-slate-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div variants={scrollRevealVariants} className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-3 border border-blue-500/30">
              Enjoy The Ride
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Choose Your Ride & Comfort Level
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base font-medium">
              From premium overnight sleepers to eco-friendly electric express coaches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {busTypes.map((type) => (
              <motion.div 
                key={type.name}
                variants={scrollRevealVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {type.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${type.badgeBg}`}>
                      {type.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{type.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{type.desc}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {type.features?.map(f => (
                      <span key={f} className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        {f}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-xs font-bold text-blue-400 hover:text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-1">
                    Explore Fleet Options <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>



      {/* 5. BOOKING GUARANTEES */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
      >
        <motion.div variants={scrollRevealVariants} className="p-6 md:p-8 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800">
          <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Tour Help Desk Booking Guarantees
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Free cancellation up to 12 hrs before departure.</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant refund processing to your original method.</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Verified digital m-ticket accepted everywhere.</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* 6. WHY BOOK WITH US */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 md:py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div variants={scrollRevealVariants} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Why Book Bus Tickets With Us?
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
              Trusted by millions of travelers worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <motion.div 
                key={item.title}
                variants={scrollRevealVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>



      {/* 8. REDBUS-STYLE PREMIUM SEO & TRAVEL INFORMATION SECTION */}
      <motion.section 
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-20 md:py-28 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Main Title & Hero Overview */}
          <motion.div variants={scrollRevealVariants} className="max-w-4xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-[#E8A11A] text-xs font-black uppercase tracking-widest mb-4 border border-[#E8A11A]/30">
              <Globe className="w-3.5 h-3.5" />
              Official Online Travel Guide
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-tight leading-tight text-slate-900 dark:text-white mb-4">
              The Smart Way to Book Bus Travel
            </h2>
            
            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              <p>
                <strong className="text-slate-900 dark:text-white font-black">TourHelpDesk</strong> makes bus travel simple, secure, and affordable. Whether you're planning a weekend getaway, a family vacation, or a business trip, you can compare routes, choose from trusted operators, and book your bus tickets in just a few clicks.
              </p>
              <p>
                With an extensive network of bus operators and routes across India, TourHelpDesk helps you find the best travel options at competitive prices. Enjoy a seamless booking experience, transparent fares, secure payments, and instant booking confirmations—all from one platform.
              </p>
            </div>
          </motion.div>


          {/* 1. WHY BOOK BUS TICKETS WITH TOURHELPDESK (Feature Cards Grid) */}
          <motion.div variants={scrollRevealVariants} className="mb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#E8A11A] mb-1 block">Key Benefits</span>
                <h2 className="text-2xl sm:text-[32px] md:text-[36px] font-black tracking-tight text-slate-900 dark:text-white">
                  Why Book Bus Tickets with TourHelpDesk?
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Bus className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                  title: "Wide Network of Bus Operators", 
                  desc: "Choose from a large selection of trusted bus partners offering AC, Non-AC, Sleeper, Seater, Volvo, Luxury, and Premium coaches across popular destinations." 
                },
                { 
                  icon: <BadgePercent className="w-6 h-6 text-amber-500" />,
                  title: "Best Price Guarantee", 
                  desc: "Compare fares from multiple operators and book the most affordable ticket without compromising on comfort or quality." 
                },
                { 
                  icon: <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
                  title: "Exclusive Travel Offers", 
                  desc: "Enjoy seasonal discounts, special promo codes, cashback offers, and limited-time deals to save more on every journey." 
                },
                { 
                  icon: <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
                  title: "Instant Booking Confirmation", 
                  desc: "Receive your e-ticket immediately via email and SMS after successful payment." 
                },
                { 
                  icon: <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
                  title: "Safe & Secure Payments", 
                  desc: "Book confidently using trusted payment methods, including UPI, Credit Cards, Debit Cards, Net Banking, and Digital Wallets." 
                },
                { 
                  icon: <Navigation className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
                  title: "Live Bus Tracking", 
                  desc: "Track your bus in real time and stay updated with arrival and departure information for a stress-free journey." 
                },
                { 
                  icon: <Ticket className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
                  title: "Easy Ticket Management", 
                  desc: "View your bookings, download tickets, and manage your travel details from a single dashboard." 
                },
                { 
                  icon: <Headphones className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                  title: "24×7 Customer Support", 
                  desc: "Our dedicated support team is available around the clock to assist with bookings, cancellations, refunds, and travel-related queries." 
                },
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={scrollRevealVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center mb-5 shadow-xs">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-[20px] font-black text-slate-900 dark:text-white mb-2 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>


          {/* 2. HOW TO BOOK BUS TICKETS (To-The-Point Clean Steps Section) */}
          <motion.div variants={scrollRevealVariants} className="mb-20">
            <div className="mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E8A11A] mb-1 block">Simple Process</span>
              <h2 className="text-2xl sm:text-[32px] md:text-[36px] font-black tracking-tight text-slate-900 dark:text-white mb-2">
                How to Book Bus Tickets on TourHelpDesk
              </h2>
              <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 font-medium">
                Booking your bus ticket is quick and hassle-free.
              </p>
            </div>

            <div className="space-y-3.5 max-w-4xl">
              {[
                { step: "Step 1", text: "Enter your departure city, destination, and travel date." },
                { step: "Step 2", text: "Browse available buses and compare timings, prices, ratings, and amenities." },
                { step: "Step 3", text: "Select your preferred bus and choose your seat." },
                { step: "Step 4", text: "Enter passenger details and review your booking." },
                { step: "Step 5", text: "Complete your payment using your preferred payment method." },
                { step: "Step 6", text: "Receive instant confirmation along with your e-ticket via email and SMS." },
              ].map((s) => (
                <div 
                  key={s.step}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-[#E8A11A]/50 shadow-xs"
                >
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#E8A11A] text-slate-950 font-black text-xs shrink-0 shadow-xs uppercase tracking-wider">
                    {s.step}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>


          {/* 3. TRAVEL SMARTER & EXCLUSIVE OFFERS CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            
            {/* Travel Smarter with TourHelpDesk */}
            <motion.div 
              variants={scrollRevealVariants}
              whileHover={{ y: -4 }}
              className="p-8 sm:p-10 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">Seamless Journeys</span>
                <h2 className="text-2xl sm:text-[32px] font-black tracking-tight text-slate-900 dark:text-white mb-4">
                  Travel Smarter with TourHelpDesk
                </h2>
                <p className="text-base sm:text-[17px] leading-[1.8] text-slate-600 dark:text-slate-300 font-medium mb-6">
                  Whether you're traveling for work, holidays, family visits, or spontaneous weekend trips, TourHelpDesk helps you discover reliable buses at the best prices. Our goal is to make every journey convenient, affordable, and comfortable with an easy-to-use booking experience and dependable customer support.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-600/10 dark:bg-blue-900/30 border border-blue-500/20 text-sm font-extrabold text-blue-700 dark:text-blue-300">
                Book your next bus journey with confidence and experience a smarter way to travel across India.
              </div>
            </motion.div>

            {/* Exclusive Bus Booking Offers (Responsive Chips & Cards) */}
            <motion.div 
              variants={scrollRevealVariants}
              whileHover={{ y: -4 }}
              className="p-8 sm:p-10 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#E8A11A] mb-2 block">Maximum Savings</span>
                <h2 className="text-2xl sm:text-[32px] font-black tracking-tight text-slate-900 dark:text-white mb-2">
                  Exclusive Bus Booking Offers
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6">
                  Save more every time you travel with our regularly updated promotions and special discounts.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Seasonal Sale Offers",
                    "Early Bird Discounts",
                    "Weekend Travel Deals",
                    "Festival Special Savings",
                    "Group Booking Benefits",
                    "Student & Senior Citizen Offers",
                    "Cashback on Selected Payments",
                    "Limited-Time Promo Codes"
                  ].map((item) => (
                    <motion.div 
                      key={item} 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
                    >
                      <Tag className="w-4 h-4 text-[#E8A11A] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-6 italic">
                Check the latest offers before completing your booking and enjoy maximum savings on your next trip.
              </p>
            </motion.div>

          </div>




        </div>
      </motion.section>

    </div>
  );
}

/* Graphic Illustrations matching RedBus reference design */
function RedBusGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        {/* Bus Body */}
        <path d="M12 22 C12 14, 22 10, 38 10 L102 10 C110 10, 115 14, 115 22 L115 48 C115 54, 110 57, 100 57 L18 57 C12 57, 12 52, 12 48 Z" fill="#EF4444" />
        {/* Front Windshield */}
        <path d="M14 20 C14 15, 20 12, 30 12 L34 12 L34 30 L14 30 Z" fill="#93C5FD" opacity="0.9" />
        {/* Side Windows */}
        <path d="M38 13 L52 13 L52 26 L38 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M55 13 L69 13 L69 26 L55 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M72 13 L86 13 L86 26 L72 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M89 13 L103 13 L103 26 L89 26 Z" fill="#1E3A8A" opacity="0.75" />
        {/* Headlight */}
        <circle cx="18" cy="42" r="3" fill="#FEF08A" />
        {/* Wheels */}
        <circle cx="34" cy="57" r="7" fill="#0F172A" />
        <circle cx="34" cy="57" r="3.5" fill="#94A3B8" />
        <circle cx="88" cy="57" r="7" fill="#0F172A" />
        <circle cx="88" cy="57" r="3.5" fill="#94A3B8" />
      </svg>
    </div>
  );
}

function PrimoOfferGraphic() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-amber-300 flex flex-col items-center justify-center text-center w-24 h-14">
        <span className="text-[10px] font-black text-indigo-950 uppercase tracking-tighter leading-none">Primo</span>
        <span className="text-xs font-black text-blue-600 uppercase tracking-tight leading-none mt-0.5">Monsoon</span>
        <span className="text-[8px] font-extrabold text-amber-600 uppercase tracking-widest leading-none mt-0.5">Offer</span>
      </div>
    </div>
  );
}

function BankBadgeGraphic() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="bg-white rounded-xl p-1.5 shadow-md border border-rose-200 flex items-center gap-1.5 w-24 h-12">
        <div className="w-5 h-5 rounded bg-red-700 text-white flex items-center justify-center font-black text-[9px]">
          IDFC
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-black text-slate-900">IDFC FIRST</span>
          <span className="text-[7px] font-bold text-slate-500 uppercase mt-0.5">Bank Card</span>
        </div>
      </div>
    </div>
  );
}

function TrainGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M10 25 C10 18, 20 12, 40 12 L105 12 C112 12, 115 18, 115 25 L115 48 C115 54, 110 56, 100 56 L10 56 Z" fill="#2563EB" />
        <path d="M12 24 L35 24 L35 34 L12 34 Z" fill="#93C5FD" opacity="0.9" />
        <path d="M42 16 L60 16 L60 30 L42 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M65 16 L83 16 L83 30 L65 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M88 16 L106 16 L106 30 L88 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M10 40 L115 40 L115 44 L10 44 Z" fill="#F59E0B" />
        <circle cx="28" cy="56" r="6" fill="#0F172A" />
        <circle cx="68" cy="56" r="6" fill="#0F172A" />
        <circle cx="98" cy="56" r="6" fill="#0F172A" />
      </svg>
    </div>
  );
}

function HotelGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-emerald-300 flex flex-col items-center justify-center text-center w-24 h-14">
        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter leading-none">Hotel & Stay</span>
        <span className="text-xs font-black text-emerald-600 uppercase tracking-tight leading-none mt-0.5">30% OFF</span>
        <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Luxury Stay</span>
      </div>
    </div>
  );
}

function FlightGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M15 35 Q40 25 70 30 L105 15 L108 22 L80 37 L110 40 L108 45 L72 42 L45 58 L38 56 L50 40 L15 35 Z" fill="#4F46E5" />
        <path d="M75 28 L95 18 L96 23 L80 34 Z" fill="#818CF8" />
        <circle cx="35" cy="34" r="2" fill="#FFFFFF" />
        <circle cx="45" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="55" cy="36" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

function CabGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M20 32 L35 18 C38 15, 45 14, 60 14 L80 14 C90 14, 95 18, 100 24 L108 34 L112 36 C115 38, 115 44, 110 48 L15 48 C10 48, 10 42, 12 36 Z" fill="#EAB308" />
        <path d="M38 18 L55 18 L55 30 L28 30 Z" fill="#1E293B" opacity="0.85" />
        <path d="M60 18 L78 18 L88 30 L60 30 Z" fill="#1E293B" opacity="0.85" />
        <rect x="52" y="9" width="16" height="5" rx="1.5" fill="#0F172A" />
        <circle cx="32" cy="48" r="7" fill="#0F172A" />
        <circle cx="32" cy="48" r="3.5" fill="#94A3B8" />
        <circle cx="88" cy="48" r="7" fill="#0F172A" />
        <circle cx="88" cy="48" r="3.5" fill="#94A3B8" />
      </svg>
    </div>
  );
}
