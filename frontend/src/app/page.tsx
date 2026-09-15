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
import FlightBookingModal from '../components/FlightBookingModal';
import ExploreFlightsByAirline from '../components/ExploreFlightsByAirline';
import FlightFilterSidebar, { parseTimeToHour, getTimeSlot } from '../components/flights/FlightFilterSidebar';

const FlightDetails = React.lazy(() => import('../components/FlightDetails'));

import { SearchParams, Flight, FlightFilterState, SSRGroup } from '../types';
import { flightService } from '../services/flightService';

function HomeContent() {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [view, setView] = useState<'home' | 'details'>('home');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedBookingFlight, setSelectedBookingFlight] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'fastest' | 'nonstop'>('price');
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Filter State
  const [filters, setFilters] = useState<FlightFilterState>({
    selectedAirlines: [],
    selectedStops: [],
    departureTimeSlots: [],
    arrivalTimeSlots: [],
    maxPrice: Infinity,
    maxDurationMinutes: Infinity,
    selectedLayovers: [],
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // On-Select Reprice & SSR State
  const [verifyingFlightId, setVerifyingFlightId] = useState<string | null>(null);
  const [ssrData, setSsrData] = useState<SSRGroup | null>(null);
  const [isFareChanged, setIsFareChanged] = useState<boolean>(false);
  const [originalFarePrice, setOriginalFarePrice] = useState<number | undefined>(undefined);

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
    setIsSidebarCollapsed(true);
    setSearchResults([]);
    setSearchParams(params);
    setView('home');

    try {
      const flights = await flightService.searchFlights(params);
      setSearchResults(flights);

      // Initialize dynamic filter boundaries from the Air_Search response
      if (flights.length > 0) {
        const prices = flights.map((f) => f.price);
        const durations = flights.map((f) => f.durationMinutes || 120);
        setFilters({
          selectedAirlines: [],
          selectedStops: [],
          departureTimeSlots: [],
          arrivalTimeSlots: [],
          maxPrice: Math.max(...prices),
          maxDurationMinutes: Math.max(...durations),
          selectedLayovers: [],
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetFilters = () => {
    if (searchResults.length > 0) {
      const prices = searchResults.map((f) => f.price);
      const durations = searchResults.map((f) => f.durationMinutes || 120);
      setFilters({
        selectedAirlines: [],
        selectedStops: [],
        departureTimeSlots: [],
        arrivalTimeSlots: [],
        maxPrice: Math.max(...prices),
        maxDurationMinutes: Math.max(...durations),
        selectedLayovers: [],
      });
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
      const saved = localStorage.getItem('tourhelpdesk_selected_flight');
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
    setSelectedFlight(null);
    setSsrData(null);
    setIsFareChanged(false);
    setIsSidebarCollapsed(false);
    router.push('/');
  };

  // ON-SELECT: Air_Reprice -> Air_GetSSR -> Open Flight Details
  const handleBookClick = async (flight: Flight) => {
    setVerifyingFlightId(flight.id);
    const originalPrice = flight.price;
    let currentFlight = { ...flight };

    try {
      // 1. Trigger Air_Reprice to verify real-time fare & seat availability
      const repriceResult = await flightService.repriceFlight({
        fareId: flight.fareId,
        flightKey: flight.flightKey,
        searchKey: flight.searchKey,
        flightId: flight.id,
      });

      if (repriceResult.isFareChanged && repriceResult.newPrice) {
        setIsFareChanged(true);
        setOriginalFarePrice(originalPrice);
        currentFlight = {
          ...currentFlight,
          price: repriceResult.newPrice,
          fareId: repriceResult.updatedFareId || currentFlight.fareId,
          flightKey: repriceResult.updatedFlightKey || currentFlight.flightKey,
          seatsAvailable: repriceResult.seatsAvailable || currentFlight.seatsAvailable,
          repriced: true,
        };
      } else {
        setIsFareChanged(false);
        setOriginalFarePrice(undefined);
      }

      // 2. Trigger Air_GetSSR for Baggage, Meals, Seats, and other SSR
      const ssrResult = await flightService.getSSR({
        fareId: currentFlight.fareId,
        flightKey: currentFlight.flightKey,
        searchKey: currentFlight.searchKey,
      });

      if (ssrResult.success && ssrResult.ssr) {
        setSsrData(ssrResult.ssr);
      } else {
        setSsrData(null);
      }
    } catch (e) {
      console.warn('Reprice/SSR warning:', e);
      setIsFareChanged(false);
      setSsrData(null);
    } finally {
      setVerifyingFlightId(null);
      setSelectedFlight(currentFlight);
      setView('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // DYNAMIC FILTERING
  const filteredFlights = useMemo(() => {
    return searchResults.filter((f) => {
      // 1. Airlines
      if (filters.selectedAirlines.length > 0 && !filters.selectedAirlines.includes(f.airline)) {
        return false;
      }
      // 2. Stops
      if (filters.selectedStops.length > 0) {
        const normalizedStop = (f.stops ?? 0) >= 2 ? 2 : (f.stops ?? 0);
        if (!filters.selectedStops.includes(normalizedStop)) return false;
      }
      // 3. Departure Time
      if (filters.departureTimeSlots.length > 0) {
        const hour = parseTimeToHour(f.departureTime);
        const slot = getTimeSlot(hour);
        if (!filters.departureTimeSlots.includes(slot)) return false;
      }
      // 4. Arrival Time
      if (filters.arrivalTimeSlots.length > 0) {
        const hour = parseTimeToHour(f.arrivalTime);
        const slot = getTimeSlot(hour);
        if (!filters.arrivalTimeSlots.includes(slot)) return false;
      }
      // 5. Max Price
      if (f.price > filters.maxPrice) {
        return false;
      }
      // 6. Max Duration
      if ((f.durationMinutes || 120) > filters.maxDurationMinutes) {
        return false;
      }
      // 7. Layovers
      if (filters.selectedLayovers.length > 0) {
        const flightLayovers = f.layovers || [];
        const hasMatchingLayover = filters.selectedLayovers.some((layover) => flightLayovers.includes(layover));
        if (!hasMatchingLayover) return false;
      }
      return true;
    });
  }, [searchResults, filters]);

  // SORTING
  const sortedFlights = useMemo(() => {
    const flights = [...filteredFlights];
    if (sortBy === 'price') {
      return flights.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      return flights.sort((a, b) => (a.durationMinutes || 120) - (b.durationMinutes || 120));
    } else if (sortBy === 'nonstop') {
      return flights.sort((a, b) => a.stops - b.stops);
    }
    return flights;
  }, [filteredFlights, sortBy]);

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
        {/* Left Navigation Sidebar - Collapsed to 72px icon mode during search results */}
        <aside className={`hidden lg:block shrink-0 border-r border-[#F1F5F9] dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'}`}>
          <Sidebar activeItem="flights" isCollapsed={isSidebarCollapsed} />
        </aside>

        {/* Right Content */}
        <main className="flex-grow min-w-0">
          {view === 'details' && selectedFlight ? (
            <FlightDetails
              flight={selectedFlight}
              searchParams={searchParams}
              ssrData={ssrData}
              isFareChanged={isFareChanged}
              originalPrice={originalFarePrice}
              onBack={() => {
                setView('home');
                setSelectedFlight(null);
                setSsrData(null);
                setIsFareChanged(false);
                router.push('/');
              }}
            />
          ) : (
            <>
              <MobileServiceGrid />
              <Hero onSearch={handleSearch} isLoading={isSearching} />



              {isSearching && (
                <div id="search-loading-indicator">
                  <SkeletonLoader from={searchParams?.from} to={searchParams?.to} />
                </div>
              )}

              {searchParams && searchResults.length > 0 && !isSearching && (
                <div id="flight-results-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                  {/* Route & Summary Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="max-w-full md:max-w-2xl">
                      <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-1">
                        <span className="text-blue-600 dark:text-blue-400">{searchParams?.from}</span>
                        <span className="text-slate-300 dark:text-slate-600 mx-2">→</span>
                        <span className="text-blue-600 dark:text-blue-400">{searchParams?.to}</span>
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold">
                        {filteredFlights.length} of {searchResults.length} flights available • <span className="text-slate-700 dark:text-slate-300 font-bold">{searchParams?.date}</span>
                      </p>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start md:self-auto">
                      <button
                        onClick={() => setSortBy('price')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          sortBy === 'price'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        Cheapest
                      </button>
                      <button
                        onClick={() => setSortBy('fastest')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          sortBy === 'fastest'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        Fastest
                      </button>
                      <button
                        onClick={() => setSortBy('nonstop')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          sortBy === 'nonstop'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        Non-stop
                      </button>
                    </div>
                  </div>

                  {/* Mobile Filter Toggle Button */}
                  <div className="lg:hidden mb-4">
                    <button
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between font-bold text-xs text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>⚙️</span> Filter Flights
                      </span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                        Tap to adjust filters →
                      </span>
                    </button>
                  </div>

                  {/* 2-Column Layout: Left Filter Sidebar + Right Flight Results */}
                  <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                    {/* Left Filter Sidebar */}
                    <FlightFilterSidebar
                      flights={searchResults}
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={handleResetFilters}
                      isOpenMobile={isMobileFilterOpen}
                      onCloseMobile={() => setIsMobileFilterOpen(false)}
                    />

                    {/* Right Content Area: Results List */}
                    <div className="flex-1 min-w-0 w-full">
                      {sortedFlights.length > 0 ? (
                        <FlightResults 
                          flights={sortedFlights} 
                          onBook={handleBookClick} 
                          initialLimit={6}
                          searchParams={searchParams}
                          verifyingFlightId={verifyingFlightId}
                        />
                      ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-xl text-slate-400">
                            🔍
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                            No flights match your filter selection
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            Try adjusting your price range, flight duration, stops, or airline selections.
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
              <ExploreFlightsByAirline />


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


      <AIAssistant />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
      <FlightBookingModal
        isOpen={isBookingModalOpen}
        flight={selectedBookingFlight}
        searchParams={searchParams}
        onClose={() => setIsBookingModalOpen(false)}
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
