import React, { useState, useEffect } from 'react';
import { Flight } from '../types';
import { useRouter } from 'next/navigation';
import { convertINR, getSavedCurrency, CurrencyOption } from '../lib/currency';

interface FlightResultsProps {
  flights: Flight[];
  onBook: (flight: Flight) => void;
  initialLimit?: number;
  searchParams?: any;
}

const FlightResults: React.FC<FlightResultsProps> = ({ 
  flights, 
  onBook, 
  initialLimit = 6,
  searchParams 
}) => {
  const router = useRouter();
  const [displayCount, setDisplayCount] = useState<number>(initialLimit);
  const [currency, setCurrency] = useState<CurrencyOption>(getSavedCurrency);

  useEffect(() => {
    const updateCurrency = () => {
      setCurrency(getSavedCurrency());
    };
    updateCurrency();
    window.addEventListener('currency_change', updateCurrency);
    return () => window.removeEventListener('currency_change', updateCurrency);
  }, []);

  if (!flights || flights.length === 0) return null;

  const minPrice = Math.min(...flights.map(f => f.price));
  const visibleFlights = flights.slice(0, displayCount);
  const hasMore = displayCount < flights.length;

  const handleViewMore = () => {
    setDisplayCount((prev: number) => Math.min(prev + 6, flights.length));
  };

  const handleNavigateToFlightsPage = () => {
    if (searchParams) {
      const query = new URLSearchParams({
        from: searchParams.from || '',
        to: searchParams.to || '',
        date: searchParams.date || '',
        class: searchParams.travelClass || 'Economy',
      }).toString();
      router.push(`/flights?${query}`);
    } else {
      router.push('/flights');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Result Count Summary */}
      <div className="flex items-center justify-between px-1 mb-2">
        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
          Showing <span className="text-blue-600 dark:text-blue-400 font-extrabold">{visibleFlights.length}</span> of <span className="text-slate-900 dark:text-white font-extrabold">{flights.length}</span> available flights
        </p>
      </div>

      {/* Flight Cards List */}
      {visibleFlights.map((flight) => {
        const isLowestPrice = flight.price === minPrice;

        return (
          <div
            key={flight.id}
            className={`group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-xl relative ${
              isLowestPrice
                ? 'border-blue-300 dark:border-blue-800 shadow-md ring-1 ring-blue-400/30'
                : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700'
            }`}
          >
            {isLowestPrice && (
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-0.5 rounded-full shadow-sm">
                Best Deal
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Airline Brand & Info */}
              <div className="flex items-center gap-3 w-full md:w-1/4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs shrink-0 border border-blue-100 dark:border-slate-700 shadow-inner">
                  ✈
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight truncate">{flight.airline}</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{flight.flightNumber}</p>
                </div>
              </div>

              {/* Schedule & Route Timeline */}
              <div className="flex-1 w-full flex items-center justify-between md:justify-center gap-4 lg:gap-8 px-2">
                {/* Departure Time */}
                <div className="text-left">
                  <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">{flight.departureTime}</span>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">{flight.origin}</p>
                </div>

                {/* Duration & Stops Visual */}
                <div className="flex flex-col items-center min-w-[100px] sm:min-w-[120px]">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">{flight.duration}</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-700 relative">
                      {flight.stops > 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-400 border border-white dark:border-slate-900" />
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider mt-1 ${
                    flight.stops === 0 ? 'text-emerald-500' : 'text-orange-500'
                  }`}>
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>

                {/* Arrival Time */}
                <div className="text-right">
                  <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">{flight.arrivalTime}</span>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">{flight.destination}</p>
                </div>
              </div>

              {/* Flight Badges */}
              <div className="hidden lg:flex flex-col gap-1 items-end w-28">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  {flight.class}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  {flight.refundable ? 'Refundable' : 'Standard'}
                </span>
              </div>

              {/* Price & Booking CTA */}
              <div className="w-full md:w-1/4 lg:w-1/5 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl -mx-3 -mb-3 px-3 md:mx-0 md:mb-0 pb-3 md:pb-0">
                <div className="mb-0 md:mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">{currency.code}</span>
                    <span className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
                      {currency.symbol}{convertINR(flight.price, currency.code).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest text-left md:text-center mt-0.5">Per Traveler</p>
                </div>
                <button 
                  onClick={() => onBook(flight)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-orange-100 dark:shadow-none active:scale-95 group-hover:scale-105 w-auto md:w-full cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* TRIP.COM STYLE "VIEW MORE FLIGHTS" BUTTON BAR */}
      {hasMore && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleViewMore}
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>View More Flights ({flights.length - displayCount} Remaining)</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={handleNavigateToFlightsPage}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 dark:bg-slate-700 hover:bg-black text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Separate Flights Page →</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
