"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export interface HolidayPackage {
  id: string;
  name: string;
  destination: string;
  image: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
}

const HOLIDAY_PACKAGES: HolidayPackage[] = [
  {
    id: 'mexico',
    name: 'Mexico Packages',
    destination: 'Mexico',
    image: '/Images/Flight/Cancun Retun Fare.webp',
    price: '$699/-',
    originalPrice: '$950',
    discountBadge: 'HOT DEAL',
  },
  {
    id: 'peru',
    name: 'Peru Packages',
    destination: 'Peru',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    price: '$899/-',
    originalPrice: '$1,200',
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom Packages',
    destination: 'United Kingdom',
    image: '/Images/Flight/London Retun Fare.webp',
    price: '$1,299/-',
    originalPrice: '$1,650',
  },
  {
    id: 'italy',
    name: 'Italy Packages',
    destination: 'Italy',
    image: '/Images/Flight/Rome Retun Fare.webp',
    price: '$1,350/-',
    originalPrice: '$1,800',
    discountBadge: 'POPULAR',
  },
  {
    id: 'spain',
    name: 'Spain Packages',
    destination: 'Spain',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    price: '$1,199/-',
    originalPrice: '$1,550',
  },
  {
    id: 'kenya',
    name: 'Kenya Packages',
    destination: 'Kenya',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    price: '$1,499/-',
    originalPrice: '$1,950',
    discountBadge: 'SAFARI',
  },
  {
    id: 'south-korea',
    name: 'South Korea Packages',
    destination: 'South Korea',
    image: '/Images/Flight/Seoul Retun Fare.webp',
    price: '$999/-',
    originalPrice: '$1,300',
  },
  {
    id: 'switzerland',
    name: 'Switzerland Packages',
    destination: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    price: '$1,899/-',
    originalPrice: '$2,400',
    discountBadge: 'LUXURY',
  },
  {
    id: 'australia',
    name: 'Australia Packages',
    destination: 'Australia',
    image: '/Images/Flight/Sydney Retun Fare.webp',
    price: '$1,599/-',
    originalPrice: '$2,100',
  },
  {
    id: 'new-zealand',
    name: 'New Zealand Packages',
    destination: 'New Zealand',
    image: '/Images/Flight/Auckland Retun Fare.webp',
    price: '$1,699/-',
    originalPrice: '$2,200',
  },
  {
    id: 'japan',
    name: 'Japan Packages',
    destination: 'Japan',
    image: '/Images/Flight/Tokyo Retun Fare.webp',
    price: '$2,449/-',
    originalPrice: '$3,100',
    discountBadge: 'BESTSELLER',
  },
  {
    id: 'egypt',
    name: 'Egypt Packages',
    destination: 'Egypt',
    image: 'https://images.unsplash.com/photo-1572252821143-035a2979e8ef?auto=format&fit=crop&w=800&q=80',
    price: '$699/-',
    originalPrice: '$990',
  },
  {
    id: 'jordan',
    name: 'Jordan Packages',
    destination: 'Jordan',
    image: 'https://images.unsplash.com/photo-1579606030856-4923e87f762d?auto=format&fit=crop&w=800&q=80',
    price: '$849/-',
    originalPrice: '$1,150',
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong Packages',
    destination: 'Hong Kong',
    image: '/Images/Flight/Hongkong Retun Fare.webp',
    price: '$899/-',
    originalPrice: '$1,200',
  },
  {
    id: 'singapore',
    name: 'Singapore Packages',
    destination: 'Singapore',
    image: '/Images/Flight/Singapore Retun Fare.webp',
    price: '$649/-',
    originalPrice: '$890',
  },
];

interface TrendingHolidaysProps {
  onSelectPackage?: (pkg: HolidayPackage) => void;
}

export const TrendingHolidays: React.FC<TrendingHolidaysProps> = ({ onSelectPackage }) => {
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
        
        {/* Section Heading & Subheading matching user prompt */}
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Trending Holiday Destinations
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
                Handpicked destinations worldwide.
              </p>
            </div>

            {/* Carousel Navigation Arrow buttons */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous packages"
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
                aria-label="Next packages"
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

        {/* Carousel Container - Vertical Portrait Cards matching user image design */}
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
            {HOLIDAY_PACKAGES.map((pkg, index) => (
              <motion.div
                key={pkg.id}
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
                className="shrink-0 snap-start w-[240px] sm:w-[265px] md:w-[280px]"
              >
                <div
                  onClick={() => onSelectPackage?.(pkg)}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer h-[340px] sm:h-[370px] border border-slate-300 dark:border-slate-700 bg-slate-900"
                >
                  {/* Full-Bleed Tall Vertical Image */}
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                  />

                  {/* Dark Gradient Overlay at Bottom (Matching image design) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

                  {/* Bottom Text Overlay - Package Name & Price (Matching user image exact design) */}
                  <div className="absolute bottom-5 left-4 right-4 text-center z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-md group-hover:text-amber-300 transition-colors mb-1">
                      {pkg.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-1.5 text-slate-200/90">
                      {pkg.originalPrice && (
                        <span className="text-xs text-slate-300/70 line-through font-medium">
                          {pkg.originalPrice}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-extrabold text-white">
                        {pkg.price}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Next Arrow Overlay */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Next slide"
              className="hidden md:flex absolute -right-4 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
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

export default TrendingHolidays;
