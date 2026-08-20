"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import MobileServiceGrid from '../components/ui/MobileServiceGrid';
import Offers from '../components/Offers';
import CruiseDestinations from '../components/CruiseDestinations';
import TopHotels from '../components/TopHotels';
import CarRentals from '../components/CarRentals';
import TrendingHolidays from '../components/TrendingHolidays';
import OutdoorActivities from '../components/OutdoorActivities';
import FlightResults from '../components/FlightResults';
import AIAssistant from '../components/AIAssistant';
import Footer from '../components/Footer';
import InternationalRoutes from '../components/InternationalRoutes';
import SkeletonLoader from '../components/SkeletonLoader';
import { resolveIataCode } from '../components/AirportAutocomplete';

import AuthModal from '../components/AuthModal';
import OfflineHotlineBanner from '../components/common/OfflineHotlineBanner';

const PromotionalPopup = React.lazy(() => import('../components/PromotionalPopup'));
const FlightDetails = React.lazy(() => import('../components/FlightDetails'));

import { SearchParams, Flight } from '../types';
import { flightService } from '../services/flightService';

function HomeContent() {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [view, setView] = useState<'home' | 'details'>('home');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'fastest' | 'nonstop'>('price');
  const [showPromo, setShowPromo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setSearchResults([]);
    setSearchParams(params);
    setShowPromo(false);
    setView('home');

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

  // Auto-trigger search from query params
  const fromParam = searchParamsHook.get('from');
  const toParam = searchParamsHook.get('to');
  const dateParam = searchParamsHook.get('date');
  const classParam = searchParamsHook.get('class') || 'Economy';
  const viewParam = searchParamsHook.get('view');

  useEffect(() => {
    if (viewParam === 'details') {
      const saved = localStorage.getItem('triphawks_selected_flight');
      if (saved) {
        try {
          setSelectedFlight(JSON.parse(saved));
          setView('details');
        } catch (e) {
          console.error(e);
        }
      }
    } else if (fromParam && toParam && dateParam) {
      handleSearch({
        from: resolveIataCode(fromParam),
        to: resolveIataCode(toParam),
        date: dateParam,
        passengers: 1,
        travelClass: classParam
      });
    }
  }, [fromParam, toParam, dateParam, classParam, viewParam]);

  useEffect(() => {
    let timer: number;
    if (searchResults.length > 0 && !isSearching && view === 'home') {
      timer = window.setTimeout(() => {
        setShowPromo(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [searchResults, isSearching, view]);

  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        document.getElementById('search-loading-indicator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isSearching]);

  useEffect(() => {
    if (searchParams && !isSearching) {
      setTimeout(() => {
        if (searchResults.length === 0) {
          document.getElementById('no-flights-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          document.getElementById('flight-results-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams, searchResults, isSearching]);

  const handleRouteClick = (from: string, to: string) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 14);
    const dateStr = futureDate.toISOString().split('T')[0];

    handleSearch({
      from: from,
      to: to,
      date: dateStr,
      passengers: 1,
      travelClass: 'Economy'
    });
  };

  const handleLogoClick = () => {
    setView('home');
    setSearchParams(null);
    setSearchResults([]);
    setShowPromo(false);
    setSelectedFlight(null);
    router.push('/');
  };

  const handleBookClick = (flight: Flight) => {
    setSelectedFlight(flight);
    setView('details');
    setShowPromo(false);
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

  const minPrice = useMemo(() => {
    if (searchResults.length === 0) return 0;
    return Math.min(...searchResults.map(f => f.price));
  }, [searchResults]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoClick={handleLogoClick}
        onSupportClick={() => router.push('/customer-service')}
        onOffersClick={() => router.push('/offers')}
        onHotelsClick={() => router.push('/hotels')}
        activeView="home"
        showHotels={true}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(prev => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <div className="flex flex-1 w-full items-stretch relative">
        {/* Left Sidebar - visible on desktop */}
        <aside className={`hidden lg:block shrink-0 border-r border-[#F1F5F9] dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'}`}>
          <Sidebar activeItem="flights" isCollapsed={isSidebarCollapsed} />
        </aside>

        {/* Right Content */}
        <main className="flex-grow min-w-0">
          {view === 'details' && selectedFlight ? (
            <FlightDetails
              flight={selectedFlight}
              onBack={() => {
                setView('home');
                router.push('/');
              }}
            />
          ) : (
            <>
              <MobileServiceGrid />
              <Hero onSearch={handleSearch} isLoading={isSearching} />

              {isSearching && (
                <div id="search-loading-indicator" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-20 text-center">
                  <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-bold">Finding the best flights for you...</p>
                </div>
              )}

              {searchParams && searchResults.length > 0 && !isSearching && (
                <div id="flight-results-container" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="max-w-full md:max-w-2xl">
                      <h2 className="text-lg md:text-xl font-black text-slate-800 leading-snug mb-1">
                        <span className="text-slate-400 font-bold mr-2 uppercase text-[10px] md:text-xs tracking-widest hidden md:inline">Route</span>
                        <span className="text-blue-600">{searchParams?.from}</span>
                        <span className="text-slate-300 mx-2">→</span>
                        <span className="text-blue-600">{searchParams?.to}</span>
                      </h2>
                      <p className="text-slate-500 text-xs md:text-sm font-semibold">{searchResults.length} premium flights found • <span className="text-slate-700">{searchParams?.date}</span></p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setSortBy('price')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'price' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Cheapest
                      </button>
                      <button
                        onClick={() => setSortBy('fastest')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'fastest' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Fastest
                      </button>
                      <button
                        onClick={() => setSortBy('nonstop')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'nonstop' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Non-stop
                      </button>
                    </div>
                  </div>

                  <FlightResults 
                    flights={sortedFlights} 
                    onBook={handleBookClick} 
                    initialLimit={6}
                    searchParams={searchParams}
                  />
                </div>
              )}

              {searchParams && searchResults.length === 0 && !isSearching && (
                <div id="no-flights-card" className="max-w-[90%] md:max-w-2xl mx-auto px-2 sm:px-6 py-10 md:py-16">
                  <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

                    <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 md:mb-5 relative z-10">
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-5 relative z-10">
                      <span className="text-lg md:text-xl font-bold text-slate-800 text-center">{searchParams.from?.split(',')[0]}</span>
                      <div className="hidden md:block w-8 md:w-12 h-[2px] bg-slate-200 relative rounded-full">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                          <svg className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="md:hidden">
                        <svg className="w-4 h-4 text-slate-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-slate-800 text-center">{searchParams.to?.split(',')[0]}</span>
                    </div>

                    <OfflineHotlineBanner />
                  </div>
                </div>
              )}

              {/* HOME PAGE CARDS SECTION */}
              <Offers onSeeAll={() => router.push('/offers')} />
              <CruiseDestinations />
              <TopHotels />
              <CarRentals />
              <TrendingHolidays />
              <OutdoorActivities />


            </>
          )}
          <Footer
            onLegalClick={() => router.push('/terms')}
            onAboutClick={() => router.push('/about')}
            onPrivacyClick={() => router.push('/privacy')}
            onTermsClick={() => router.push('/terms-of-use')}
            onCreditCardVerificationClick={() => router.push('/credit-card-verification')}
            onContactClick={() => router.push('/contact')}
          />
        </main>
      </div>

      {showPromo && minPrice > 0 && searchParams && (
        <PromotionalPopup
          route={`${searchParams.from ? searchParams.from.split(',')[0] : ''} to ${searchParams.to ? searchParams.to.split(',')[0] : ''}`}
          minPrice={minPrice}
          onClose={() => setShowPromo(false)}
        />
      )}
      <AIAssistant />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HomeContent />
    </Suspense>
  );
}
