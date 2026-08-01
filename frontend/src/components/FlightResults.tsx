import React, { useState } from 'react';
import { Flight } from '../types';
import { useRouter } from 'next/navigation';

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

  if (!flights || flights.length === 0) return null;

  const minPrice = Math.min(...flights.map(f => f.price));
  const visibleFlights = flights.slice(0, displayCount);
  const hasMore = displayCount < flights.length;

  const handleViewMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, flights.length));
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
        {flights.length > initialLimit && (
          <button 
            onClick={handleNavigateToFlightsPage}
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Flights Page</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        )}
      </div>

      {/* Flight Cards List */}
      {visibleFlights.map((flight) => {
        const isCheapest = flight.price === minPrice;
        return (
          <div 
            key={flight.id} 
            className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-0.5 ${
              isCheapest ? 'border-orange-200 dark:border-orange-900/50 ring-1 ring-orange-100 dark:ring-0' : 'border-slate-100 dark:border-slate-800'
            }`}
          >
            {isCheapest && (
              <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm z-10">
                Cheapest Deal
              </div>
            )}

            <div className="p-3 md:p-4 flex flex-col md:flex-row items-stretch gap-3 md:gap-5">
              {/* Flight Info */}
              <div className="flex-grow flex flex-col justify-center gap-3">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
                  {/* Airline Name & Class */}
                  <div className="flex items-center gap-3 w-full md:w-1/4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm md:text-base">
                        {flight.airline}
                      </h4>
                      <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {flight.flightNumber || flight.class}
                      </p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center justify-between gap-3 md:gap-5 flex-grow w-full md:w-auto">
                    <div className="text-center md:text-left min-w-[70px]">
                      <span className="text-base md:text-lg font-bold text-slate-800 dark:text-white">{flight.departureTime}</span>
                      <p className="text-[10px] md:text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{flight.origin}</p>
                    </div>

                    <div className="flex flex-col items-center flex-grow px-4">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-tighter">{flight.duration}</span>
                      <div className="w-full h-[2px] bg-slate-100 dark:bg-slate-800 relative rounded-full">
                        <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 group-hover:scale-125 transition-transform">
                          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
                          </svg>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 mt-2 uppercase tracking-widest">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</span>
                    </div>

                    <div className="text-center md:text-right min-w-[70px]">
                      <span className="text-base md:text-lg font-bold text-slate-800 dark:text-white">{flight.arrivalTime}</span>
                      <p className="text-[10px] md:text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{flight.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Baggage & Refundable Tag */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-1 w-full flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      🧳 Baggage: <strong className="text-slate-900 dark:text-white font-extrabold">{flight.baggage || '15 KG'}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                      {flight.refundable ? 'Refundable Fares' : 'Standard Fare'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Booking CTA */}
              <div className="w-full md:w-1/4 lg:w-1/5 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl -mx-3 -mb-3 px-3 md:mx-0 md:mb-0 pb-3 md:pb-0">
                <div className="mb-0 md:mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">INR</span>
                    <span className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">₹{flight.price.toLocaleString()}</span>
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
