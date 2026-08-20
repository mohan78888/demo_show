"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export interface OutdoorActivityCard {
  id: string;
  categoryName: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviewsCount: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  image: string;
}

const OUTDOOR_ACTIVITIES: OutdoorActivityCard[] = [
  {
    id: 'helicopter-ride',
    categoryName: 'Helicopter Ride',
    title: 'NYC: Manhattan Sightseeing Helicopter Tour',
    location: 'New York',
    duration: '15 - 30 minutes • Small group',
    rating: 4.8,
    reviewsCount: '7,155',
    price: '$249',
    originalPrice: '$299',
    badge: 'Top pick',
    image: '/Images/activities/Helicopter Ride.webp',
  },
  {
    id: 'yacht',
    categoryName: 'Yacht',
    title: 'Luxury Private Yacht Charter & Sunset Cruise',
    location: 'Miami',
    duration: '2 - 4 hours • Private group',
    rating: 4.9,
    reviewsCount: '3,420',
    price: '$320',
    originalPrice: '$390',
    badge: 'Top rated',
    image: '/Images/activities/Yacht.webp',
  },
  {
    id: 'plane-ride',
    categoryName: 'Plane Ride',
    title: 'Scenic Island Flight & Aerial Landscape Tour',
    location: 'Honolulu',
    duration: '45 minutes • Small group',
    rating: 4.8,
    reviewsCount: '1,890',
    price: '$180',
    originalPrice: '$220',
    badge: 'Top rated',
    image: '/Images/activities/Plane Ride.webp',
  },
  {
    id: 'jetski',
    categoryName: 'Jetski',
    title: 'High-Speed Jet Ski Guided Coastal Adventure',
    location: 'Dubai',
    duration: '1 - 2 hours • Instructor guided',
    rating: 4.9,
    reviewsCount: '4,120',
    price: '$115',
    originalPrice: '$145',
    badge: 'Top pick',
    image: '/Images/activities/Jetski.webp',
  },
  {
    id: 'hot-air-balloon',
    categoryName: 'Hot Air Balloon',
    title: 'Sunrise Hot Air Balloon Flight with Champagne',
    location: 'Cappadocia',
    duration: '3 hours • Includes breakfast',
    rating: 5.0,
    reviewsCount: '8,940',
    price: '$195',
    originalPrice: '$250',
    badge: 'Top rated',
    image: '/Images/activities/Hot Air Balloon.webp',
  },
  {
    id: 'river-rafting',
    categoryName: 'River Rafting',
    title: 'White Water River Rafting Rapids Expedition',
    location: 'Bali',
    duration: '3 - 4 hours • Safety gear inc.',
    rating: 4.8,
    reviewsCount: '2,650',
    price: '$55',
    originalPrice: '$75',
    badge: 'Top pick',
    image: '/Images/activities/River Rafting.webp',
  },
  {
    id: 'kayaking',
    categoryName: 'Kayaking',
    title: 'Sea Cave & Secret Lagoon Kayaking Excursion',
    location: 'Phuket',
    duration: '2 - 3 hours • Guided',
    rating: 4.9,
    reviewsCount: '3,110',
    price: '$48',
    originalPrice: '$65',
    badge: 'Top rated',
    image: '/Images/activities/Kayaking.webp',
  },
  {
    id: 'zipline',
    categoryName: 'Zipline',
    title: 'Extreme Canopy Zipline & Rainforest Fly-through',
    location: 'Costa Rica',
    duration: '2.5 hours • Full harness',
    rating: 4.9,
    reviewsCount: '5,230',
    price: '$79',
    originalPrice: '$99',
    badge: 'Top pick',
    image: '/Images/activities/Zipline.webp',
  },
  {
    id: 'paragliding',
    categoryName: 'Paragliding',
    title: 'Tandem Alpine Paragliding Flight Over Lakes',
    location: 'Interlaken',
    duration: '1.5 hours • Pilot guided',
    rating: 5.0,
    reviewsCount: '4,870',
    price: '$170',
    originalPrice: '$210',
    badge: 'Top rated',
    image: '/Images/activities/Paragliding.webp',
  },
  {
    id: 'bungee',
    categoryName: 'Bungee',
    title: 'Bridge Bungee Jump & Thrill Drop Experience',
    location: 'Queenstown',
    duration: '1 hour • Certified crew',
    rating: 4.9,
    reviewsCount: '3,920',
    price: '$135',
    originalPrice: '$170',
    badge: 'Top pick',
    image: '/Images/activities/Bungee.webp',
  },
  {
    id: 'atv-quad-bike',
    categoryName: 'ATV Quad Bike',
    title: 'Desert Dunes ATV Quad Bike & Off-Road Tour',
    location: 'Abu Dhabi',
    duration: '2 hours • Helmet & goggles',
    rating: 4.8,
    reviewsCount: '6,150',
    price: '$69',
    originalPrice: '$90',
    badge: 'Top rated',
    image: '/Images/activities/ATV Quad Bike.webp',
  },
  {
    id: 'snorkeling',
    categoryName: 'Snorkeling',
    title: 'Coral Reef Snorkeling & Sea Turtle Swimming',
    location: 'Maldives',
    duration: '3 hours • Equipment inc.',
    rating: 4.9,
    reviewsCount: '4,560',
    price: '$85',
    originalPrice: '$110',
    badge: 'Top pick',
    image: '/Images/activities/Snorkeling.webp',
  },
  {
    id: 'camel-rides',
    categoryName: 'Camel Rides',
    title: 'Sunset Desert Camel Trek & Traditional Feast',
    location: 'Cairo',
    duration: '3 - 4 hours • Tea & dinner',
    rating: 4.8,
    reviewsCount: '3,780',
    price: '$49',
    originalPrice: '$65',
    badge: 'Top rated',
    image: '/Images/activities/Camel Rides.webp',
  },
  {
    id: 'jeep-safari',
    categoryName: 'Jeep Safari',
    title: '4x4 Jungle & Wildlife Jeep Safari Expedition',
    location: 'Sri Lanka',
    duration: '4 hours • Ranger guided',
    rating: 4.9,
    reviewsCount: '2,940',
    price: '$92',
    originalPrice: '$120',
    badge: 'Top pick',
    image: '/Images/activities/Jeep Safari.webp',
  },
  {
    id: 'boat-ride',
    categoryName: 'Boat Ride',
    title: 'Scenic Coastal Boat Cruise & Island Sightseeing',
    location: 'Venice',
    duration: '2 hours • Refreshments inc.',
    rating: 4.8,
    reviewsCount: '5,610',
    price: '$62',
    originalPrice: '$80',
    badge: 'Top rated',
    image: '/Images/activities/Boat Ride.webp',
  },
];

