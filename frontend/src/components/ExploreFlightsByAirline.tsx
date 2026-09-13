"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AirlineFlightDeal {
  id: number;
  airline: string;
  iataCode: string;
  flightNumber: string;
  destination: string;
  destCode: string;
  destName: string;
  origin: string;
  originCode: string;
  originName: string;
  departureTime: string;
  arrivalTime: string;
  flightDate: string;
  duration: string;
  rawPrice: number;
}

export const AIRLINE_FLIGHTS_DATA: AirlineFlightDeal[] = [
  {
    id: 1,
    airline: "American Airlines",
    iataCode: "AA",
    flightNumber: "AA104",
    destination: "Chicago",
    destCode: "ORD",
    destName: "O'Hare Airport",
    origin: "New York",
    originCode: "JFK",
    originName: "John F. Kennedy",
    departureTime: "8:15 AM",
    arrivalTime: "10:05 AM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 50 min.",
    rawPrice: 189
  },
  {
    id: 2,
    airline: "Aeroméxico",
    iataCode: "AM",
    flightNumber: "AM532",
    destination: "Cancun",
    destCode: "CUN",
    destName: "Cancun Intl Airport",
    origin: "Mexico City",
    originCode: "MEX",
    originName: "Benito Juárez Intl",
    departureTime: "9:30 AM",
    arrivalTime: "12:45 PM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 15 min.",
    rawPrice: 165
  },
  {
    id: 3,
    airline: "Air Canada",
    iataCode: "AC",
    flightNumber: "AC1792",
    destination: "Nassau",
    destCode: "NAS",
    destName: "Lynden Pindling Intl",
    origin: "Toronto",
    originCode: "YYZ",
    originName: "Pearson Intl",
    departureTime: "7:45 AM",
    arrivalTime: "11:15 AM",
    flightDate: "Monday, May 15",
    duration: "3 hours, 30 min.",
    rawPrice: 289
  },
  {
    id: 4,
    airline: "Air New Zealand",
    iataCode: "NZ",
    flightNumber: "NZ104",
    destination: "Auckland",
    destCode: "AKL",
    destName: "Auckland Airport",
    origin: "Sydney",
    originCode: "SYD",
    originName: "Kingsford Smith",
    departureTime: "10:00 AM",
    arrivalTime: "3:15 PM",
    flightDate: "Monday, May 15",
    duration: "3 hours, 15 min.",
    rawPrice: 325
  },
  {
    id: 5,
    airline: "TAP Air Portugal",
    iataCode: "TP",
    flightNumber: "TP1013",
    destination: "Lisbon",
    destCode: "LIS",
    destName: "Humberto Delgado",
    origin: "Madrid",
    originCode: "MAD",
    originName: "Barajas Airport",
    departureTime: "11:15 AM",
    arrivalTime: "11:40 AM",
    flightDate: "Monday, May 15",
    duration: "1 hour, 25 min.",
    rawPrice: 119
  },
  {
    id: 6,
    airline: "Alaska Airlines",
    iataCode: "AS",
    flightNumber: "AS129",
    destination: "Anchorage",
    destCode: "ANC",
    destName: "Ted Stevens Anchorage",
    origin: "Seattle",
    originCode: "SEA",
    originName: "Seattle-Tacoma Intl",
    departureTime: "6:40 AM",
    arrivalTime: "9:25 AM",
    flightDate: "Monday, May 15",
    duration: "3 hours, 45 min.",
    rawPrice: 249
  },
  {
    id: 7,
    airline: "British Airways",
    iataCode: "BA",
    flightNumber: "BA178",
    destination: "London",
    destCode: "LHR",
    destName: "Heathrow Airport",
    origin: "New York",
    originCode: "JFK",
    originName: "John F. Kennedy",
    departureTime: "8:30 AM",
    arrivalTime: "8:45 PM",
    flightDate: "Monday, May 15",
    duration: "7 hours, 15 min.",
    rawPrice: 549
  },
  {
    id: 8,
    airline: "Cathay Pacific",
    iataCode: "CX",
    flightNumber: "CX543",
    destination: "Hong Kong",
    destCode: "HKG",
    destName: "Hong Kong Intl",
    origin: "Tokyo",
    originCode: "HND",
    originName: "Haneda Airport",
    departureTime: "10:15 AM",
    arrivalTime: "2:10 PM",
    flightDate: "Monday, May 15",
    duration: "4 hours, 55 min.",
    rawPrice: 415
  },
  {
    id: 9,
    airline: "Delta Air Lines",
    iataCode: "DL",
    flightNumber: "DL1420",
    destination: "Atlanta",
    destCode: "ATL",
    destName: "Hartsfield-Jackson",
    origin: "Boston",
    originCode: "BOS",
    originName: "Logan Intl Airport",
    departureTime: "7:15 AM",
    arrivalTime: "10:05 AM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 50 min.",
    rawPrice: 195
  },
  {
    id: 10,
    airline: "Emirates",
    iataCode: "EK",
    flightNumber: "EK256",
    destination: "Dubai",
    destCode: "DXB",
    destName: "Dubai Intl Airport",
    origin: "Frankfurt",
    originCode: "FRA",
    originName: "Frankfurt Airport",
    departureTime: "6:30 AM",
    arrivalTime: "11:45 AM",
    flightDate: "Monday, May 15",
    duration: "6 hours, 15 min.",
    rawPrice: 589
  },
  {
    id: 11,
    airline: "Etihad Airways",
    iataCode: "EY",
    flightNumber: "EY032",
    destination: "Abu Dhabi",
    destCode: "AUH",
    destName: "Zayed Intl Airport",
    origin: "Paris",
    originCode: "CDG",
    originName: "Charles de Gaulle",
    departureTime: "10:45 AM",
    arrivalTime: "7:20 PM",
    flightDate: "Monday, May 15",
    duration: "6 hours, 35 min.",
    rawPrice: 580
  },
  {
    id: 12,
    airline: "Frontier Airlines",
    iataCode: "F9",
    flightNumber: "F91218",
    destination: "Miami",
    destCode: "MIA",
    destName: "Miami Intl Airport",
    origin: "Philadelphia",
    originCode: "PHL",
    originName: "Philadelphia Intl",
    departureTime: "6:15 AM",
    arrivalTime: "9:10 AM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 55 min.",
    rawPrice: 79
  },
  {
    id: 13,
    airline: "Hawaiian Airlines",
    iataCode: "HA",
    flightNumber: "HA003",
    destination: "Honolulu",
    destCode: "HNL",
    destName: "Daniel K. Inouye",
    origin: "Los Angeles",
    originCode: "LAX",
    originName: "Los Angeles Intl",
    departureTime: "9:00 AM",
    arrivalTime: "12:10 PM",
    flightDate: "Monday, May 15",
    duration: "5 hours, 10 min.",
    rawPrice: 289
  },
  {
    id: 14,
    airline: "Iberia",
    iataCode: "IB",
    flightNumber: "IB3251",
    destination: "Madrid",
    destCode: "MAD",
    destName: "Adolfo Suárez Barajas",
    origin: "Rome",
    originCode: "FCO",
    originName: "Fiumicino Airport",
    departureTime: "12:20 PM",
    arrivalTime: "2:55 PM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 35 min.",
    rawPrice: 135
  },
  {
    id: 15,
    airline: "Japan Airlines",
    iataCode: "JL",
    flightNumber: "JL001",
    destination: "Tokyo",
    destCode: "HND",
    destName: "Haneda Airport",
    origin: "San Francisco",
    originCode: "SFO",
    originName: "San Francisco Intl",
    departureTime: "4:30 PM",
    arrivalTime: "7:55 PM",
    flightDate: "Monday, May 15",
    duration: "10 hours, 25 min.",
    rawPrice: 745
  },
  {
    id: 16,
    airline: "Korean Air",
    iataCode: "KE",
    flightNumber: "KE012",
    destination: "Seoul",
    destCode: "ICN",
    destName: "Incheon Intl Airport",
    origin: "Los Angeles",
    originCode: "LAX",
    originName: "Los Angeles Intl",
    departureTime: "11:30 PM",
    arrivalTime: "5:00 AM",
    flightDate: "Monday, May 15",
    duration: "12 hours, 30 min.",
    rawPrice: 790
  },
  {
    id: 17,
    airline: "JetBlue Airways",
    iataCode: "B6",
    flightNumber: "B6452",
    destination: "Boston",
    destCode: "BOS",
    destName: "Logan Intl Airport",
    origin: "Orlando",
    originCode: "MCO",
    originName: "Orlando Intl Airport",
    departureTime: "8:00 AM",
    arrivalTime: "10:55 AM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 55 min.",
    rawPrice: 145
  },
  {
    id: 18,
    airline: "KLM",
    iataCode: "KL",
    flightNumber: "KL1233",
    destination: "Paris",
    destCode: "CDG",
    destName: "Charles de Gaulle",
    origin: "Amsterdam",
    originCode: "AMS",
    originName: "Schiphol Airport",
    departureTime: "2:30 PM",
    arrivalTime: "3:50 PM",
    flightDate: "Monday, May 15",
    duration: "1 hour, 20 min.",
    rawPrice: 129
  },
  {
    id: 19,
    airline: "Lufthansa",
    iataCode: "LH",
    flightNumber: "LH178",
    destination: "Berlin",
    destCode: "BER",
    destName: "Brandenburg Airport",
    origin: "Frankfurt",
    originCode: "FRA",
    originName: "Frankfurt Airport",
    departureTime: "7:15 AM",
    arrivalTime: "8:25 AM",
    flightDate: "Monday, May 15",
    duration: "1 hour, 10 min.",
    rawPrice: 115
  },
  {
    id: 20,
    airline: "Qantas Airways",
    iataCode: "QF",
    flightNumber: "QF422",
    destination: "Sydney",
    destCode: "SYD",
    destName: "Kingsford Smith",
    origin: "Melbourne",
    originCode: "MEL",
    originName: "Tullamarine Airport",
    departureTime: "9:00 AM",
    arrivalTime: "10:25 AM",
    flightDate: "Monday, May 15",
    duration: "1 hour, 25 min.",
    rawPrice: 175
  },
  {
    id: 21,
    airline: "Singapore Airlines",
    iataCode: "SQ",
    flightNumber: "SQ939",
    destination: "Singapore",
    destCode: "SIN",
    destName: "Changi Airport",
    origin: "Bali",
    originCode: "DPS",
    originName: "Ngurah Rai Intl",
    departureTime: "11:55 AM",
    arrivalTime: "2:40 PM",
    flightDate: "Monday, May 15",
    duration: "2 hours, 45 min.",
    rawPrice: 198
  },
  {
    id: 22,
    airline: "Southwest Airlines",
    iataCode: "WN",
    flightNumber: "WN1845",
    destination: "Los Angeles",
    destCode: "LAX",
    destName: "Los Angeles Airport",
    origin: "Las Vegas",
    originCode: "LAS",
    originName: "Harry Reid Intl",
    departureTime: "1:20 PM",
    arrivalTime: "2:35 PM",
    flightDate: "Monday, May 15",
    duration: "1 hour, 15 min.",
    rawPrice: 89
  },
  {
    id: 23,
    airline: "Spirit Airlines",
    iataCode: "NK",
    flightNumber: "NK612",
    destination: "Austin",
    destCode: "AUS",
    destName: "Austin-Bergstrom",
    origin: "Fort Lauderdale",
    originCode: "FLL",
    originName: "Hollywood Intl",
    departureTime: "8:10 AM",
    arrivalTime: "10:20 AM",
    flightDate: "Monday, May 15",
    duration: "3 hours, 10 min.",
    rawPrice: 69
  },
  {
    id: 24,
    airline: "United Airlines",
    iataCode: "UA",
    flightNumber: "UA1453",
    destination: "Sint Maarten",
    destCode: "SXM",
    destName: "Princess Juliana Intl",
    origin: "New York",
    originCode: "EWR",
    originName: "Newark Liberty Intl",
    departureTime: "9:15 AM",
    arrivalTime: "1:45 PM",
    flightDate: "Monday, May 15",
    duration: "4 hours, 30 min.",
    rawPrice: 349
  }
];

