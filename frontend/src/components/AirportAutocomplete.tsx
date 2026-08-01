"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  keywords?: string;
}

export const AIRPORTS_DATA: Airport[] = [
  // --- INDIA ---
  { code: 'DEL', city: 'Delhi / New Delhi', country: 'India', name: 'Indira Gandhi International Airport', keywords: 'delhi new delhi igi igiat ndls' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj Intl', keywords: 'mumbai bombay csia csmit' },
  { code: 'BLR', city: 'Bengaluru / Bangalore', country: 'India', name: 'Kempegowda International Airport', keywords: 'bangalore bengaluru kemp' },
  { code: 'MAA', city: 'Chennai / Madras', country: 'India', name: 'Chennai International Airport', keywords: 'chennai madras' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International Airport', keywords: 'hyderabad rgia secunderabad' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose Intl', keywords: 'kolkata calcutta dumdum' },
  { code: 'GOI', city: 'Goa (Dabolim)', country: 'India', name: 'Dabolim Airport', keywords: 'goa dabolim South goa' },
  { code: 'GOX', city: 'Goa (Mopa)', country: 'India', name: 'Manohar International Airport', keywords: 'goa mopa North goa' },
  { code: 'GAU', city: 'Guwahati', country: 'India', name: 'Lokpriya Gopinath Bordoloi Intl', keywords: 'guwahati assam borjhar' },
  { code: 'AMD', city: 'Ahmedabad', country: 'India', name: 'Sardar Vallabhbhai Patel Intl', keywords: 'ahmedabad gujarat svpi' },
  { code: 'COK', city: 'Kochi / Cochin', country: 'India', name: 'Cochin International Airport', keywords: 'kochi cochin kerala cial' },
  { code: 'TRV', city: 'Thiruvananthapuram', country: 'India', name: 'Trivandrum International Airport', keywords: 'trivandrum thiruvananthapuram kerala' },
  { code: 'PNQ', city: 'Pune', country: 'India', name: 'Pune Airport', keywords: 'pune maharashtra lohegaon' },
  { code: 'JAI', city: 'Jaipur', country: 'India', name: 'Jaipur International Airport', keywords: 'jaipur rajasthan sanganer' },
  { code: 'ATQ', city: 'Amritsar', country: 'India', name: 'Sri Guru Ram Dass Jee Intl', keywords: 'amritsar punjab raja sansi' },
  { code: 'IXC', city: 'Chandigarh', country: 'India', name: 'Chandigarh International Airport', keywords: 'chandigarh mohali punjab haryana' },
  { code: 'LKO', city: 'Lucknow', country: 'India', name: 'Chaudhary Charan Singh Intl', keywords: 'lucknow up uttar pradesh amausi' },
  { code: 'VNS', city: 'Varanasi', country: 'India', name: 'Lal Bahadur Shastri Intl', keywords: 'varanasi banaras uttar pradesh babatpur' },
  { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam International Airport', keywords: 'srinagar kashmir jammu' },
  { code: 'IXB', city: 'Bagdogra / Siliguri', country: 'India', name: 'Bagdogra Airport', keywords: 'bagdogra siliguri darjeeling west bengal' },
  { code: 'PAT', city: 'Patna', country: 'India', name: 'Jay Prakash Narayan Airport', keywords: 'patna bihar' },
  { code: 'BBI', city: 'Bhubaneswar', country: 'India', name: 'Biju Patnaik International Airport', keywords: 'bhubaneswar odisha orissa' },
  { code: 'IXR', city: 'Ranchi', country: 'India', name: 'Birsa Munda Airport', keywords: 'ranchi jharkhand' },
  { code: 'BDQ', city: 'Vadodara', country: 'India', name: 'Vadodara Airport', keywords: 'vadodara baroda gujarat' },
  { code: 'STV', city: 'Surat', country: 'India', name: 'Surat International Airport', keywords: 'surat gujarat' },
  { code: 'IDR', city: 'Indore', country: 'India', name: 'Devi Ahilya Bai Holkar Airport', keywords: 'indore mp madhya pradesh' },
  { code: 'BHO', city: 'Bhopal', country: 'India', name: 'Raja Bhoj Airport', keywords: 'bhopal mp madhya pradesh' },
  { code: 'UDR', city: 'Udaipur', country: 'India', name: 'Maharana Pratap Airport', keywords: 'udaipur rajasthan dabok' },
  { code: 'TRZ', city: 'Tiruchirappalli', country: 'India', name: 'Tiruchirappalli International Airport', keywords: 'trichy tiruchirappalli tamil nadu' },
  { code: 'IXM', city: 'Madurai', country: 'India', name: 'Madurai Airport', keywords: 'madurai tamil nadu' },
  { code: 'CJB', city: 'Coimbatore', country: 'India', name: 'Coimbatore International Airport', keywords: 'coimbatore tamil nadu peelamedu' },
  { code: 'CCJ', city: 'Kozhikode / Calicut', country: 'India', name: 'Calicut International Airport', keywords: 'calicut kozhikode kerala karipur' },

  // --- INTERNATIONAL ---
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy Intl Airport', keywords: 'new york jfk nyc usa' },
  { code: 'EWR', city: 'Newark / New York', country: 'USA', name: 'Newark Liberty Intl Airport', keywords: 'newark new york ewr nyc usa' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International Airport', keywords: 'los angeles lax california usa' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', name: 'San Francisco Intl Airport', keywords: 'san francisco sfo california usa' },
  { code: 'ORD', city: 'Chicago', country: 'USA', name: 'O\'Hare International Airport', keywords: 'chicago ord ohare usa' },
  { code: 'MIA', city: 'Miami', country: 'USA', name: 'Miami International Airport', keywords: 'miami mia florida usa' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson International Airport', keywords: 'toronto yyz canada ontario' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International Airport', keywords: 'vancouver yvr canada bc' },
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport', keywords: 'london lhr heathrow uk england' },
  { code: 'LGW', city: 'London', country: 'UK', name: 'Gatwick Airport', keywords: 'london lgw gatwick uk england' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport', keywords: 'paris cdg france europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Airport Schiphol', keywords: 'amsterdam ams schiphol netherlands' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport', keywords: 'frankfurt fra germany europe' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport', keywords: 'dubai dxb uae emirates' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', name: 'Abu Dhabi Intl Airport', keywords: 'abu dhabi auh uae' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport', keywords: 'doha doh qatar hamad' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi Airport', keywords: 'singapore sin changi' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport', keywords: 'bangkok bkk suvarnabhumi thailand' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport', keywords: 'kuala lumpur kul malaysia klia' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Haneda Airport', keywords: 'tokyo hnd haneda japan' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith Airport', keywords: 'sydney syd australia' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport', keywords: 'melbourne mel australia tullamarine' },
];

// Helper: Resolve any free text or display label to 3-letter IATA code
export function resolveIataCode(inputStr: string): string {
  if (!inputStr) return '';
  const trimmed = inputStr.trim();
  
  // 1. Check if string contains (CODE) format e.g. "New Delhi (DEL)"
  const codeMatch = trimmed.match(/\(([A-Za-z]{3})\)/);
  if (codeMatch) return codeMatch[1].toUpperCase();

  const lower = trimmed.toLowerCase();

  // 2. Direct exact code match
  const exactByCode = AIRPORTS_DATA.find(a => a.code.toLowerCase() === lower);
  if (exactByCode) return exactByCode.code;

  // 3. Match by city or name or keywords
  const matched = AIRPORTS_DATA.find(a => 
    a.city.toLowerCase().includes(lower) || 
    a.name.toLowerCase().includes(lower) ||
    (a.keywords && a.keywords.toLowerCase().includes(lower))
  );

  if (matched) return matched.code;

  // 4. Fallback to 3 uppercase letters if valid 3-letter code
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return trimmed.substring(0, 3).toUpperCase();
}

interface AirportAutocompleteProps {
  name: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string, airport?: Airport) => void;
  required?: boolean;
  flat?: boolean;
  className?: string;
  defaultCode?: string;
}

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  name,
  placeholder,
  value: externalValue,
  onChange,
  required = false,
  flat = false,
  className = '',
  defaultCode
}) => {
  const defaultAirport = defaultCode 
    ? AIRPORTS_DATA.find(a => a.code.toLowerCase() === defaultCode.toLowerCase())
    : null;

  const [query, setQuery] = useState<string>(
    externalValue || (defaultAirport ? `${defaultAirport.city} (${defaultAirport.code})` : '')
  );
  const [selectedCode, setSelectedCode] = useState<string>(
    defaultAirport ? defaultAirport.code : (externalValue ? resolveIataCode(externalValue) : '')
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync externalValue prop changes if provided
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== query) {
      setQuery(externalValue);
      const code = resolveIataCode(externalValue);
      setSelectedCode(code);
    }
  }, [externalValue]);

  // Filter airports based on query search term
  const filteredAirports = useMemo(() => {
    if (!query || query.trim().length < 1) {
      return AIRPORTS_DATA.slice(0, 10);
    }

    const q = query.toLowerCase().trim();
    return AIRPORTS_DATA.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      (a.keywords && a.keywords.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [query]);

  // Handle select airport item
  const handleSelect = (airport: Airport) => {
    const displayLabel = `${airport.city}, ${airport.country} (${airport.code})`;
    setQuery(displayLabel);
    setSelectedCode(airport.code);
    setIsOpen(false);

    if (onChange) {
      onChange(airport.code, airport);
    }
  };

  // Handle input text typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const resolved = resolveIataCode(val);
    setSelectedCode(resolved);
    setIsOpen(true);

    if (onChange) {
      onChange(resolved);
    }
  };

  // Close dropdown on outside click
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
      {/* Visible Display Input (User sees "Delhi, India (DEL)" or types search term) */}
      <input
        type="text"
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={flat 
          ? "w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-xs sm:text-[15px] placeholder:text-slate-400 focus:ring-0 focus:outline-none"
          : "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none font-bold text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
        }
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />

      {/* Hidden Input for Form Submission: ALWAYS SENDS ONLY THE 3-LETTER IATA CODE (e.g. DEL, BOM) */}
      <input 
        type="hidden" 
        name={name} 
        value={selectedCode || resolveIataCode(query)} 
      />

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[280px]">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 text-left group cursor-pointer"
                  onClick={() => handleSelect(airport)}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      ✈
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {airport.city}, {airport.country}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {airport.name}
                      </span>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-black text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    {airport.code}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs">No airports found matching "{query}"</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try city name (Delhi, Mumbai) or code (DEL, BOM)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
