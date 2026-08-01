"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Hero from '../../../components/Hero';
import Offers from '../../../components/Offers';
import TrustBar from '../../../components/TrustBar';
import FlightResults from '../../../components/FlightResults';
import Footer from '../../../components/Footer';
import InternationalRoutes from '../../../components/InternationalRoutes';
import AIAssistant from '../../../components/AIAssistant';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { Flight, SearchParams } from '../../../types';
import { flightService } from '../../../services/flightService';

export default function FlightRoutePage() {
  const router = useRouter();
  const rawParams = useParams();
  const route = typeof rawParams?.route === 'string' ? rawParams.route : Array.isArray(rawParams?.route) ? rawParams.route[0] : '';
  
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'fastest' | 'nonstop'>('price');
  const [darkMode, setDarkMode] = useState(false);

  // Parse path jfk-to-lax
  const [origin, destination] = useMemo(() => {
    if (!route) return ['', ''];
    const parts = route.split('-to-');
    return [parts[0]?.toUpperCase() || '', parts[1]?.toUpperCase() || ''];
  }, [route]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      setDarkMode(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (origin && destination) {
      // Create a default departure date 14 days in the future for SEO indexers
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 14);
      const dateStr = futureDate.toISOString().split('T')[0];

      const params: SearchParams = {
        from: origin,
        to: destination,
        date: dateStr,
        passengers: 1,
        travelClass: 'Economy'
      };

      setSearchParams(params);

      // Trigger Flight Search
      flightService.searchFlights(params)
        .then(flights => {
          setSearchResults(flights);
          setIsSearching(false);
        })
        .catch(err => {
          console.error('SEO flight route search error:', err);
          setSearchResults([]);
          setIsSearching(false);
        });
    }
  }, [origin, destination]);

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setSearchResults([]); 
    setSearchParams(params);
    
    try {
      const flights = await flightService.searchFlights(params);
      setSearchResults(flights);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleBookClick = (flight: Flight) => {
    // Dynamic query redirect or local state
    // We can redirect to /?book=flightId or similar, or just render checkout here
    // Redirect to main home to complete booking with details view
    localStorage.setItem('triphawks_selected_flight', JSON.stringify(flight));
    router.push(`/?view=details`);
  };

  const sortedFlights = useMemo(() => {
    const flights = [...searchResults];
    if (sortBy === 'price') {
      return flights.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      return flights.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'nonstop') {
      return flights.sort((a, b) => a.stops - b.stops);
    }
    return flights;
  }, [searchResults, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar 
        onLoginClick={() => router.push('/login')} 
        onLogoClick={handleLogoClick} 
        onSupportClick={() => router.push('/customer-service')}
        onOffersClick={() => router.push('/offers')}
        onHotelsClick={() => router.push('/hotels')}
        activeView="home"
        showHotels={true}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(prev => !prev)}
      />
      
      <main className="flex-grow">
        <Hero onSearch={handleSearch} isLoading={isSearching} />
        
        {isSearching && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-20 text-center">
             <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500 font-bold">Finding the best flights from {origin} to {destination}...</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && searchParams && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-800 leading-snug mb-1">
                  Cheap flights from <span className="text-blue-600">{origin}</span> to <span className="text-blue-600">{destination}</span>
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold">{searchResults.length} flights found • {searchParams?.date}</p>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setSortBy('price')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'price' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cheapest</button>
                <button onClick={() => setSortBy('fastest')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'fastest' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Fastest</button>
                <button onClick={() => setSortBy('nonstop')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'nonstop' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Non-stop</button>
              </div>
            </div>
            
            <FlightResults flights={sortedFlights} onBook={handleBookClick} />
          </div>
        )}

        {!isSearching && searchResults.length === 0 && searchParams && (
          <div className="max-w-[90%] md:max-w-2xl mx-auto px-2 sm:px-6 py-10 md:py-16">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 md:mb-5 relative z-10">
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-5 relative z-10">
                <span className="text-lg md:text-xl font-bold text-slate-800 text-center">{origin}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                <span className="text-lg md:text-xl font-bold text-slate-800 text-center">{destination}</span>
              </div>
              
              <div className="mb-6 md:mb-8 relative z-10 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 w-full">
                <p className="text-lg md:text-xl font-bold text-slate-800 mb-2">Online inventory currently unavailable</p>
                <p className="text-blue-600 font-semibold mb-2 text-sm md:text-base">We have 21+ unpublished offline flights available for this route.</p>
                <p className="text-slate-500 text-xs md:text-sm">Call our offline booking desk for exclusive deals and instant connection. No waiting time.</p>
              </div>
              
              <a href="tel:18887918007" className="relative z-10 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-xl text-base md:text-lg transition-all shadow-md group w-full sm:w-auto">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                Call Booking Desk
              </a>
            </div>
          </div>
        )}
        
        <Offers onSeeAll={() => router.push('/offers')} />
        <InternationalRoutes onRouteClick={(from, to) => router.push(`/flights/${from.toLowerCase()}-to-${to.toLowerCase()}`)} />
        <TrustBar />
      </main>

      <AIAssistant />
      <Footer 
        onLegalClick={() => router.push('/terms')} 
        onAboutClick={() => router.push('/about')} 
        onPrivacyClick={() => router.push('/privacy')}
        onTermsClick={() => router.push('/terms-of-use')}
        onCreditCardVerificationClick={() => router.push('/credit-card-verification')}
        onContactClick={() => router.push('/contact')}
      />
    </div>
  );
}