export const AirlineFlightCard: React.FC<{ deal: AirlineFlightDeal }> = ({ deal }) => {
  const router = useRouter();

  const handleCardClick = () => {
    const today = new Date();
    const departDate = new Date(today);
    departDate.setDate(today.getDate() + 14);
    const dateStr = departDate.toISOString().split('T')[0];

    const params = new URLSearchParams({
      from: deal.originCode,
      to: deal.destCode,
      date: dateStr,
      class: 'Economy'
    });
    router.push(`/?${params.toString()}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* 1. Header: Logo + Airline Name & Flight Number */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-slate-700/60 p-0.5 shadow-xs">
          <img
            src={`https://images.kiwi.com/airlines/64x64/${deal.iataCode}.png`}
            alt={deal.airline}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://pics.avs.io/64/64/${deal.iataCode}.png`;
            }}
          />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
            {deal.airline}
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
            ({deal.flightNumber})
          </span>
        </div>
      </div>

      {/* 2. Middle Route Section */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
        {/* Origin */}
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none truncate block">
            {deal.originCode}
          </span>
          <span
            className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-1 block"
            title={`${deal.originName}, ${deal.originCode}`}
          >
            {deal.originName}, {deal.originCode}
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none truncate block">
            {deal.departureTime}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate block">
            {deal.flightDate}
          </span>
        </div>

        {/* Center Flight Route Line with Plane Icon (Guaranteed No-Overlap & Symmetrically Centered) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 w-16 sm:w-20">
          <div className="h-[1.5px] flex-1 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
          <div className="text-slate-600 dark:text-slate-300 shrink-0 group-hover:text-[#E8A11A] transition-colors">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300 group-hover:text-[#E8A11A] transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>
          <div className="h-[1.5px] flex-1 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
        </div>

        {/* Destination */}
        <div className="flex flex-col items-end min-w-0 flex-1 overflow-hidden text-right">
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none truncate block w-full text-right">
            {deal.destCode}
          </span>
          <span
            className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-1 block w-full text-right"
            title={`${deal.destName}, ${deal.destCode}`}
          >
            {deal.destName}, {deal.destCode}
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none truncate block w-full text-right">
            {deal.arrivalTime}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate block w-full text-right">
            {deal.flightDate}
          </span>
        </div>
      </div>

      {/* 3. Footer: Pill Badges + Price (Matching Screenshot) */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="px-2.5 py-1 rounded-md bg-[#EEF2FF] dark:bg-slate-800 text-[#4F46E5] dark:text-slate-300 text-[10px] font-bold">
            {deal.flightDate}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#EEF2FF] dark:bg-slate-800 text-[#4F46E5] dark:text-slate-300 text-[10px] font-bold">
            {deal.duration}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            ${deal.rawPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ExploreFlightsByAirline() {
  const [showAll, setShowAll] = useState(false);

  // Show 8 cards by default (2 rows on desktop), expandable to all 24
  const visibleDeals = showAll ? AIRLINE_FLIGHTS_DATA : AIRLINE_FLIGHTS_DATA.slice(0, 8);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8A11A] animate-pulse"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E8A11A]">Leading Global Carriers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Fly with your favorite airline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore popular destinations with leading airlines.
          </p>
        </div>

        <button
          onClick={() => setShowAll(prev => !prev)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#E8A11A] dark:hover:border-[#E8A11A] transition-all cursor-pointer flex items-center gap-2 group"
        >
          <span>{showAll ? "Show Less" : "View all 24 airlines"}</span>
          <svg
            className={`w-4 h-4 text-slate-400 group-hover:text-[#E8A11A] transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Grid: 4 per row on desktop, 3 on tablet, 1-2 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
        {visibleDeals.map((deal) => (
          <AirlineFlightCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}
