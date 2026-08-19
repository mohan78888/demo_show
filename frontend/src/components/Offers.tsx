"use client";

import React from 'react';
import ScrollReveal from './ScrollReveal';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export interface DetailedOffer {
  id: string;
  badge: string;
  title: string;
  category: 'all' | 'flights' | 'hotels' | 'resorts' | 'packages';
  bgImage?: string;
}

const EXCLUSIVE_OFFERS: DetailedOffer[] = [
  {
    id: '1',
    badge: '✈️ Save Up to 30%',
    title: 'International Flight Deals',
    category: 'flights',
    bgImage: '/exclusive-offer/offer-1.webp',
  },
  {
    id: '2',
    badge: '🔥 Up to 40% Off',
    title: 'Luxury Hotel Escapes',
    category: 'hotels',
    bgImage: '/exclusive-offer/offer-2.webp',
  },
  {
    id: '3',
    badge: '👨‍👩‍👧‍👦 Family Special',
    title: 'Family Holiday Packages',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-3.webp',
  },
  {
    id: '4',
    badge: '🚢 Limited Offer',
    title: 'Luxury Cruise Adventures',
    category: 'resorts',
    bgImage: '/exclusive-offer/offer-4.webp',
  },
  {
    id: '5',
    badge: '💳 Card Exclusive',
    title: 'Pay with Mastercard & Save',
    category: 'all',
    bgImage: '/exclusive-offer/offer-5.webp',
  },
  {
    id: '6',
    badge: '🚌 Smart Savings',
    title: 'Bus Travel Deals',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-6.webp',
  },
  {
    id: '7',
    badge: '🚆 Rail Special',
    title: 'Scenic Rail Journeys',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-7.webp',
  },
  {
    id: '8',
    badge: '🚗 From $29/Day',
    title: 'Car Rental Offers',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-8.webp',
  },
  {
    id: '9',
    badge: '⏰ Early Bird',
    title: 'Book Early & Save',
    category: 'all',
    bgImage: '/exclusive-offer/offer-9.webp',
  },
  {
    id: '10',
    badge: '⚡ Flash Sale',
    title: 'Last Minute Getaways',
    category: 'all',
    bgImage: '/exclusive-offer/offer-10.webp',
  },
  {
    id: '11',
    badge: '🎓 Student Deal',
    title: 'Student Travel Savings',
    category: 'all',
    bgImage: '/exclusive-offer/offer-11.webp',
  },
  {
    id: '12',
    badge: '💖 Romantic Escape',
    title: 'Honeymoon Specials',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-12.webp',
  },
  {
    id: '13',
    badge: '☀️ Summer Sale',
    title: 'Summer Vacation Deals',
    category: 'all',
    bgImage: '/exclusive-offer/offer-13.webp',
  },
  {
    id: '14',
    badge: '🎁 Holiday Offer',
    title: 'Festive Season Savings',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-14.webp',
  },
  {
    id: '15',
    badge: '🧗 Adventure Picks',
    title: 'Adventure Tours',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-15.webp',
  },
  {
    id: '16',
    badge: '🏖️ Beach Escape',
    title: 'Tropical Paradise Deals',
    category: 'resorts',
    bgImage: '/exclusive-offer/offer-16.webp',
  },
  {
    id: '17',
    badge: '🏙️ City Break',
    title: 'Weekend City Escapes',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-17.webp',
  },
  {
    id: '18',
    badge: '👑 VIP Exclusive',
    title: 'Premium Member Offers',
    category: 'all',
    bgImage: '/exclusive-offer/offer-18.webp',
  },
  {
    id: '19',
    badge: '👴 Senior Savings',
    title: 'Senior Travel Discounts',
    category: 'all',
    bgImage: '/exclusive-offer/offer-19.webp',
  },
  {
    id: '20',
    badge: '✈️+🏨 Best Value',
    title: 'Flight + Hotel Bundle',
    category: 'packages',
    bgImage: '/exclusive-offer/offer-20.webp',
  }
];

const categoryIconMap: Record<string, string> = {
  flights: '✈️',
  hotels: '🏨',
  resorts: '🏝️',
  packages: '🧳',
  all: '🏷️'
};

