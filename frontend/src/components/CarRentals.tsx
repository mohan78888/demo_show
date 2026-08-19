"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import ScrollReveal from './ScrollReveal';

export interface CarRentalCity {
  id: string;
  name: string;
  country: string;
  image: string;
  startingPrice: string;
  rentalsCount: string;
}

const CAR_RENTAL_CITIES: CarRentalCity[] = [
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    image: '/Images/car/Los Angeles.webp',
    startingPrice: 'From $28/day',
    rentalsCount: '450+ Cars',
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    image: '/Images/car/Melbourne.webp',
    startingPrice: 'From $30/day',
    rentalsCount: '320+ Cars',
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    image: '/Images/car/Madrid.webp',
    startingPrice: 'From $25/day',
    rentalsCount: '410+ Cars',
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    country: 'Germany',
    image: '/Images/car/Hamburg.webp',
    startingPrice: 'From $29/day',
    rentalsCount: '280+ Cars',
  },
  {
    id: 'warsaw',
    name: 'Warsaw',
    country: 'Poland',
    image: '/Images/car/Warsaw.webp',
    startingPrice: 'From $21/day',
    rentalsCount: '230+ Cars',
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    image: '/Images/car/Chicago.webp',
    startingPrice: 'From $31/day',
    rentalsCount: '480+ Cars',
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    image: '/Images/car/Toronto.webp',
    startingPrice: 'From $33/day',
    rentalsCount: '390+ Cars',
  },
  {
    id: 'glasgow',
    name: 'Glasgow',
    country: 'United Kingdom',
    image: '/Images/car/Glasgow.webp',
    startingPrice: 'From $26/day',
    rentalsCount: '210+ Cars',
  },
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    image: '/Images/car/Copenhagen.webp',
    startingPrice: 'From $34/day',
    rentalsCount: '260+ Cars',
  },
  {
    id: 'bucharest',
    name: 'Bucharest',
    country: 'Romania',
    image: '/Images/car/Bucharest.webp',
    startingPrice: 'From $18/day',
    rentalsCount: '190+ Cars',
  },
  {
    id: 'brussels',
    name: 'Brussels',
    country: 'Belgium',
    image: '/Images/car/Brussels.webp',
    startingPrice: 'From $27/day',
    rentalsCount: '310+ Cars',
  },
  {
    id: 'ankara',
    name: 'Ankara',
    country: 'Turkey',
    image: '/Images/car/Ankara.webp',
    startingPrice: 'From $22/day',
    rentalsCount: '270+ Cars',
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'United States',
    image: '/Images/car/Miami.webp',
    startingPrice: 'From $29/day',
    rentalsCount: '530+ Cars',
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    image: '/Images/car/San Francisco.webp',
    startingPrice: 'From $32/day',
    rentalsCount: '380+ Cars',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    image: '/Images/car/London.webp',
    startingPrice: 'From $24/day',
    rentalsCount: '610+ Cars',
  },
];

interface CarRentalsProps {
  onSelectCity?: (city: CarRentalCity) => void;
}

export const CarRentals: React.FC<CarRentalsProps> = ({ onSelectCity }) => {
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
        
        {/* Section Heading & Subheading wrapped with ScrollReveal */}
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Car Rental – 600+ Cities
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
                Drive your journey with trusted rentals worldwide.
              </p>
            </div>

            {/* Navigation Arrow buttons matching existing card sections */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                suppressHydrationWarning
                aria-label="Previous cities"
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
                suppressHydrationWarning
                aria-label="Next cities"
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
        </ScrollReveal>

        {/* Popular Car Rental Cities Cards Carousel with Framer Motion */}
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
            {CAR_RENTAL_CITIES.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.08, 0.7),
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="shrink-0 snap-start w-[250px] sm:w-[275px] md:w-[290px]"
              >
                <div
                  onClick={() => onSelectCity?.(city)}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-out cursor-pointer h-48 sm:h-52 md:h-56 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                >
                  {/* Full-Bleed City Image */}
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 250px, 290px"
                    className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                  />

                  {/* Dark gradient overlay at bottom for maximum contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"></div>

                  {/* Bottom Text Overlay - City Name, Country & Fleet Count */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none drop-shadow-md group-hover:text-blue-200 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs text-white font-bold mt-1 drop-shadow-sm">
                      {city.country} • {city.rentalsCount}
                    </p>
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
              className="hidden md:flex absolute -right-4 top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
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

export default CarRentals;
