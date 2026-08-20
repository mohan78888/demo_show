"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Carousel from './ui/Carousel';
import { convertINR, getSavedCurrency, CurrencyOption } from '../lib/currency';

export interface CheapestFlightCard {
  id: string;
  name: string;
  destination: string;
  route: string;
  dates: string;
  price: string;
  rawPrice: number;
  typicalCost: string;
  tripType: string;
  image: string;
  badge?: string;
}

const CHEAPEST_FLIGHTS: CheapestFlightCard[] = [
  {
    id: '1',
    name: 'London Return Fare',
    destination: 'London, UK',
    route: 'NYC – LHR',
    dates: 'Oct 20 – Oct 28',
    price: 'From $649',
    rawPrice: 649,
    typicalCost: '$1,029 – $1,377',
    tripType: 'Round Trip',
    badge: '🔥 Best Seller',
    image: '/Images/Flight/London Retun Fare.webp'
  },
  {
    id: '2',
    name: 'Paris Return Fare',
    destination: 'Paris, France',
    route: 'NYC – CDG',
    dates: 'Nov 02 – Nov 10',
    price: 'From $619',
    rawPrice: 619,
    typicalCost: '$980 – $1,250',
    tripType: 'Round Trip',
    badge: '✨ Popular',
    image: '/Images/Flight/paris return fare.webp'
  },
  {
    id: '3',
    name: 'Rome Return Fare',
    destination: 'Rome, Italy',
    route: 'NYC – FCO',
    dates: 'Oct 15 – Oct 24',
    price: 'From $589',
    rawPrice: 589,
    typicalCost: '$920 – $1,180',
    tripType: 'Round Trip',
    image: '/Images/Flight/Rome Retun Fare.webp'
  },
  {
    id: '4',
    name: 'Cancun Return Fare',
    destination: 'Cancun, Mexico',
    route: 'MIA – CUN',
    dates: 'Nov 12 – Nov 18',
    price: 'From $479',
    rawPrice: 479,
    typicalCost: '$750 – $990',
    tripType: 'Round Trip',
    badge: '🌴 Beach Deal',
    image: '/Images/Flight/Cancun Retun Fare.webp'
  },
  {
    id: '5',
    name: 'Sint Maarten Return Fare',
    destination: 'Sint Maarten',
    route: 'MIA – SXM',
    dates: 'Dec 01 – Dec 08',
    price: 'From $569',
    rawPrice: 569,
    typicalCost: '$890 – $1,100',
    tripType: 'Round Trip',
    image: '/Images/Flight/Sint Maarten Retun Fare.webp'
  },
  {
    id: '6',
    name: 'Tokyo Return Fare',
    destination: 'Tokyo, Japan',
    route: 'LAX – HND',
    dates: 'Oct 28 – Nov 06',
    price: 'From $799',
    rawPrice: 799,
    typicalCost: '$1,350 – $1,750',
    tripType: 'Round Trip',
    badge: '⚡ Low Price',
    image: '/Images/Flight/Tokyo Retun Fare.webp'
  },
  {
    id: '7',
    name: 'Dubai Return Fare',
    destination: 'Dubai, UAE',
    route: 'NYC – DXB',
    dates: 'Nov 05 – Nov 14',
    price: 'From $549',
    rawPrice: 549,
    typicalCost: '$950 – $1,300',
    tripType: 'Round Trip',
    image: '/Images/Flight/Dubai Retun Fare.webp'
  },
  {
    id: '8',
    name: 'Beijing Return Fare',
    destination: 'Beijing, China',
    route: 'SFO – PEK',
    dates: 'Oct 18 – Oct 27',
    price: 'From $689',
    rawPrice: 689,
    typicalCost: '$1,150 – $1,500',
    tripType: 'Round Trip',
    image: '/Images/Flight/Beijing Retun Fare.webp'
  },
  {
    id: '9',
    name: 'Seoul Return Fare',
    destination: 'Seoul, South Korea',
    route: 'LAX – ICN',
    dates: 'Nov 10 – Nov 19',
    price: 'From $739',
    rawPrice: 739,
    typicalCost: '$1,200 – $1,600',
    tripType: 'Round Trip',
    image: '/Images/Flight/Seoul Retun Fare.webp'
  },
  {
    id: '10',
    name: 'Hong Kong Return Fare',
    destination: 'Hong Kong',
    route: 'SFO – HKG',
    dates: 'Nov 08 – Nov 17',
    price: 'From $659',
    rawPrice: 659,
    typicalCost: '$1,100 – $1,450',
    tripType: 'Round Trip',
    image: '/Images/Flight/Hongkong Retun Fare.webp'
  },
  {
    id: '11',
    name: 'Singapore Return Fare',
    destination: 'Singapore',
    route: 'SFO – SIN',
    dates: 'Oct 22 – Oct 31',
    price: 'From $699',
    rawPrice: 699,
    typicalCost: '$1,180 – $1,550',
    tripType: 'Round Trip',
    badge: '🌟 Top Pick',
    image: '/Images/Flight/Singapore Retun Fare.webp'
  },
  {
    id: '12',
    name: 'Sydney Return Fare',
    destination: 'Sydney, Australia',
    route: 'LAX – SYD',
    dates: 'Nov 14 – Nov 26',
    price: 'From $989',
    rawPrice: 989,
    typicalCost: '$1,550 – $2,100',
    tripType: 'Round Trip',
    image: '/Images/Flight/Sydney Retun Fare.webp'
  },
  {
    id: '13',
    name: 'Auckland Return Fare',
    destination: 'Auckland, NZ',
    route: 'LAX – AKL',
    dates: 'Dec 02 – Dec 14',
    price: 'From $1,149',
    rawPrice: 1149,
    typicalCost: '$1,780 – $2,350',
    tripType: 'Round Trip',
    image: '/Images/Flight/Auckland Retun Fare.webp'
  },
  {
    id: '14',
    name: 'Santo Domingo Return Fare',
    destination: 'Santo Domingo',
    route: 'MIA – SDQ',
    dates: 'Nov 15 – Nov 22',
    price: 'From $529',
    rawPrice: 529,
    typicalCost: '$820 – $1,050',
    tripType: 'Round Trip',
    image: '/Images/Flight/Santo Domingo Retun Fare.webp'
  },
  {
    id: '15',
    name: 'Cape Town Return Fare',
    destination: 'Cape Town, SA',
    route: 'NYC – CPT',
    dates: 'Nov 18 – Nov 29',
    price: 'From $929',
    rawPrice: 929,
    typicalCost: '$1,480 – $1,980',
    tripType: 'Round Trip',
    badge: '🦁 Adventure',
    image: '/Images/Flight/Capetown Retun Fare.webp'
  }
];

