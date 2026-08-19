"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export interface CruiseDestination {
  id: string;
  title: string;
  tagline?: string;
  liner: string;
  route: string;
  duration: string;
  price: string;
  discount: string;
  rating: number;
  perks: string[];
  image: string;
}

const CRUISE_DESTINATIONS: CruiseDestination[] = [
  {
    id: '1',
    title: 'Caribbean Island Paradise',
    liner: 'Royal Caribbean',
    route: 'Miami • Cozumel • Roatan • Perfect Day at CocoCay',
    duration: '7 Nights / 8 Days',
    price: '$599',
    discount: '30% OFF',
    rating: 4.9,
    perks: ['All Meals Included', '$100 Onboard Credit', 'Free Ocean View Upgrade'],
    image: '/Images/Cruise/Caribbean Cruise.webp'
  },
  {
    id: '2',
    title: 'Mediterranean Highlights & Greek Isles',
    liner: 'Celebrity Cruises',
    route: 'Barcelona • Marseille • Rome • Santorini • Athens',
    duration: '9 Nights / 10 Days',
    price: '$899',
    discount: 'SAVE $400',
    rating: 4.8,
    perks: ['Classic Drinks Included', 'Free Wi-Fi', 'Balcony Stateroom'],
    image: '/Images/Cruise/Mediterranean Cruise.webp'
  },
  {
    id: '3',
    title: 'Alaskan Glacier & Fjords Expedition',
    tagline: 'WILDERNESS VOYAGE',
    liner: 'Princess Cruises',
    route: 'Seattle • Juneau • Skagway • Glacier Bay • Ketchikan',
    duration: '7 Nights / 8 Days',
    price: '$749',
    discount: 'SPECIAL OFFER',
    rating: 4.9,
    perks: ['Glacier Viewing Deck', 'Shore Excursion Credit', 'Kids Sail Free'],
    image: '/Images/Cruise/Alaska Cruise.webp'
  },
  {
    id: '4',
    title: 'Bahamas & Private Island Getaway',
    liner: 'Norwegian Cruise Line',
    route: 'Port Canaveral • Nassau • Great Stirrup Cay',
    duration: '4 Nights / 5 Days',
    price: '$399',
    discount: '25% OFF',
    rating: 4.7,
    perks: ['Free Open Bar', 'Specialty Dining Package', 'Airfare Included'],
    image: '/Images/Cruise/Bahamas cruise.webp'
  },
  {
    id: '5',
    title: 'Antarctica Expedition & Icebergs',
    liner: 'Hurtigruten',
    route: 'Ushuaia • Drake Passage • Antarctic Peninsula • Shetland Islands',
    duration: '11 Nights / 12 Days',
    price: '$1,899',
    discount: 'SAVE $600',
    rating: 5.0,
    perks: ['Polar Parka Included', 'Zodiac Excursions', 'Science Center Pass'],
    image: '/Images/Cruise/Antarctica Cruise.webp'
  },
  {
    id: '6',
    title: 'Arabian Gulf & Dubai Luxury Cruise',
    liner: 'MSC Cruises',
    route: 'Dubai • Abu Dhabi • Sir Bani Yas • Muscat',
    duration: '7 Nights / 8 Days',
    price: '$699',
    discount: '35% OFF',
    rating: 4.8,
    perks: ['Desert Safari Voucher', 'Luxury Spa Credit', 'Full Board Dining'],
    image: '/Images/Cruise/Arabian Gulf cruises.webp'
  },
  {
    id: '7',
    title: 'Australia & Great Barrier Reef Voyage',
    liner: 'Carnival Cruises',
    route: 'Sydney • Brisbane • Cairns • Airlie Beach',
    duration: '8 Nights / 9 Days',
    price: '$849',
    discount: '20% OFF',
    rating: 4.9,
    perks: ['Snorkeling Pass Included', 'Deck Parties', 'Kids Club Free'],
    image: '/Images/Cruise/Australia Cruise.webp'
  },
  {
    id: '8',
    title: 'Eastern Europe & Danube Explorer',
    liner: 'Viking River Cruises',
    route: 'Budapest • Vienna • Bratislava • Belgrade',
    duration: '7 Nights / 8 Days',
    price: '$1,199',
    discount: '$200 OFF',
    rating: 4.9,
    perks: ['Guided City Tours', 'Regional Wine Tasting', 'Free Wi-Fi'],
    image: '/Images/Cruise/Eastren Europe Cruise.webp'
  },
  {
    id: '9',
    title: 'Greenland & Arctic Wilderness Voyage',
    liner: 'Silversea Expeditions',
    route: 'Nuuk • Ilulissat • Disko Bay • Qaqortoq',
    duration: '10 Nights / 11 Days',
    price: '$2,299',
    discount: 'EXCLUSIVE',
    rating: 4.9,
    perks: ['Butler Service', 'All-Inclusive Luxury', 'Helicopter Tour Option'],
    image: '/Images/Cruise/Greenland Cruise.webp'
  },
  {
    id: '10',
    title: 'India & Indian Ocean Luxury Cruise',
    liner: 'Costa Cruises',
    route: 'Mumbai • Goa • Mangalore • Kochi • Lakshadweep',
    duration: '6 Nights / 7 Days',
    price: '$549',
    discount: 'FLAT 40% OFF',
    rating: 4.7,
    perks: ['Cultural Shows', 'Authentic Indian Cuisine', 'Wellness Spa Pass'],
    image: '/Images/Cruise/India.webp'
  },
  {
    id: '11',
    title: 'Japan, Korea & China Grand Discovery',
    liner: 'Princess Cruises',
    route: 'Tokyo • Busan • Jeju Island • Shanghai • Okinawa',
    duration: '10 Nights / 11 Days',
    price: '$1,099',
    discount: 'SAVE $500',
    rating: 4.9,
    perks: ['Onboard Cultural Workshop', 'Sushi Masterclass', 'Shore Excursions'],
    image: '/Images/Cruise/Japan Korea China Cruise.webp'
  },
  {
    id: '12',
    title: 'Pacific Coastal & California Sun',
    liner: 'Holland America',
    route: 'Vancouver • San Francisco • Santa Barbara • San Diego',
    duration: '6 Nights / 7 Days',
    price: '$629',
    discount: '15% OFF',
    rating: 4.8,
    perks: ['Wine Pairing Dinner', 'Ocean View Suite Upgrade', 'Live Music Pass'],
    image: '/Images/Cruise/Pacific Coastal Cruise.webp'
  },
  {
    id: '13',
    title: 'Singapore & Southeast Asia Voyage',
    liner: 'Genting Dream',
    route: 'Singapore • Penang • Phuket • Langkawi',
    duration: '5 Nights / 6 Days',
    price: '$499',
    discount: 'POPULAR',
    rating: 4.8,
    perks: ['Waterpark Pass', 'Casino Voucher', 'International Buffet'],
    image: '/Images/Cruise/Singapore Cruise.webp'
  },
  {
    id: '14',
    title: 'South Pacific & Tahitian Island Voyage',
    liner: 'Paul Gauguin Cruises',
    route: 'Papeete • Bora Bora • Moorea • Raiatea',
    duration: '7 Nights / 8 Days',
    price: '$1,499',
    discount: 'HONEYMOON DEAL',
    rating: 5.0,
    perks: ['Private Beach Access', 'Overwater Bungalow Stay Option', 'Champagne Welcome'],
    image: '/Images/Cruise/South Pacific Cruises.webp'
  },
  {
    id: '15',
    title: 'Western Europe & Atlantic Coast Cruise',
    liner: 'Cunard Line',
    route: 'Southampton • Lisbon • Cadiz • Gibraltar • Oporto',
    duration: '8 Nights / 9 Days',
    price: '$949',
    discount: 'BEST VALUE',
    rating: 4.8,
    perks: ['Gala Dinner Night', 'Afternoon Tea Pass', 'Port Excursions'],
    image: '/Images/Cruise/Westren Europe Cruise.webp'
  }
];

