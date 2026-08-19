"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TopHotels from './TopHotels';
import HotelAutocomplete from './HotelAutocomplete';
import HotelDetailsModal from './HotelDetailsModal';
import HotelBookingModal from './HotelBookingModal';
import Accordion from './ui/Accordion';
import { HotelCard, RecommendedHotel } from './ui/HotelCard';
import { hotelService, HotelSearchParams, HotelDetailInfo } from '../services/hotelService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  Search,
  Users,
  ChevronDown,
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  HelpCircle,
  Tag,
  Gift
} from 'lucide-react';

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const DESTINATIONS = [
  { name: 'Abu Dhabi', image: '/Images/Hotels/Abu Dhabi.webp' },
  { name: 'Bali', image: '/Images/Hotels/Bali.webp' },
  { name: 'Maldives', image: '/Images/Hotels/Maldives.webp' },
  { name: 'Singapore', image: '/Images/Hotels/Singapore.webp' },
  { name: 'Venice', image: '/Images/Hotels/Venice.webp' },
  { name: 'Zurich', image: '/Images/Hotels/Zurich.webp' },
  { name: 'Istanbul', image: '/Images/Hotels/Istanbul.webp' },
  { name: 'Cairo', image: '/Images/Hotels/Cairo.webp' }
];

const EXPERIENCE_CARDS = [
  {
    id: '1',
    title: 'CELEBRATE IN PARADISE',
    subtitle: 'Lounge under a colorful cabana or bungalow at one of our two heated outdoor pools—including an adult only pool.',
    image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    id: '2',
    title: 'LUXURY BEACHFRONT BUNGALOWS',
    subtitle: 'Wake up to ocean breeze & direct turquoise water access with private butler service & sun deck loungers.',
    image: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    id: '3',
    title: 'WORLD-CLASS WELLNESS RESORTS',
    subtitle: 'Rejuvenate mind and body with holistic hydrotherapy spas, oceanfront yoga & serene executive suites.',
    image: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    id: '4',
    title: 'ROYAL PALM SANCTUARIES',
    subtitle: 'Discover opulent architecture, private lagoons, Michelin-starred dining & top-tier luxury hospitality.',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1920',
  }
];

const RECOMMENDED_HOTELS: RecommendedHotel[] = [
  {
    id: "rec-1",
    name: "Deluxe King Room",
    subtitle: "This room offers comfortable space with one king bed, a work desk and modern amenities.",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    price: 249,
    originalPrice: 320,
    tag: "Luxury Stay"
  },
  {
    id: "rec-2",
    name: "Standard King (with sofa bed)",
    subtitle: "This room offers 30 square metres of space with one king bed, sofa and a cozy corner.",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    price: 189,
    originalPrice: 245,
    tag: "Popular"
  },
  {
    id: "rec-3",
    name: "Premium King Room",
    subtitle: "Spacious accommodation with a king-size bed, elegant interiors and premium facilities.",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    price: 175,
    originalPrice: 230,
    tag: "Best Value"
  },
  {
    id: "rec-4",
    name: "Executive Room",
    subtitle: "Relax in a stylish room featuring a king bed, work area and beautiful modern interiors.",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    rating: 4.95,
    price: 299,
    originalPrice: 390,
    tag: "5 Star"
  },
  {
    id: "rec-5",
    name: "Overwater Sunset Suite",
    subtitle: "Private lagoon villa with glass floor view, infinity dip pool and open ocean sun deck.",
    location: "Male, Maldives",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=800&auto=format&fit=crop",
    rating: 5.0,
    price: 340,
    originalPrice: 450,
    tag: "Top Rated"
  },
  {
    id: "rec-6",
    name: "Central Park Suite",
    subtitle: "Classic Manhattan luxury room with floor-to-ceiling city views and marble bath.",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop",
    rating: 4.85,
    price: 260,
    originalPrice: 340,
    tag: "City Center"
  },
  {
    id: "rec-7",
    name: "Alpine Chalet Room",
    subtitle: "Cozy mountain view room featuring timber fireplace, heated floors and private balcony.",
    location: "Zurich, Switzerland",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    price: 220,
    originalPrice: 290,
    tag: "Scenic View"
  },
  {
    id: "rec-8",
    name: "Caldera Sunset Villa",
    subtitle: "Whitewashed Aegean suite carved into volcanic cliff with private plunge pool.",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
    rating: 4.92,
    price: 210,
    originalPrice: 275,
    tag: "Honeymoon"
  }
];

