"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface HotelDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: string;
  discount: string;
}

const TOP_HOTELS: HotelDestination[] = [
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    price: '$189',
    discount: 'Up to 30% OFF',
    image: '/Images/Hotels/Venice.webp',
  },
  {
    id: 'macau',
    name: 'Macau',
    country: 'China',
    price: '$149',
    discount: 'Up to 25% OFF',
    image: '/Images/Hotels/Macau.webp',
  },
  {
    id: 'wellington',
    name: 'Wellington',
    country: 'New Zealand',
    price: '$119',
    discount: 'Up to 35% OFF',
    image: '/Images/Hotels/Wellington.webp',
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    price: '$249',
    discount: 'Up to 20% OFF',
    image: '/Images/Hotels/Zurich.webp',
  },
  {
    id: 'abudhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    price: '$219',
    discount: 'Up to 40% OFF',
    image: '/Images/Hotels/Abu Dhabi.webp',
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    price: '$89',
    discount: 'Up to 45% OFF',
    image: '/Images/Hotels/Cairo.webp',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    price: '$299',
    discount: 'Up to 50% OFF',
    image: '/Images/Hotels/Maldives.webp',
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    price: '$109',
    discount: 'Up to 30% OFF',
    image: '/Images/Hotels/Istanbul.webp',
  },
  {
    id: 'kualalumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    price: '$99',
    discount: 'Up to 35% OFF',
    image: '/Images/Hotels/kuala lumpur.webp',
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'China',
    price: '$139',
    discount: 'Up to 25% OFF',
    image: '/Images/Hotels/Shanghai.webp',
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    price: '$129',
    discount: 'Up to 30% OFF',
    image: '/Images/Hotels/Lisbon.webp',
  },
  {
    id: 'taipei',
    name: 'Taipei',
    country: 'Taiwan',
    price: '$159',
    discount: 'Up to 20% OFF',
    image: '/Images/Hotels/Taipei.webp',
  },
  {
    id: 'inari',
    name: 'Inari',
    country: 'Finland',
    price: '$199',
    discount: 'Up to 40% OFF',
    image: '/Images/Hotels/Inari.webp',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    price: '$169',
    discount: 'Up to 35% OFF',
    image: '/Images/Hotels/Bali.webp',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    price: '$179',
    discount: 'Up to 25% OFF',
    image: '/Images/Hotels/Singapore.webp',
  },
];

interface TopHotelsProps {
  onSelectDestination?: (destination: HotelDestination) => void;
}

export const TopHotels: React.FC<TopHotelsProps> = ({ onSelectDestination }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollButtons, { passive: true });
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-white dark:bg-slate-950 py-6 md:py-9 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Heading matched with CruiseDestinations design */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore Top Hotels
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
              Explore handpicked hotels offering comfort, luxury, and unforgettable experiences.
            </p>
          </div>

          {/* Navigation Arrow buttons matching CruiseDestinations style */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous hotels"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                canScrollLeft
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next hotels"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                canScrollRight
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none pb-4 pt-2 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {TOP_HOTELS.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.08, 0.7),
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="shrink-0 snap-start w-[250px] sm:w-[275px] md:w-[290px]"
              >
                <div
                  onClick={() => onSelectDestination?.(hotel)}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-xl transition-all duration-350 ease-out hover:-translate-y-2 flex flex-col h-[260px] sm:h-[275px]"
                >
                  {/* Top Landscape Image with Dark Gradient & High Contrast Clarity */}
                  <div className="relative h-[165px] sm:h-[175px] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={hotel.image}
                      alt={`${hotel.name}, ${hotel.country}`}
                      fill
                      sizes="(max-width: 640px) 250px, 290px"
                      className="object-cover contrast-110 brightness-90 group-hover:scale-[1.08] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/40 pointer-events-none transition-opacity duration-300"></div>
                  </div>

                  {/* Card Content - Destination Name, Country & Up to Price */}
                  <div className="flex-1 px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-bold leading-normal truncate">
                        {hotel.country}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        Up to
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 -mt-0.5">
                        {hotel.price} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating circular next arrow overlay on right side */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Next slide"
              className="hidden md:flex absolute -right-4 top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default TopHotels;
