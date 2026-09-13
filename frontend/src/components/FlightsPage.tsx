"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveIataCode } from './AirportAutocomplete';
import { FlightSearchFormState } from './forms/FlightSearchForm';
import FlightHeroSection from './flights/FlightHeroSection';
import ExclusiveFlightOffers from './flights/ExclusiveFlightOffers';
import FlightTopDestinations from './flights/FlightTopDestinations';
import FlightSeoFaq from './flights/FlightSeoFaq';
import PromotionalPopup from './PromotionalPopup';
import ExploreFlightsByAirline from './ExploreFlightsByAirline';

interface FlightsPageProps {
  isCheapFlights?: boolean;
}

export default function FlightsPage({ isCheapFlights = false }: FlightsPageProps = {}) {
  const router = useRouter();
  const [showPromo, setShowPromo] = useState(false);

  React.useEffect(() => {
    if (isCheapFlights) {
      const timer = window.setTimeout(() => {
        setShowPromo(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCheapFlights]);

  const [searchForm, setSearchForm] = useState<FlightSearchFormState>({
    from: "JFK - New York, USA",
    to: "LHR - London, UK",
    departDate: "2026-08-10",
    returnDate: "2026-08-24",
    tripType: "round-trip",
    travelClass: "Economy",
    adults: 1,
    children: 0,
    infants: 0,
  });

  const handleSwap = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = resolveIataCode(searchForm.from);
    const toCode = resolveIataCode(searchForm.to);
    const query = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date: searchForm.departDate,
      class: searchForm.travelClass,
    }).toString();
    router.push(`/?${query}`);
  };

  const handleSelectDestination = (destinationName: string) => {
    setSearchForm(prev => ({
      ...prev,
      to: destinationName,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Hero Banner & Flight Search Engine */}
      <FlightHeroSection
        isCheapFlights={isCheapFlights}
        searchForm={searchForm}
        onSearchFormChange={setSearchForm}
        onSearchSubmit={handleSearchSubmit}
        onSwap={handleSwap}
      />

      {/* 2. Exclusive Flight Offers & Coupon Codes Slider */}
      <ExclusiveFlightOffers />

      {/* 2.5 Explore Flights by Airline */}
      <ExploreFlightsByAirline />

      {/* 3. Top Destinations Grid */}
      <FlightTopDestinations onSelectDestination={handleSelectDestination} />

      {/* 4. SEO Content & FAQ Section */}
      <FlightSeoFaq isCheapFlights={isCheapFlights} />

      {/* 5. Promotional Lowest Flight Popup - Exclusively displayed on Cheap Flights page */}
      {isCheapFlights && showPromo && (
        <PromotionalPopup
          route="New York (JFK) to London (LHR)"
          minPrice={499}
          onClose={() => setShowPromo(false)}
        />
      )}
    </div>
  );
}