const renderCardSvgBg = (id: string) => {
  switch (id) {
    case '1':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-blue-600 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" strokeLinecap="round" d="M10 80 Q 40 10 90 20" />
          <path strokeWidth="1" strokeDasharray="3 3" d="M20 90 Q 50 20 95 30" />
          <path strokeWidth="1.5" d="M70 15 L85 22 L75 35 L65 25 Z M78 27 L92 32 M70 20 L80 10" fill="currentColor" fillOpacity="0.15" />
          <circle cx="85" cy="22" r="12" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case '2':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-amber-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M30 80 V30 L50 15 L70 30 V80 Z M30 50 H70 M50 30 V80" />
          <polygon points="50,5 53,12 60,12 55,16 57,23 50,19 43,23 45,16 40,12 47,12" fill="currentColor" fillOpacity="0.2" stroke="none" />
          <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      );
    case '3':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-emerald-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M20 90 C30 50 70 50 80 90 M35 40 A10 10 0 1 1 55 40 M65 50 A8 8 0 1 1 81 50" />
          <path strokeWidth="1" strokeLinecap="round" d="M10 30 L25 45 M80 20 L90 35 M50 10 V25" />
          <circle cx="50" cy="10" r="5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case '4':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-cyan-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M10 70 Q 30 60 50 70 T 90 70 M5 85 Q 25 75 50 85 T 95 85" />
          <path strokeWidth="1.5" d="M25 60 L35 30 H75 L65 60 Z M40 30 V15 H60 V30" fill="currentColor" fillOpacity="0.15" />
          <circle cx="80" cy="25" r="8" strokeWidth="1.5" />
        </svg>
      );
    case '5':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-purple-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100">
          <circle cx="40" cy="50" r="28" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="65" cy="50" r="28" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <path d="M52.5 28 A28 28 0 0 1 52.5 72 A28 28 0 0 1 52.5 28 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      );
    case '6':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-orange-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <rect x="20" y="30" width="60" height="40" rx="8" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <line x1="20" y1="50" x2="80" y2="50" strokeWidth="1.5" />
          <circle cx="35" cy="70" r="6" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          <circle cx="65" cy="70" r="6" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          <line x1="5" y1="85" x2="95" y2="85" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
      );
    case '7':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-indigo-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M15 90 L40 20 M85 90 L60 20" />
          <line x1="20" y1="75" x2="80" y2="75" strokeWidth="1.5" />
          <line x1="26" y1="60" x2="74" y2="60" strokeWidth="1.5" />
          <line x1="32" y1="45" x2="68" y2="45" strokeWidth="1.5" />
          <path strokeWidth="1" d="M10 50 L35 25 L55 40 L85 10" strokeDasharray="3 3" />
        </svg>
      );
    case '8':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-rose-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M15 65 L25 45 C30 35 70 35 75 45 L85 65 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="30" cy="65" r="8" strokeWidth="1.5" />
          <circle cx="70" cy="65" r="8" strokeWidth="1.5" />
          <path strokeWidth="1" strokeDasharray="4 4" d="M50 15 A35 35 0 0 1 85 50" />
        </svg>
      );
    case '9':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-sky-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <circle cx="50" cy="50" r="30" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
          <polyline points="50,28 50,50 65,50" strokeWidth="2" strokeLinecap="round" />
          <path strokeWidth="1" strokeLinecap="round" d="M50 10 V16 M50 84 V90 M10 50 H16 M84 50 H90" />
        </svg>
      );
    case '10':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-yellow-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100">
          <polygon points="55,10 25,55 50,55 45,90 75,45 50,45" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        </svg>
      );
    case '11':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-blue-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <polygon points="50,20 90,40 50,60 10,40" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <path strokeWidth="1.5" d="M30 50 V70 C30 75 70 75 70 70 V50" />
          <line x1="82" y1="44" x2="82" y2="78" strokeWidth="2" strokeLinecap="round" />
          <circle cx="82" cy="82" r="3" fill="currentColor" />
        </svg>
      );
    case '12':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-pink-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100">
          <path d="M50 30 C40 10 10 20 10 45 C10 65 50 88 50 88 C50 88 90 65 90 45 C90 20 60 10 50 30 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <path d="M70 20 C63 7 43 14 43 31 C43 45 70 60 70 60 C70 60 97 45 97 31 C97 14 77 7 70 20 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case '13':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-amber-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <circle cx="50" cy="50" r="22" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          <path strokeWidth="1.5" strokeLinecap="round" d="M50 12 V22 M50 78 V88 M12 50 H22 M78 50 H88 M23 23 L30 30 M70 70 L77 77 M77 23 L70 30 M30 70 L23 77" />
        </svg>
      );
    case '14':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-red-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <rect x="25" y="45" width="50" height="40" rx="4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <line x1="50" y1="45" x2="50" y2="85" strokeWidth="2" />
          <line x1="25" y1="65" x2="75" y2="65" strokeWidth="2" />
          <path strokeWidth="1.5" d="M35 32 C30 20 48 20 50 32 C52 20 70 20 65 32 Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case '15':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-emerald-600 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <polygon points="10,85 45,25 70,85" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
          <polygon points="40,85 65,40 90,85" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <polyline points="40,33 45,25 50,33" strokeWidth="1.5" />
        </svg>
      );
    case '16':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-teal-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M10 75 Q 30 65 50 75 T 90 75 M5 88 Q 30 78 55 88 T 95 88" />
          <path strokeWidth="1.5" d="M60 70 C60 40 40 30 30 20 L75 40 Z" fill="currentColor" fillOpacity="0.15" />
          <circle cx="25" cy="25" r="10" fill="currentColor" fillOpacity="0.2" stroke="none" />
        </svg>
      );
    case '17':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-slate-600 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <rect x="15" y="40" width="20" height="45" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <rect x="40" y="20" width="24" height="65" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <rect x="68" y="50" width="18" height="35" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <line x1="52" y1="5" x2="52" y2="20" strokeWidth="1.5" />
        </svg>
      );
    case '18':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-yellow-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <polygon points="20,70 15,35 38,50 50,20 62,50 85,35 80,70" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="15" cy="35" r="3" fill="currentColor" />
          <circle cx="85" cy="35" r="3" fill="currentColor" />
        </svg>
      );
    case '19':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-violet-500 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <circle cx="50" cy="50" r="32" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" strokeDasharray="4 4" />
          <path strokeWidth="1.5" d="M35 50 A15 15 0 0 1 65 50 A15 15 0 0 1 35 50 Z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );
    case '20':
      return (
        <svg className="absolute -right-4 -bottom-4 w-36 h-36 opacity-15 dark:opacity-25 text-blue-600 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0" fill="none" viewBox="0 0 100 100" stroke="currentColor">
          <path strokeWidth="1.5" d="M15 75 L50 25 L85 75 Z" fill="currentColor" fillOpacity="0.1" />
          <path strokeWidth="1.5" d="M35 45 L65 45 M50 25 V75" />
          <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );
    default:
      return null;
  }
};