interface CheapestFlightsProps {
  onSelectFlight?: (flightName: string) => void;
}

const CheapestFlights: React.FC<CheapestFlightsProps> = ({ onSelectFlight }) => {
  const [currency, setCurrency] = useState<CurrencyOption>(getSavedCurrency);

  useEffect(() => {
    const handleCurrencyChange = () => setCurrency(getSavedCurrency());
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  return (
    <section className="py-6 md:py-9 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <Carousel
          title="Cheapest Flights Every Day"
          subtitle="Real-time lowest airline rates updated every 60 seconds with exclusive Tour Help Desk discounts."
          scrollAmount={340}
        >
          {CHEAPEST_FLIGHTS.map((flight) => {
            const convertedPrice = convertINR(flight.rawPrice * 87.5, currency.code);

            return (
              <motion.div
                key={flight.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  const searchInput = document.querySelector('input[name="from"]');
                  if (searchInput instanceof HTMLElement) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    searchInput.focus();
                  } else if (onSelectFlight) {
                    onSelectFlight(flight.name);
                  }
                }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:shadow-none border border-slate-100 dark:border-slate-800/80 group cursor-pointer flex flex-col h-full select-none"
              >
                {/* Image Container with Badges */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={flight.image}
                    alt={flight.name}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Route Pill */}
                  <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-800 dark:text-white shadow-sm flex items-center gap-1.5 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    <span>{flight.route}</span>
                  </div>

                  {/* Optional Tag Badge */}
                  {flight.badge && (
                    <div className="absolute top-3.5 right-3.5 bg-[#E8A11A] text-slate-900 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                      {flight.badge}
                    </div>
                  )}

                  {/* Dates Overlay */}
                  <div className="absolute bottom-3 left-3.5 text-white/90 text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                    <svg className="w-3.5 h-3.5 text-[#E8A11A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{flight.dates}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    {/* Market Comparison Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>Similar flights: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{flight.typicalCost}</strong></span>
                        <span className="cursor-help text-slate-400" title="Based on historical search data">ⓘ</span>
                      </div>

                      {/* Price Gauge Bar */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-emerald-600 dark:border-t-emerald-400 mb-0.5 animate-bounce"></div>
                        <div className="flex h-1.5 w-7 rounded-full overflow-hidden gap-[1px]">
                          <div className="w-1/3 bg-emerald-500 rounded-l-full"></div>
                          <div className="w-1/3 bg-amber-400"></div>
                          <div className="w-1/3 bg-rose-500 rounded-r-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Flight Name & Details */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {flight.name}
                        </h3>
                      </div>

                      {/* Price Box */}
                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform">
                          From {currency.symbol}{convertedPrice.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase tracking-wider mt-0.5">
                          {flight.tripType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Lowest Available
                    </span>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Book Now →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
};

export default React.memo(CheapestFlights);