const HOTEL_FAQS = [
  {
    num: 1,
    question: 'How do I book a hotel online?',
    answer: 'Booking a hotel is simple. Search for your destination, select your check-in and check-out dates, compare available hotels, choose your preferred room, and complete the secure online payment process. Your booking confirmation will be sent instantly via email.'
  },
  {
    num: 2,
    question: 'Can I cancel or modify my hotel reservation?',
    answer: 'Yes. Many hotels offer flexible cancellation and modification options. However, policies vary by property and room type. Please review the cancellation terms before confirming your booking.'
  },
  {
    num: 3,
    question: 'Will I receive instant booking confirmation?',
    answer: 'Yes. Once your payment is successfully processed, you will receive an instant booking confirmation along with your reservation details and e-voucher.'
  },
  {
    num: 4,
    question: 'Are hotel prices shown per room or per person?',
    answer: 'Most hotel prices are displayed per room, per night. The total amount may vary depending on the number of guests, selected room type, taxes, and additional services.'
  },
  {
    num: 5,
    question: 'Are taxes and service charges included in the price?',
    answer: 'Most displayed prices include applicable taxes and mandatory fees. Some destinations may require local tourism or city taxes to be paid directly at the property.'
  },
  {
    num: 6,
    question: 'Can I book hotels for someone else?',
    answer: 'Yes. You can make a reservation for another person by entering the guest\'s name during the booking process.'
  },
  {
    num: 7,
    question: 'What payment methods are accepted?',
    answer: 'We support multiple secure payment options including credit cards, debit cards, digital wallets, online banking, and other locally available payment methods.'
  },
  {
    num: 8,
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use industry-standard encryption and secure payment technology to protect your personal and financial information.'
  },
  {
    num: 9,
    question: 'Can I book without a credit card?',
    answer: 'Some hotels allow bookings without a credit card or offer pay-at-property options. Availability depends on the hotel\'s booking policy.'
  },
  {
    num: 10,
    question: 'How do I know if my booking is confirmed?',
    answer: 'After completing your reservation, you\'ll receive a confirmation email containing your booking reference number, hotel details, and check-in instructions.'
  }
];