interface OffersProps {
  onSeeAll?: () => void;
}

const Offers: React.FC<OffersProps> = ({ onSeeAll }) => {
  const { containerRef, scrollLeft, scrollRight } = useHorizontalScroll<HTMLDivElement>(320);

  return (
    <section className="py-6 md:py-9 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Compact Section Header - Preserved unmodified as requested */}
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Exclusive Offers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Enjoy exclusive savings on your next adventure with our best travel offers.
              </p>
            </div>

            {/* Carousel Arrow Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Scroll Right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Offer Cards Carousel Container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1 snap-x snap-mandatory scroll-smooth"
        >
          {EXCLUSIVE_OFFERS.map((offer, index) => {
            const hasBg = Boolean(offer.bgImage);

            return (
              <ScrollReveal
                key={offer.id}
                delay={Math.min(index * 80, 500)}
                className="snap-start shrink-0"
              >
                <div
                  onClick={() => {
                    const searchInput = document.querySelector('input[name="from"]');
                    if (searchInput instanceof HTMLElement) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      searchInput.focus();
                    } else if (onSeeAll) {
                      onSeeAll();
                    }
                  }}
                  className={`w-[280px] sm:w-[310px] min-h-[178px] rounded-2xl border p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                    hasBg
                      ? 'border-slate-700/80 bg-slate-950 text-white shadow-lg'
                      : 'bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-slate-200/80 dark:border-slate-800/90'
                  }`}
                >
                  
                  {/* Background Image / SVG Pattern */}
                  {hasBg ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${offer.bgImage})` }}
                      />
                      {/* Soft gradient overlay so the image stays vivid & bright while text remains crisp */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 pointer-events-none" />
                    </>
                  ) : (
                    /* Custom Elegant SVG Vector Background Overlay */
                    renderCardSvgBg(offer.id)
                  )}

                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black tracking-tight ${
                      hasBg
                        ? 'bg-blue-600 text-white border border-white/20 shadow-md backdrop-blur-sm'
                        : 'bg-blue-50/90 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/70 backdrop-blur-xs'
                    }`}>
                      {offer.badge}
                    </span>
                    <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                      hasBg ? 'text-white/90 bg-black/40 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      <span>{categoryIconMap[offer.category] || '🏷️'}</span>
                    </div>
                  </div>

                  <div className="my-1.5 relative z-10">
                    <h3 className={`text-sm sm:text-base font-black tracking-tight line-clamp-2 transition-colors ${
                      hasBg
                        ? 'text-white group-hover:text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                        : 'text-slate-900 dark:text-white group-hover:text-blue-600'
                    }`}>
                      {offer.title}
                    </h3>
                  </div>

                  {/* Attractive Animated Styled Text Bottom Row */}
                  <div className={`flex items-center justify-between pt-2.5 border-t mt-auto relative z-10 transition-colors ${
                    hasBg ? 'border-white/20' : 'border-slate-100 dark:border-slate-800/80'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                        hasBg
                          ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent group-hover:tracking-widest'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:tracking-widest'
                      }`}>
                        Tap to Explore Deal
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 ${
                      hasBg
                        ? 'bg-white/20 text-white group-hover:bg-amber-400 group-hover:text-slate-950 shadow-sm backdrop-blur-xs'
                        : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default React.memo(Offers);
