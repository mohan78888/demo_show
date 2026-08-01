"use client";

import React, { useState, useRef, useEffect } from 'react';
import { hotelService, DestinationSuggestion } from '../services/hotelService';
import { Building2, MapPin, Plane, Globe } from 'lucide-react';

interface HotelAutocompleteProps {
  value: string;
  onSelect: (destination: { name: string; cityId: string; countryCode: string }) => void;
  placeholder?: string;
  className?: string;
  flat?: boolean;
}

const DEFAULT_POPULAR_DESTINATIONS: DestinationSuggestion[] = [
  { id: '227760', fullName: 'New Delhi, National Capital Territory of Delhi, India', country: 'IN', type: 'City' },
  { id: '178308', fullName: 'Mumbai, Maharashtra, India', country: 'IN', type: 'City' },
  { id: '178236', fullName: 'Bengaluru, Karnataka, India', country: 'IN', type: 'City' },
  { id: '178304', fullName: 'Goa, India', country: 'IN', type: 'State' },
  { id: '178248', fullName: 'Chennai, Tamil Nadu, India', country: 'IN', type: 'City' },
  { id: '602693', fullName: 'Dubai, United Arab Emirates', country: 'AE', type: 'City' },
  { id: '602720', fullName: 'Singapore, Singapore', country: 'SG', type: 'City' },
  { id: '602688', fullName: 'Bali, Indonesia', country: 'ID', type: 'City' }
];

const HotelAutocomplete: React.FC<HotelAutocompleteProps> = ({
  value,
  onSelect,
  placeholder = "Where are you staying?",
  className = "",
  flat = true
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>(DEFAULT_POPULAR_DESTINATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length < 2) {
      setSuggestions(DEFAULT_POPULAR_DESTINATIONS);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const results = await hotelService.autocompleteDestinations(val.trim());
      if (results && results.length > 0) {
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleSelectSuggestion = (item: DestinationSuggestion) => {
    // Extract short clean city name for display e.g. "New Delhi"
    const cleanName = item.fullName.split(',')[0].trim();
    setQuery(cleanName);
    setIsOpen(false);
    onSelect({
      name: cleanName,
      cityId: item.id,
      countryCode: item.country || 'IN'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={flat
          ? "w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
          : "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        }
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[280px]">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching destinations...</span>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const icon = item.type === 'Airport' ? <Plane className="w-4 h-4 text-blue-500 shrink-0" /> :
                             item.type === 'Hotel' ? <Building2 className="w-4 h-4 text-indigo-500 shrink-0" /> :
                             <MapPin className="w-4 h-4 text-amber-500 shrink-0" />;

                return (
                  <button
                    key={`${item.id}_${idx}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {item.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {item.type || 'Destination'} • {item.country}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-xs font-bold text-slate-400">
                No destinations found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelAutocomplete;