const HotelsPage: React.FC = () => {
  const experienceScrollRef = React.useRef<HTMLDivElement>(null);
  
  // Search Form State
  const [destination, setDestination] = useState('New Delhi');
  const [selectedCityId, setSelectedCityId] = useState('227760');
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [checkInDate, setCheckInDate] = useState('2026-08-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-18');
  const [stayType, setStayType] = useState<'all' | 'hotels' | 'resorts' | 'villas'>('all');
  const [starRating, setStarRating] = useState('any');
  
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [childAges, setChildAges] = useState<number[]>([]);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Live API State
  const [hotels, setHotels] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modal State
  const [selectedHotelKeys, setSelectedHotelKeys] = useState<{ hotelKey: string; searchKey: string } | null>(null);
  const [bookingModalData, setBookingModalData] = useState<{ room: any; hotel: HotelDetailInfo } | null>(null);

  const scrollExperience = (direction: 'left' | 'right') => {
    if (experienceScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      experienceScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleChildrenChange = (newCount: number) => {
    setGuests(p => ({ ...p, children: newCount }));
    if (newCount > childAges.length) {
      const added = Array(newCount - childAges.length).fill(5);
      setChildAges(prev => [...prev, ...added]);
    } else {
      setChildAges(prev => prev.slice(0, newCount));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const updated = [...childAges];
    updated[index] = age;
    setChildAges(updated);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation Rules
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setValidationError('Check-out date must be strictly after Check-in date.');
      return;
    }
    if (guests.adults < 1) {
      setValidationError('At least 1 adult is required.');
      return;
    }
    setValidationError('');
    setIsLoading(true);
    setHasSearched(true);

    const params: HotelSearchParams = {
      destinationName: destination,
      cityId: selectedCityId,
      countryCode: selectedCountryCode,
      checkInDate,
      checkOutDate,
      adults: guests.adults,
      children: guests.children,
      childAges,
      rooms: guests.rooms,
      starRating
    };

    const res = await hotelService.searchHotels(params);
    if (res && res.success && res.hotels) {
      setHotels(res.hotels);
      if (res.searchKey) setSearchKey(res.searchKey);
    } else {
      setHotels([]);
    }
    setIsLoading(false);
  };

  // Auto-scroll listener for sticky header
  useEffect(() => {
    const onScroll = () => setShowStickySearch(window.scrollY > 250);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300">

      {/* 1. STICKY SEARCH BAR (PINNED WHEN SCROLLED) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 border-b border-slate-200 dark:border-slate-800 shadow-xl ${
          showStickySearch ? 'py-2.5 sm:py-3 opacity-100 translate-y-0 pointer-events-auto' : 'py-0 opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lg">
            <div className="flex-grow min-w-0">
              <HotelAutocomplete
                value={destination}
                onSelect={(dest) => {
                  setDestination(dest.name);
                  setSelectedCityId(dest.cityId);
                  setSelectedCountryCode(dest.countryCode);
                }}
              />
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block shrink-0"></div>
            <input 
              type="date" 
              value={checkInDate} 
              onChange={(e) => setCheckInDate(e.target.value)} 
              className="px-3 py-2 bg-transparent outline-none font-bold text-xs sm:text-sm text-slate-800 dark:text-white" 
            />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block shrink-0"></div>
            <input 
              type="date" 
              value={checkOutDate} 
              onChange={(e) => setCheckOutDate(e.target.value)} 
              className="px-3 py-2 bg-transparent outline-none font-bold text-xs sm:text-sm text-slate-800 dark:text-white" 
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-2 bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md shadow-[#E8A11A]/30 cursor-pointer"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO & HOTEL SEARCH ENGINE SECTION */}
      <section className="relative bg-slate-950 pt-18 pb-16 sm:pt-24 sm:pb-32 md:pt-28 md:pb-36 min-h-[420px] sm:min-h-[520px] md:min-h-[580px] flex flex-col justify-center border-b-0">
        {/* Background Overlay Image - Full HD Real Visibility */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero hotel/hero2.webp"
            alt="Hotel Hero Background"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center opacity-100 transition-all duration-700"
          />
          {/* Faint, minimal gradient for text contrast without hiding real HD image background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40"></div>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 text-center w-full"
        >
          {/* Heading */}
          <motion.h1 variants={scrollRevealVariants} className="text-lg sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug max-w-4xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            Book Hotels Worldwide <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">with Exclusive Direct Rates</span>
          </motion.h1>
          <motion.p variants={scrollRevealVariants} className="mt-1.5 text-xs sm:text-base text-white/95 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Search over 100,000+ luxury stays, boutique hotels & resorts with zero hidden booking fees.
          </motion.p>

          {/* SEARCH FORM CARD */}
          <motion.div variants={scrollRevealVariants} className="mt-3.5 sm:mt-6 w-full max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.35)] border border-white/60 dark:border-slate-800 text-left box-border">
            <form onSubmit={handleSearch}>

              {/* TOP CONTROLS: Property Type, Guest Counter, Star Rating */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto scrollbar-hide shrink-0 max-w-full">
                  {(['all', 'hotels', 'resorts', 'villas'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setStayType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold capitalize whitespace-nowrap transition-all ${
                        stayType === type
                          ? "bg-[#E8A11A] text-slate-950 shadow-md shadow-[#E8A11A]/30 font-black"
                          : "text-slate-600 dark:text-slate-300 hover:text-[#E8A11A] dark:hover:text-white"
                      }`}
                    >
                      {type === 'all' ? 'All Stays' : type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                  {/* Guest Counter Popup */}
                  <div className="relative flex-1 sm:flex-initial min-w-0">
                    <button
                      type="button"
                      onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                      className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:border-[#E8A11A] transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-[#E8A11A] shrink-0" />
                        <span className="truncate">{guests.adults + guests.children} Guest{(guests.adults + guests.children) > 1 ? 's' : ''}, {guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    {showGuestDropdown && (
                      <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-3rem)] sm:w-72 max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-2xl z-50 text-left">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Adults</p>
                            <p className="text-[10px] text-slate-400">Ages 18+</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >-</button>
                            <span className="text-xs font-extrabold w-4 text-center">{guests.adults}</span>
                            <button
                              type="button"
                              onClick={() => setGuests(p => ({ ...p, adults: Math.min(10, p.adults + 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Children</p>
                            <p className="text-[10px] text-slate-400">Ages 0-17</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleChildrenChange(Math.max(0, guests.children - 1))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >-</button>
                            <span className="text-xs font-extrabold w-4 text-center">{guests.children}</span>
                            <button
                              type="button"
                              onClick={() => handleChildrenChange(Math.min(6, guests.children + 1))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >+</button>
                          </div>
                        </div>

                        {/* Child Age Selectors */}
                        {guests.children > 0 && (
                          <div className="mb-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Child Ages</p>
                            <div className="grid grid-cols-2 gap-2">
                              {childAges.map((age, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className="text-[10px] font-semibold text-slate-500">Child {idx + 1}:</span>
                                  <select
                                    value={age}
                                    onChange={(e) => handleChildAgeChange(idx, parseInt(e.target.value))}
                                    className="bg-slate-50 dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                                  >
                                    {[...Array(18)].map((_, a) => (
                                      <option key={a} value={a}>{a} yrs</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Rooms</p>
                            <p className="text-[10px] text-slate-400">Total rooms</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGuests(p => ({ ...p, rooms: Math.max(1, p.rooms - 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >-</button>
                            <span className="text-xs font-extrabold w-4 text-center">{guests.rooms}</span>
                            <button
                              type="button"
                              onClick={() => setGuests(p => ({ ...p, rooms: Math.min(5, p.rooms + 1) }))}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                            >+</button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowGuestDropdown(false)}
                          className="w-full py-1.5 rounded-xl bg-[#E8A11A] text-slate-950 font-black text-xs uppercase"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>

                  <select
                    value={starRating}
                    onChange={(e) => setStarRating(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 outline-none shrink-0"
                  >
                    <option value="any">Any Rating</option>
                    <option value="5">5 Star Luxury</option>
                    <option value="4">4 Star & Above</option>
                    <option value="3">3 Star & Above</option>
                  </select>
                </div>
              </div>

              {/* SEARCH FIELDS GRID - 1 COL ON MOBILE, RESPONSIVE GRID ON TABLET/DESKTOP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 sm:gap-3 items-center w-full">
                {/* Destination Autocomplete */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full min-w-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8A11A] shrink-0" />
                  <div className="w-full min-w-0">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Destination / Hotel</label>
                    <HotelAutocomplete
                      value={destination}
                      onSelect={(dest) => {
                        setDestination(dest.name);
                        setSelectedCityId(dest.cityId);
                        setSelectedCountryCode(dest.countryCode);
                      }}
                    />
                  </div>
                </div>

                {/* Check-In */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full min-w-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8A11A] shrink-0" />
                  <div className="w-full min-w-0">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider truncate">Check-In</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer p-0"
                    />
                  </div>
                </div>

                {/* Check-Out */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full min-w-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8A11A] shrink-0" />
                  <div className="w-full min-w-0">
                    <label className="block text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider truncate">Check-Out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer p-0"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-span-1 sm:col-span-2 md:col-span-2 w-full">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 sm:py-3 bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#E8A11A]/25 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {validationError && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs font-bold">
                  {validationError}
                </div>
              )}

            </form>
          </motion.div>          {/* FEATURED CAROUSEL - HIDDEN ON MOBILE, VISIBLE ON TABLET & DESKTOP */}
          <motion.div variants={scrollRevealVariants} className="hidden sm:block mt-8 sm:mt-12 md:mt-16 relative z-20 -mb-24 sm:-mb-32 md:-mb-40 max-w-[1300px] mx-auto text-left px-2 sm:px-4">
            {/* Floating Right Arrow Navigation Button on Peek Card */}
            <button
              type="button"
              onClick={() => scrollExperience('right')}
              className="absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#4A5D32]/85 hover:bg-[#4A5D32] text-white shadow-2xl backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer border border-white/30"
              aria-label="Scroll Carousel Right"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
            </button>

            {/* Horizontal Carousel Track */}
            <div
              ref={experienceScrollRef}
              className="flex gap-3 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-hide snap-x py-2 px-1 w-full max-w-full"
            >
              {EXPERIENCE_CARDS.map((item) => (
                <div
                  key={item.id}
                  className="sm:min-w-[580px] md:min-w-[680px] lg:min-w-[760px] shrink-0 bg-white rounded-none shadow-[0_16px_48px_rgba(0,0,0,0.5)] snap-start overflow-hidden border border-slate-200/80 flex flex-col justify-between"
                >
                  <div className="relative h-44 sm:h-52 md:h-56 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={item.id === '1'}
                      sizes="760px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="p-4 sm:p-5 bg-white flex items-end justify-between gap-5 text-slate-900">
                    <div className="max-w-xl">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSearch()}
                      className="w-28 sm:w-32 h-9 sm:h-10 bg-[#47A2F5] hover:bg-[#3492e8] rounded-md shadow-md shrink-0 transition-all cursor-pointer active:scale-95"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* VALUE PROPOSITIONS BAR BELOW HERO */}
      <section className="w-full bg-white dark:bg-slate-950 py-8 sm:pt-32 md:pt-44 sm:pb-10 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            
            {/* Feature 1: Special Offers */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/80 dark:border-amber-800/50 shadow-sm mt-0.5">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Special Offers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-1.5">
                  Unlock exclusive discounts and member savings when booking hotel stays with us.
                </p>
              </div>
            </div>

            {/* Feature 2: Flexible & Reliable Booking */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/80 dark:border-teal-800/50 shadow-sm mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Guaranteed Hotel Booking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-1.5">
                  Enjoy flexible cancellation options on selected stays and 100% verified booking confirmations.
                </p>
              </div>
            </div>

            {/* Feature 3: Earn Rewards */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/80 dark:border-indigo-800/50 shadow-sm mt-0.5">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Earn Rewards On Vacation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-1.5">
                  Get reward points on eligible bookings that can be redeemed for extra savings on future trips.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RECOMMENDED HOTELS FOR YOU SECTION */}
      <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Recommended Hotels for You
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Handpicked luxury stays & boutique resorts worldwide at exclusive direct rates.
            </p>
          </div>
        </div>

        {/* Desktop View: Clean 4-Column Grid (4 Cards Per Row) */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECOMMENDED_HOTELS.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onBookNow={(h) => {
                setDestination(h.location.split(',')[0]);
                handleSearch();
              }}
            />
          ))}
        </div>

        {/* Mobile View: Horizontal Swipeable Slider Carousel */}
        <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 px-1 w-full max-w-full">
          {RECOMMENDED_HOTELS.map((hotel) => (
            <div key={hotel.id} className="w-[85vw] min-w-[280px] shrink-0 snap-start">
              <HotelCard
                hotel={hotel}
                onBookNow={(h) => {
                  setDestination(h.location.split(',')[0]);
                  handleSearch();
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC HOTEL SEARCH RESULTS SECTION (Shown only after search) */}
      {hasSearched && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Stays in {destination}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Live availability from Flyshop B2B Hotel API
              </p>
            </div>
          </div>

          {/* LOADING SKELETONS - SQUARE SEARCHING CARDS */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="aspect-square bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group"
                >
                  {/* Background Shimmer Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-indigo-500/10 to-amber-500/5 dark:from-blue-500/10 dark:to-purple-500/10 opacity-70 animate-pulse" />
                  
                  {/* Searching Text */}
                  <h4 className="relative z-10 text-sm sm:text-base font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">
                    Searching Hotels & Stays...
                  </h4>
                  <p className="relative z-10 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-6">
                    Fetching live rates & availability
                  </p>

                  {/* Hotel Icon with Black & White to Full-Color Animated Effect */}
                  <div className="relative z-10 w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 animate-ping opacity-20"></div>
                    <div className="relative p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
                      <Building2 className="w-10 h-10 text-slate-900 dark:text-white transition-all duration-1000 animate-pulse drop-shadow-md" />
                      <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-spin" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>

                      {hotel.freeCancellation && (
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                          Free Cancellation
                        </span>
                      )}

                      <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-amber-500 flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{hotel.rating}</span>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {hotel.name}
                      </h3>

                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                      </p>

                      {/* Top 3 Amenities */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hotel.amenities.slice(0, 3).map((amenity: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Price & View Details Button */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting from</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{hotel.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold"> / night</span>
                    </div>

                    <button
                      onClick={() => setSelectedHotelKeys({ hotelKey: hotel.hotelKey, searchKey: hotel.searchKey || searchKey })}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">No Stays Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try modifying your dates, room count or search destination.</p>
            </div>
          )}
        </section>
      )}

      {/* 4. TOP HOTELS SECTION */}
      <TopHotels />

      {/* 5. INFORMATIONAL SEO CONTENT SECTION */}
      <section className="bg-slate-50/70 dark:bg-slate-900/40 py-12 md:py-16 border-t border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 dark:text-slate-300">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Find the Perfect Hotel for Every Journey
            </h2>
            <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-600 dark:text-slate-300">
              Whether you're planning a relaxing holiday, an important business trip, a family vacation, or a spontaneous weekend escape, choosing the right accommodation plays a vital role in creating an unforgettable travel experience. Our hotel booking platform is designed to help travelers discover exceptional stays across the globe while offering competitive prices, secure reservations, and a seamless booking process.
            </p>
            <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-600 dark:text-slate-300">
              With access to an extensive collection of hotels, luxury resorts, boutique properties, serviced apartments, villas, vacation rentals, and budget-friendly accommodations, finding your ideal stay has never been easier. From vibrant city centers and pristine beaches to mountain retreats and cultural landmarks, we connect travelers with accommodations that suit every destination, budget, and travel style.
            </p>
            <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-600 dark:text-slate-300">
              Our advanced search technology enables you to compare thousands of hotel options in just a few moments. Easily filter results by price, star rating, guest reviews, amenities, location, property type, or popular landmarks to discover accommodations tailored specifically to your preferences. Whether you're looking for a luxury five-star resort with world-class facilities or a comfortable budget hotel that offers exceptional value, you'll find options that meet your expectations.
            </p>
            <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-600 dark:text-slate-300">
              Every property listing provides detailed descriptions, high-quality photographs, room information, available facilities, nearby attractions, and verified guest reviews, helping you make informed decisions before confirming your reservation. Our goal is to provide complete transparency so you can book with confidence and enjoy a worry-free travel experience.
            </p>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Grid Layout for Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Why Travelers Choose Our Hotel Booking Platform
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Travelers deserve more than just a place to stay—they deserve confidence, convenience, and exceptional value. That's why we've built a hotel booking experience focused on reliability, flexibility, and customer satisfaction.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Our platform offers competitive pricing across thousands of destinations worldwide, ensuring you receive excellent value for every booking. Through partnerships with trusted hotels and accommodation providers, we help travelers access exclusive offers, seasonal promotions, and special discounts throughout the year.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Booking is fast, secure, and simple. Our encrypted payment system protects your personal and financial information while providing multiple payment options for travelers around the world. Once your reservation is confirmed, you'll receive instant booking confirmation along with all the details you need for a smooth check-in experience.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Customer satisfaction remains at the heart of everything we do. Whether you need assistance before your trip, during your stay, or after your journey, our dedicated customer support team is available to help resolve questions and provide guidance whenever needed.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Accommodation for Every Travel Style
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Every traveler has different needs, and every journey deserves the perfect place to stay. Our carefully curated collection includes accommodations suitable for every occasion and every budget.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Choose from luxury hotels featuring premium amenities such as infinity pools, award-winning restaurants, private beaches, and spa facilities. Discover charming boutique hotels that provide personalized hospitality and unique local experiences. Book family-friendly resorts with spacious rooms and entertainment for children, or select modern serviced apartments ideal for extended business trips.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Budget-conscious travelers can explore affordable hotels, hostels, guest houses, and vacation rentals that combine comfort with exceptional value. No matter where you're traveling, you'll find accommodations that match both your expectations and your budget.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Discover Hotels in the World's Most Popular Destinations
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Explore exceptional accommodations across some of the world's most visited cities and holiday destinations. Whether you're experiencing the iconic skyline of New York, enjoying the romantic streets of Paris, relaxing on the beaches of Bali, discovering Dubai's luxury lifestyle, exploring the vibrant culture of Tokyo, or planning a business trip to Singapore, our platform helps you find the perfect hotel in every destination.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                From bustling metropolitan centers to peaceful coastal retreats and scenic mountain escapes, our global hotel network continues to expand, offering travelers access to quality accommodations in hundreds of countries and thousands of cities worldwide.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Book With Confidence
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Planning a trip should be exciting—not stressful. That's why we prioritize transparency throughout the booking process. Every hotel listing includes comprehensive information about room types, cancellation policies, available amenities, nearby attractions, check-in procedures, guest ratings, and pricing details.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Our secure booking system is designed to provide peace of mind from the moment you search until you complete your stay. With verified accommodation partners, trusted payment processing, and responsive customer support, travelers can book with confidence knowing they're choosing a reliable travel platform.
              </p>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 6 & 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Smart Tips for Finding the Best Hotel Deals
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Finding exceptional accommodation at the right price doesn't have to be difficult. Booking several weeks in advance often provides access to better rates and greater room availability, particularly during holiday seasons and major events.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Comparing guest ratings, reading verified reviews, and checking property amenities can help ensure the hotel meets your expectations. Flexible travel dates often unlock lower prices, while filtering by neighborhood allows you to stay closer to attractions, airports, or business districts.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Taking advantage of seasonal promotions and exclusive member discounts can further reduce travel costs without compromising quality or comfort.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Experience Hospitality Without Limits
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Travel opens the door to new cultures, unforgettable memories, and meaningful experiences. Whether you're planning your dream honeymoon, a family holiday, a solo adventure, a business conference, or a weekend getaway, the right accommodation creates the foundation for an extraordinary journey.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Our mission is to simplify hotel booking while providing travelers with trusted accommodations, competitive pricing, outstanding customer service, and a seamless reservation experience. Wherever your next adventure takes you, we're here to help you discover exceptional places to stay and create memorable travel experiences around the world.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQS) SECTION */}
      <section className="bg-white dark:bg-slate-950 py-12 md:py-16 border-t border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-3 border border-blue-200/60 dark:border-blue-800/60">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Find clear answers to common questions about hotel reservations, payments, and policies.
            </p>
          </div>

          <Accordion items={HOTEL_FAQS} />
        </div>
      </section>

      {/* 5. HOTEL DETAILS MODAL */}
      {selectedHotelKeys && (
        <HotelDetailsModal
          hotelKey={selectedHotelKeys.hotelKey}
          searchKey={selectedHotelKeys.searchKey}
          onClose={() => setSelectedHotelKeys(null)}
          onSelectRoom={(room, hotelDetail) => {
            setSelectedHotelKeys(null);
            setBookingModalData({ room, hotel: hotelDetail });
          }}
        />
      )}

      {/* 6. HOTEL BOOKING MODAL */}
      {bookingModalData && (
        <HotelBookingModal
          room={bookingModalData.room}
          hotel={bookingModalData.hotel}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onClose={() => setBookingModalData(null)}
        />
      )}

    </div>
  );
};

export default HotelsPage;