interface CruiseDestinationsProps {
  onExplore?: () => void;
}

const CruiseDestinations: React.FC<CruiseDestinationsProps> = ({ onExplore }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 md:py-9 bg-slate-50/70 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Exact Requested Title & Subtitle */}
        <ScrollReveal delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Top Cruise Destinations
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-3xl">
                Experience breathtaking ports, crystal-clear waters, and unforgettable cruise trips filled with adventure.
              </p>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
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

        {/* Cruise Destinations Horizontal Cards Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-1 snap-x snap-mandatory scroll-smooth"
        >
          {CRUISE_DESTINATIONS.map((cruise, index) => (
            <ScrollReveal
              key={cruise.id}
              delay={Math.min(index * 120, 600)}
              className="snap-start shrink-0"
            >
              <div className="w-[276px] sm:w-[316px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                
                {/* Cruise Image Header */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={cruise.image}
                    alt={cruise.title}
                    fill
                    sizes="(max-width: 640px) 276px, 316px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                  
                  {/* Liner Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/40 shadow-xs">
                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{cruise.liner}</span>
                  </div>
                  
                  {/* Duration Tag */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-white text-xs font-bold">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{cruise.duration}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-white text-[11px] font-bold">
                    <span className="text-amber-400">★</span>
                    <span>{cruise.rating}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {cruise.title}
                    </h3>
                    
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-bold line-clamp-1 mb-3">
                      📍 {cruise.route}
                    </p>

                    {/* Perks List */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cruise.perks.map((perk, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting From</span>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">{cruise.price}</span>
                      <span className="text-[10px] text-slate-400 font-medium"> / person</span>
                    </div>

                    <button
                      onClick={() => {
                        const searchInput = document.querySelector('input[name="from"]');
                        if (searchInput instanceof HTMLElement) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          searchInput.focus();
                        } else if (onExplore) {
                          onExplore();
                        }
                      }}
                      className="bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-1"
                    >
                      <span>Book Cruise</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>

                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default React.memo(CruiseDestinations);
