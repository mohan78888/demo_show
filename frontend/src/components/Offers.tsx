"use client";

import React from 'react';
import ScrollReveal from './ScrollReveal';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export interface DetailedOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  discountBadge: string;
  code: string;
  expiry: string;
  category: 'all' | 'flights' | 'hotels' | 'resorts' | 'packages';
}

const EXCLUSIVE_OFFERS: DetailedOffer[] = [
  {
    id: '1',
    title: 'Maldives Overwater Resort',
    tagline: 'Villas & Spa',
    description: '40% OFF private pool villas + free seaplane transfer',
    discountBadge: '40% OFF',
    code: 'MALDIVES40',
    expiry: 'App-only ⓘ',
    category: 'resorts',
  },
  {
    id: '2',
    title: 'European Multi-City Pass',
    tagline: 'London • Paris • Rome',
    description: 'Flat $450 OFF long-haul flights + Eurail pass',
    discountBadge: '$450 OFF',
    code: 'EUROPE450',
    expiry: 'Flights & Rail ⓘ',
    category: 'flights',
  },
  {
    id: '3',
    title: 'Swiss Alps Ski Chalet',
    tagline: 'Zermatt Resort',
    description: 'Save $600 on 7-night all-inclusive chalet stay',
    discountBadge: 'SAVE $600',
    code: 'SWISSALPS',
    expiry: 'Winter Pass ⓘ',
    category: 'hotels',
  },
  {
    id: '4',
    title: 'Bali Tropical Haven Stay',
    tagline: 'Ubud & Seminyak',
    description: 'Buy 1 Get 1 Free private pool villa stay',
    discountBadge: 'BUY 1 GET 1',
    code: 'BALIVILLA',
    expiry: 'Exclusive ⓘ',
    category: 'packages',
  },
  {
    id: '5',
    title: 'Kyoto Cherry Blossom Tour',
    tagline: 'Japan Direct',
    description: '20% OFF Japan flights + Bullet train pass',
    discountBadge: '20% OFF',
    code: 'KYOTO2026',
    expiry: 'Seasonal ⓘ',
    category: 'flights',
  },
  {
    id: '6',
    title: 'Santorini Cliffside Cave Suites',
    tagline: 'Greek Isles',
    description: 'Save $350 on Oia suites with infinity jacuzzi',
    discountBadge: '$350 OFF',
    code: 'SANTORINI35',
    expiry: 'Hotels & Homes ⓘ',
    category: 'hotels',
  },
  {
    id: '7',
    title: 'Dubai Desert & Skyline Package',
    tagline: 'Luxury Safari',
    description: '30% OFF Burj Khalifa suite & helicopter tour',
    discountBadge: '30% OFF',
    code: 'DUBAISKY',
    expiry: 'Attractions ⓘ',
    category: 'packages',
  },
  {
    id: '8',
    title: 'Paris Romance & Dining',
    tagline: 'Eiffel View',
    description: 'Save $500 on 5-night boutique stay + Louvre pass',
    discountBadge: 'SAVE $500',
    code: 'PARIS500',
    expiry: 'Boutique Stay ⓘ',
    category: 'hotels',
  },
  {
    id: '9',
    title: 'Canadian Rockies Banff Express',
    tagline: 'Banff & Lake Louise',
    description: '$300 cashback on Canada flights + mountain lodge',
    discountBadge: '$300 BACK',
    code: 'BANFF300',
    expiry: 'Flights & Stay ⓘ',
    category: 'flights',
  },
  {
    id: '10',
    title: 'Maui Island Hopping & Car',
    tagline: 'Hawaii Convertible',
    description: 'Save $400 on Hawaii flights + Mustang rental',
    discountBadge: 'SAVE $400',
    code: 'HAWAII400',
    expiry: 'Flight & Drive ⓘ',
    category: 'packages',
  },
  {
    id: '11',
    title: 'Amalfi Coast Positano Yacht',
    tagline: 'Italian Riviera',
    description: '25% OFF cliffside suite + private yacht tour',
    discountBadge: '25% OFF',
    code: 'AMALFI25',
    expiry: 'Resort & Yacht ⓘ',
    category: 'resorts',
  },
  {
    id: '12',
    title: 'Tokyo City & Mt. Fuji Tour',
    tagline: 'Shinjuku Stay',
    description: '$350 OFF Tokyo flights + digital art museum pass',
    discountBadge: '$350 OFF',
    code: 'TOKYO350',
    expiry: 'Flights & Hotel ⓘ',
    category: 'flights',
  },
  {
    id: '13',
    title: 'Iceland Glass Igloo & Aurora',
    tagline: 'Thermal Springs',
    description: 'Save $500 on glass dome igloo & glacier hike',
    discountBadge: 'SAVE $500',
    code: 'AURORA500',
    expiry: 'Special Stay ⓘ',
    category: 'hotels',
  },
  {
    id: '14',
    title: 'Mykonos & Naxos Island Ferry',
    tagline: 'Aegean Cruise',
    description: '35% OFF express ferry + beachfront resort stay',
    discountBadge: '35% OFF',
    code: 'GREECE35',
    expiry: 'Island Cruise ⓘ',
    category: 'packages',
  },
  {
    id: '15',
    title: 'Serengeti Safari & Luxury Camp',
    tagline: 'Tanzania Safari',
    description: 'Save $700 on Serengeti luxury tented camp stay',
    discountBadge: 'SAVE $700',
    code: 'SAFARI700',
    expiry: 'Safari Deal ⓘ',
    category: 'resorts',
  }
];

const categoryIconMap: Record<string, string> = {
  flights: '✈️',
  hotels: '🏨',
  resorts: '🏝️',
  packages: '🧳',
  all: '🏷️'
};

interface OffersProps {
  onSeeAll?: () => void;
}

const Offers: React.FC<OffersProps> = ({ onSeeAll }) => {
  const { copiedText, copy } = useCopyToClipboard(2000);
  const { containerRef, scrollLeft, scrollRight } = useHorizontalScroll<HTMLDivElement>(320);

  return (
    <section className="py-10 md:py-14 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Compact Section Header */}
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
          {EXCLUSIVE_OFFERS.map((offer, index) => (
            <ScrollReveal
              key={offer.id}
              delay={Math.min(index * 120, 600)}
              className="snap-start shrink-0"
            >
              <div className="w-[280px] sm:w-[310px] min-h-[172px] bg-white dark:bg-slate-900 rounded-2xl border border-[#F8FAFC] dark:border-slate-800 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 tracking-tight">
                    {offer.discountBadge}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>{categoryIconMap[offer.category] || '🏷️'}</span>
                    <span>{offer.expiry}</span>
                  </div>
                </div>

                <div className="my-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal line-clamp-2 mt-0.5 leading-snug">
                    {offer.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                  <button
                    onClick={() => copy(offer.code)}
                    className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    title="Copy Promo Code"
                  >
                    {copiedText === offer.code ? 'Copied!' : offer.code}
                  </button>

                  <button
                    onClick={() => {
                      const searchInput = document.querySelector('input[name="from"]');
                      if (searchInput instanceof HTMLElement) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        searchInput.focus();
                      } else if (onSeeAll) {
                        onSeeAll();
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Claim deal
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default React.memo(Offers);
