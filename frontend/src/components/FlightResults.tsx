import React, { useState, useEffect } from 'react';
import { Flight } from '../types';
import { useRouter } from 'next/navigation';
import { convertINR, getSavedCurrency, CURRENCIES, CurrencyOption } from '../lib/currency';

interface FlightResultsProps {
  flights: Flight[];
  onBook: (flight: Flight) => void;
  initialLimit?: number;
  searchParams?: any;
  verifyingFlightId?: string | null;
}

const FlightResults: React.FC<FlightResultsProps> = ({ 
  flights, 
  onBook, 
  initialLimit = 6,
  searchParams,
  verifyingFlightId = null,
}) => {
  const router = useRouter();
  const [displayCount, setDisplayCount] = useState<number>(initialLimit);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

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

  const toggleExpand = (flightId: string) => {
    setExpandedFlightId((prev) => (prev === flightId ? null : flightId));
  };

  return (
    <div className="space-y-4">
      {/* Header Result Count Summary */}
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="text-blue-600 dark:text-blue-400 font-extrabold">{visibleFlights.length}</span> of <span className="text-slate-900 dark:text-white font-extrabold">{flights.length}</span> flights
        </p>
      </div>

      {/* Flight Cards List */}
      {visibleFlights.map((flight) => {
        const isLowestPrice = flight.price === minPrice;
        const isVerifying = verifyingFlightId === flight.id;
        const isExpanded = expandedFlightId === flight.id;
        const airlineCode = flight.airlineCode || flight.flightNumber?.split('-')?.[0] || '6E';

        return (
          <div
            key={flight.id}
            className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
              isLowestPrice
                ? 'border-blue-300 dark:border-blue-800/80 shadow-xs ring-1 ring-blue-400/20'
                : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
            }`}
          >
            {isLowestPrice && (
              <div className="absolute top-0 left-6 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-0.5 rounded-b-md shadow-xs">
                Cheapest Deal
              </div>
            )}

            <div className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* 1. Airline Info */}
                <div className="flex items-center gap-3 w-full lg:w-48 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700 p-1.5">
                    <img
                      src={`https://images.kiwi.com/airlines/64x64/${airlineCode}.png`}
                      alt={flight.airline}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://pics.avs.io/64/64/${airlineCode}.png`;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {flight.airline}
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      {flight.flightNumber || `${airlineCode}-Flight`}
                    </p>
                  </div>
                </div>

                {/* 2. Schedule & Route Timeline */}
                <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4 px-1 sm:px-4">
                  {/* Departure */}
                  <div className="text-left min-w-[75px]">
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
                      {flight.departureTime}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase block mt-0.5">
                      {flight.origin}
                    </span>
                  </div>

                  {/* Flight Route Visual with Duration & Stops */}
                  <div className="flex flex-col items-center flex-1 max-w-[160px] sm:max-w-[200px] px-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {flight.duration}
                    </span>
                    <div className="w-full flex items-center gap-1 relative">
                      <div className="h-[2px] w-full bg-slate-300 dark:bg-slate-700 relative rounded-full flex items-center justify-center">
                        {flight.stops > 0 ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 shrink-0" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap justify-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        flight.stops === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                      </span>
                      {flight.layovers && flight.layovers.length > 0 && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          via {flight.layovers.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right min-w-[75px]">
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
                      {flight.arrivalTime}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase block mt-0.5">
                      {flight.destination}
                    </span>
                  </div>
                </div>

                {/* 3. Class & Baggage Badges */}
                <div className="hidden xl:flex flex-col gap-1 items-end w-32 shrink-0">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {flight.class}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <span>🧳</span> {flight.baggage || '15 KG included'}
                  </span>
                  <span className={`text-[10px] font-bold ${flight.refundable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {flight.refundable ? 'Refundable' : 'Standard Fare'}
                  </span>
                </div>

                {/* 4. Price & CTA Button */}
                <div className="w-full lg:w-44 shrink-0 flex flex-row lg:flex-col items-center justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-5">
                  <div className="lg:mb-2 text-left lg:text-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{currency.code}</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {currency.symbol}{convertINR(flight.price, currency.code).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">per traveler</p>
                  </div>

                  <button 
                    disabled={isVerifying}
                    onClick={() => onBook(flight)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-2.5 text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Select Flight</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Quick Row: Expand Flight Details Toggle */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="text-blue-500 font-bold">✓</span> {flight.seatsAvailable || 'Seats Available'}
                  </span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                  <span className="hidden sm:flex items-center gap-1 text-[11px]">
                    <span>🧳</span> {flight.baggage || '15 KG'}
                  </span>
                </div>

                <button
                  onClick={() => toggleExpand(flight.id)}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Details' : 'Flight Details'}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Expandable Flight Segments & Details Accordion */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 sm:p-4 text-xs">
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 mb-2.5">
                    Itinerary Segments & Layover Details
                  </h5>

                  {flight.segments && flight.segments.length > 0 ? (
                    <div className="space-y-3">
                      {flight.segments.map((seg, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Segment {idx + 1}:</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">{seg.origin} → {seg.destination}</span>
                            <span className="text-slate-400 dark:text-slate-500">({seg.airline} {seg.flightNumber})</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                            <span>Dep: <strong>{seg.departureTime}</strong></span>
                            <span>Arr: <strong>{seg.arrivalTime}</strong></span>
                            {seg.duration && <span className="text-slate-400 font-mono">({seg.duration})</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                      <span>Direct flight from <strong>{flight.origin}</strong> to <strong>{flight.destination}</strong></span>
                      <span className="text-slate-500 font-mono">{flight.duration}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                    <div><strong>Baggage:</strong> {flight.baggage || '15 KG check-in included'}</div>
                    <div><strong>Refundable:</strong> {flight.refundable ? 'Yes (charges apply)' : 'No'}</div>
                    <div><strong>Travel Class:</strong> {flight.class}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* View More Flights */}
      {hasMore && (
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleViewMore}
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View More Flights ({flights.length - displayCount} Remaining)</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;