interface OutdoorActivitiesProps {
  onSelectActivity?: (activity: OutdoorActivityCard) => void;
}

export const OutdoorActivities: React.FC<OutdoorActivitiesProps> = ({ onSelectActivity }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

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

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full bg-white dark:bg-slate-950 py-6 md:py-9 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Heading & Subheading matching user prompt */}
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Outdoor Activities
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
                Explore unforgettable outdoor experiences.
              </p>
            </div>

            {/* Carousel Navigation Arrow buttons */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous activities"
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
                aria-label="Next activities"
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

        {/* Carousel Container - GetYourGuide Activity Card Style (Matching User Screenshot) */}
        <div className="relative group/carousel">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none pb-4 pt-2 snap-x snap-mandatory scroll-smooth px-1 sm:px-0"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {OUTDOOR_ACTIVITIES.map((act, index) => (
              <motion.div
                key={act.id}
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
                className="shrink-0 snap-start w-[260px] sm:w-[285px] md:w-[300px]"
              >
                <div
                  onClick={() => onSelectActivity?.(act)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer flex flex-col h-[350px] sm:h-[370px]"
                >
                  {/* Top Photo Section with Badge & Heart Icon */}
                  <div className="relative h-[180px] sm:h-[195px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={act.image}
                      alt={act.title}
                      fill
                      sizes="(max-width: 640px) 260px, 300px"
                      className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                    />

                    {/* Top Right Heart Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(act.id, e)}
                      aria-label="Save to wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    >
                      <svg
                        className={`w-4 h-4 ${wishlist[act.id] ? 'fill-red-500 stroke-red-500' : 'stroke-current fill-none'}`}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Content Area (GetYourGuide Card Info Layout) */}
                  <div className="flex-1 p-4 flex flex-col justify-between bg-white dark:bg-slate-900">
                    <div>
                      {/* Location Subtitle */}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        {act.location} • {act.categoryName}
                      </span>

                      {/* Card Title */}
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                        {act.title}
                      </h3>
                    </div>

                    {/* Duration & Price Row */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
                      {/* Left: Duration Specs */}
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-bold truncate pr-2">
                        {act.duration}
                      </p>

                      {/* Right: Price */}
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline gap-1">
                          {act.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through font-normal">
                              {act.originalPrice}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">Up to</span>
                          <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                            {act.price}
                          </span>
                        </div>
                      </div>
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

export default OutdoorActivities;
