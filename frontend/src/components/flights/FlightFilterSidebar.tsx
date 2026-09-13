"use client";

import React, { useMemo } from 'react';
import { Flight, FlightFilterState } from '../../types';
import { convertINR, getSavedCurrency } from '../../lib/currency';

interface FlightFilterSidebarProps {
  flights: Flight[];
  filters: FlightFilterState;
  onFilterChange: (filters: FlightFilterState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

// Helper to parse time string like "09:30 AM" or "14:15" into hour (0-23)
export function parseTimeToHour(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const parts = clean.replace(/[APM\s]/g, '').split(':');
  let hour = parseInt(parts[0], 10) || 0;
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return hour;
}

export function getTimeSlot(hour: number): 'early' | 'morning' | 'afternoon' | 'evening' {
  if (hour < 6) return 'early';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function FlightFilterSidebar({
  flights,
  filters,
  onFilterChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
}: FlightFilterSidebarProps) {
  const currency = getSavedCurrency();

  // 1. DYNAMICALLY DERIVE AIRLINES FROM FLIGHTS
  const derivedAirlines = useMemo(() => {
    const map = new Map<string, { name: string; code: string; logo: string; count: number; minPrice: number }>();
    flights.forEach((f) => {
      const name = f.airline || 'Unknown Airline';
      const existing = map.get(name);
      if (!existing) {
        map.set(name, {
          name,
          code: f.airlineCode || name.substring(0, 2).toUpperCase(),
          logo: f.airlineLogo,
          count: 1,
          minPrice: f.price,
        });
      } else {
        existing.count += 1;
        existing.minPrice = Math.min(existing.minPrice, f.price);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.minPrice - b.minPrice);
  }, [flights]);

  // 2. DYNAMICALLY DERIVE STOPS FROM FLIGHTS
  const derivedStops = useMemo(() => {
    const map = new Map<number, { stops: number; label: string; count: number; minPrice: number }>();
    flights.forEach((f) => {
      const s = f.stops ?? 0;
      const normalized = s >= 2 ? 2 : s;
      const label = normalized === 0 ? 'Non-stop' : normalized === 1 ? '1 Stop' : '2+ Stops';
      const existing = map.get(normalized);
      if (!existing) {
        map.set(normalized, { stops: normalized, label, count: 1, minPrice: f.price });
      } else {
        existing.count += 1;
        existing.minPrice = Math.min(existing.minPrice, f.price);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.stops - b.stops);
  }, [flights]);

  // 3. DYNAMICALLY DERIVE DEPARTURE TIME SLOTS
  const derivedDepSlots = useMemo(() => {
    const slots = [
      { id: 'early', label: 'Early Morning', timeRange: 'Before 6:00 AM', count: 0, minPrice: Infinity },
      { id: 'morning', label: 'Morning', timeRange: '6:00 AM – 12:00 PM', count: 0, minPrice: Infinity },
      { id: 'afternoon', label: 'Afternoon', timeRange: '12:00 PM – 6:00 PM', count: 0, minPrice: Infinity },
      { id: 'evening', label: 'Evening / Night', timeRange: 'After 6:00 PM', count: 0, minPrice: Infinity },
    ];

    flights.forEach((f) => {
      const hour = parseTimeToHour(f.departureTime);
      const slotId = getTimeSlot(hour);
      const target = slots.find((s) => s.id === slotId);
      if (target) {
        target.count += 1;
        target.minPrice = Math.min(target.minPrice, f.price);
      }
    });

    return slots.filter((s) => s.count > 0);
  }, [flights]);

  // 4. DYNAMICALLY DERIVE ARRIVAL TIME SLOTS
  const derivedArrSlots = useMemo(() => {
    const slots = [
      { id: 'early', label: 'Early Morning', timeRange: 'Before 6:00 AM', count: 0, minPrice: Infinity },
      { id: 'morning', label: 'Morning', timeRange: '6:00 AM – 12:00 PM', count: 0, minPrice: Infinity },
      { id: 'afternoon', label: 'Afternoon', timeRange: '12:00 PM – 6:00 PM', count: 0, minPrice: Infinity },
      { id: 'evening', label: 'Evening / Night', timeRange: 'After 6:00 PM', count: 0, minPrice: Infinity },
    ];

    flights.forEach((f) => {
      const hour = parseTimeToHour(f.arrivalTime);
      const slotId = getTimeSlot(hour);
      const target = slots.find((s) => s.id === slotId);
      if (target) {
        target.count += 1;
        target.minPrice = Math.min(target.minPrice, f.price);
      }
    });

    return slots.filter((s) => s.count > 0);
  }, [flights]);

  // 5. DYNAMICALLY DERIVE LAYOVERS
  const derivedLayovers = useMemo(() => {
    const map = new Map<string, { code: string; count: number; minPrice: number }>();
    flights.forEach((f) => {
      if (f.layovers && f.layovers.length > 0) {
        f.layovers.forEach((code) => {
          const existing = map.get(code);
          if (!existing) {
            map.set(code, { code, count: 1, minPrice: f.price });
          } else {
            existing.count += 1;
            existing.minPrice = Math.min(existing.minPrice, f.price);
          }
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [flights]);

  // 6. PRICE & DURATION LIMITS
  const { minPrice, maxPrice, minDuration, maxDuration } = useMemo(() => {
    if (flights.length === 0) {
      return { minPrice: 0, maxPrice: 50000, minDuration: 60, maxDuration: 720 };
    }
    const prices = flights.map((f) => f.price);
    const durations = flights.map((f) => f.durationMinutes || 120);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  }, [flights]);

  // Active filter count calculation
  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.selectedAirlines.length > 0) c += filters.selectedAirlines.length;
    if (filters.selectedStops.length > 0) c += filters.selectedStops.length;
    if (filters.departureTimeSlots.length > 0) c += filters.departureTimeSlots.length;
    if (filters.arrivalTimeSlots.length > 0) c += filters.arrivalTimeSlots.length;
    if (filters.selectedLayovers.length > 0) c += filters.selectedLayovers.length;
    if (filters.maxPrice < maxPrice) c += 1;
    if (filters.maxDurationMinutes < maxDuration) c += 1;
    return c;
  }, [filters, maxPrice, maxDuration]);

  // Toggle handlers
  const handleAirlineToggle = (airlineName: string) => {
    const next = filters.selectedAirlines.includes(airlineName)
      ? filters.selectedAirlines.filter((a) => a !== airlineName)
      : [...filters.selectedAirlines, airlineName];
    onFilterChange({ ...filters, selectedAirlines: next });
  };

  const handleStopToggle = (stops: number) => {
    const next = filters.selectedStops.includes(stops)
      ? filters.selectedStops.filter((s) => s !== stops)
      : [...filters.selectedStops, stops];
    onFilterChange({ ...filters, selectedStops: next });
  };

  const handleDepSlotToggle = (slotId: string) => {
    const next = filters.departureTimeSlots.includes(slotId)
      ? filters.departureTimeSlots.filter((s) => s !== slotId)
      : [...filters.departureTimeSlots, slotId];
    onFilterChange({ ...filters, departureTimeSlots: next });
  };

  const handleArrSlotToggle = (slotId: string) => {
    const next = filters.arrivalTimeSlots.includes(slotId)
      ? filters.arrivalTimeSlots.filter((s) => s !== slotId)
      : [...filters.arrivalTimeSlots, slotId];
    onFilterChange({ ...filters, arrivalTimeSlots: next });
  };

  const handleLayoverToggle = (code: string) => {
    const next = filters.selectedLayovers.includes(code)
      ? filters.selectedLayovers.filter((c) => c !== code)
      : [...filters.selectedLayovers, code];
    onFilterChange({ ...filters, selectedLayovers: next });
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const content = (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
      {/* Header: Title + Reset Button */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. STOPS FILTER (Derived) */}
      {derivedStops.length > 0 && (
        <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Stops
          </h4>
          <div className="space-y-2.5">
            {derivedStops.map((stop) => {
              const isChecked = filters.selectedStops.includes(stop.stops);
              return (
                <label
                  key={stop.stops}
                  className="flex items-center justify-between group cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleStopToggle(stop.stops)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className={`text-xs ${isChecked ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} group-hover:text-blue-600 transition-colors`}>
                      {stop.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">({stop.count})</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {currency.symbol}{convertINR(stop.minPrice, currency.code).toLocaleString()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AIRLINES FILTER (Derived) */}
      {derivedAirlines.length > 0 && (
        <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Airlines
          </h4>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {derivedAirlines.map((airline) => {
              const isChecked = filters.selectedAirlines.includes(airline.name);
              return (
                <label
                  key={airline.name}
                  className="flex items-center justify-between group cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAirlineToggle(airline.name)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                    />
                    <div className="w-5 h-5 rounded overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center p-0.5 border border-slate-200/50">
                      <img
                        src={`https://images.kiwi.com/airlines/64x64/${airline.code}.png`}
                        alt={airline.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://pics.avs.io/64/64/${airline.code}.png`;
                        }}
                      />
                    </div>
                    <span className={`text-xs truncate ${isChecked ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} group-hover:text-blue-600 transition-colors`}>
                      {airline.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">({airline.count})</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {currency.symbol}{convertINR(airline.minPrice, currency.code).toLocaleString()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DEPARTURE TIME FILTER (Derived) */}
      {derivedDepSlots.length > 0 && (
        <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Departure Time
          </h4>
          <div className="space-y-2">
            {derivedDepSlots.map((slot) => {
              const isChecked = filters.departureTimeSlots.includes(slot.id);
              return (
                <label
                  key={slot.id}
                  className="flex items-center justify-between group cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleDepSlotToggle(slot.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className={`text-xs block leading-tight ${isChecked ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} group-hover:text-blue-600 transition-colors`}>
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {slot.timeRange}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">({slot.count})</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {currency.symbol}{convertINR(slot.minPrice, currency.code).toLocaleString()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ARRIVAL TIME FILTER (Derived) */}
      {derivedArrSlots.length > 0 && (
        <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Arrival Time
          </h4>
          <div className="space-y-2">
            {derivedArrSlots.map((slot) => {
              const isChecked = filters.arrivalTimeSlots.includes(slot.id);
              return (
                <label
                  key={slot.id}
                  className="flex items-center justify-between group cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleArrSlotToggle(slot.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className={`text-xs block leading-tight ${isChecked ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} group-hover:text-blue-600 transition-colors`}>
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {slot.timeRange}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">({slot.count})</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {currency.symbol}{convertINR(slot.minPrice, currency.code).toLocaleString()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PRICE RANGE SLIDER (Derived) */}
      <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
            Up to {currency.symbol}{convertINR(filters.maxPrice, currency.code).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={Math.max(100, Math.floor((maxPrice - minPrice) / 50))}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
          <span>{currency.symbol}{convertINR(minPrice, currency.code).toLocaleString()}</span>
          <span>{currency.symbol}{convertINR(maxPrice, currency.code).toLocaleString()}</span>
        </div>
      </div>

      {/* 6. FLIGHT DURATION SLIDER (Derived) */}
      <div className={`${derivedLayovers.length > 0 ? 'pb-5 mb-5 border-b border-slate-100 dark:border-slate-800' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Max Duration
          </h4>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
            Under {formatDuration(filters.maxDurationMinutes)}
          </span>
        </div>
        <input
          type="range"
          min={minDuration}
          max={maxDuration}
          step={15}
          value={filters.maxDurationMinutes}
          onChange={(e) => onFilterChange({ ...filters, maxDurationMinutes: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
          <span>{formatDuration(minDuration)}</span>
          <span>{formatDuration(maxDuration)}</span>
        </div>
      </div>

      {/* 7. LAYOVERS FILTER (Derived dynamically if multi-stop flights exist) */}
      {derivedLayovers.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Layover Airports
          </h4>
          <div className="space-y-2.5">
            {derivedLayovers.map((item) => {
              const isChecked = filters.selectedLayovers.includes(item.code);
              return (
                <label
                  key={item.code}
                  className="flex items-center justify-between group cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleLayoverToggle(item.code)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className={`text-xs ${isChecked ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} group-hover:text-blue-600 transition-colors`}>
                      via {item.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">({item.count})</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {currency.symbol}{convertINR(item.minPrice, currency.code).toLocaleString()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile / Tablet Drawer Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Filter Flights</h3>
              <button
                onClick={onCloseMobile}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1">
              {content}
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md cursor-pointer"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
