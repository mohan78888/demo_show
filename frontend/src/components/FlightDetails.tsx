"use client";

import React, { useState, useEffect } from 'react';
import { Flight, SearchParams, SSRGroup, SSRItem } from '../types';
import { flightService } from '../services/flightService';
import { convertINR, getSavedCurrency, CURRENCIES, CurrencyOption } from '../lib/currency';

export interface PassengerFormData {
  paxType: 'Adult' | 'Child' | 'Infant';
  title: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  age?: number;
  dob?: string;
  passportNumber?: string;
  nationality?: string;
}

interface FlightDetailsProps {
  flight: Flight;
  searchParams?: SearchParams | null;
  onBack: () => void;
  ssrData?: SSRGroup | null;
  isFareChanged?: boolean;
  originalPrice?: number;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ 
  flight, 
  searchParams, 
  onBack,
  ssrData = null,
  isFareChanged = false,
  originalPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'fare' | 'baggage' | 'policy'>('fare');
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Selected SSR Add-ons State
  const [selectedSSRs, setSelectedSSRs] = useState<{ [key: string]: SSRItem }>({});

  // Customer Contact State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [showPassportFields, setShowPassportFields] = useState<boolean>(false);

  // Dynamic Passenger List
  const [passengers, setPassengers] = useState<PassengerFormData[]>([
    {
      paxType: 'Adult',
      title: 'Mr',
      firstName: '',
      lastName: '',
      gender: 'Male',
      age: 28,
      dob: '',
      passportNumber: '',
      nationality: 'Indian',
    },
  ]);

  useEffect(() => {
    setCurrency(getSavedCurrency());
    const handleCurrencyChange = () => setCurrency(getSavedCurrency());
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  // Initialize initial passengers count from searchParams
  useEffect(() => {
    if (flight) {
      const count = Number(searchParams?.passengers) || 1;
      const initialPaxList: PassengerFormData[] = [];
      for (let i = 0; i < Math.max(1, Math.min(count, 9)); i++) {
        initialPaxList.push({
          paxType: 'Adult',
          title: i === 0 ? 'Mr' : 'Ms',
          firstName: '',
          lastName: '',
          gender: i === 0 ? 'Male' : 'Female',
          age: 28,
          dob: '',
          passportNumber: '',
          nationality: 'Indian',
        });
      }
      setPassengers(initialPaxList);

      // Auto-detect international route for passport fields
      const isInternational =
        flight.origin && flight.destination &&
        (flight.origin.length === 3 || flight.destination.length === 3) &&
        (flight.origin !== 'DEL' && flight.destination !== 'BOM');
      setShowPassportFields(Boolean(isInternational));
    }
  }, [flight, searchParams]);

  const handleAddPassenger = (type: 'Adult' | 'Child' | 'Infant' = 'Adult') => {
    if (passengers.length >= 9) return;
    setPassengers((prev) => [
      ...prev,
      {
        paxType: type,
        title: type === 'Infant' ? 'Master' : type === 'Child' ? 'Master' : 'Mr',
        firstName: '',
        lastName: '',
        gender: 'Male',
        age: type === 'Child' ? 8 : type === 'Infant' ? 1 : 28,
        dob: '',
        passportNumber: '',
        nationality: 'Indian',
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePassengerChange = (index: number, field: keyof PassengerFormData, value: any) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!customerMobile.trim() || customerMobile.trim().length < 7) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setErrorMessage(`Please enter first and last name for Passenger ${i + 1}.`);
        return;
      }
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          mobile: customerMobile.trim(),
        },
        flight: {
          airline: flight.airline,
          flightNumber: flight.flightNumber || '',
          origin: flight.origin,
          destination: flight.destination,
          departureTime: flight.departureTime || '',
          arrivalTime: flight.arrivalTime || '',
          duration: flight.duration || '',
          travelDate: searchParams?.date || new Date().toISOString().split('T')[0],
          returnDate: searchParams?.returnDate || '',
          travelClass: flight.class || searchParams?.travelClass || 'Economy',
          price: flight.price || 0,
          currency: currency.code,
          stops: flight.stops || 0,
        },
        passengers: passengers.map((p) => ({
          paxType: p.paxType,
          title: p.title,
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          gender: p.gender,
          age: Number(p.age) || undefined,
          dob: p.dob || undefined,
          passportNumber: p.passportNumber?.trim() || undefined,
          nationality: p.nationality?.trim() || undefined,
        })),
        remarks: remarks.trim(),
      };

      const result = await flightService.submitFlightBookingRequest(payload);
      if (result.success && result.requestId) {
        setSubmittedRequestId(result.requestId);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.message || 'Failed to submit booking request.');
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(err?.message || 'Something went wrong while saving your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertedPrice = convertINR(flight.price, currency.code);
  const baseFare = Math.floor(convertedPrice * 0.85);
  const taxes = Math.floor(convertedPrice * 0.15);

  const ssrTotal = Object.values(selectedSSRs).reduce((acc, curr) => {
    return acc + convertINR(curr.amount || 0, currency.code);
  }, 0);
  const estimatedTotal = (convertedPrice * passengers.length) + ssrTotal;

  const handleToggleSSR = (item: SSRItem) => {
    const key = item.key || item.code;
    setSelectedSSRs((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = item;
      }
      return next;
    });
  };

  // Fallback / default SSR add-on options if airline GDS returned empty SSR group
  const defaultMeals: SSRItem[] = [
    { code: 'AVML', key: 'AVML', name: 'Asian Vegetarian Meal', desc: 'Flavored vegetarian meal prepared with Indian herbs and spices', amount: 0, currency: 'INR', type: 'Meal' },
    { code: 'VGML', key: 'VGML', name: 'Vegan / Pure Veg Meal', desc: 'Strict vegetarian meal with fresh vegetables and fruits', amount: 0, currency: 'INR', type: 'Meal' },
    { code: 'HNML', key: 'HNML', name: 'Hindu Non-Vegetarian', desc: 'Curried meat or poultry prepared in Indian style (No beef or pork)', amount: 350, currency: 'INR', type: 'Meal' },
  ];

  const defaultBaggage: SSRItem[] = [
    { code: 'XB05', key: 'XB05', name: 'Extra 5 KG Check-in Baggage', desc: 'Pre-book excess baggage allowance for 5 KG', amount: 1200, currency: 'INR', type: 'Baggage' },
    { code: 'XB10', key: 'XB10', name: 'Extra 10 KG Check-in Baggage', desc: 'Pre-book excess baggage allowance for 10 KG', amount: 2200, currency: 'INR', type: 'Baggage' },
  ];

  const defaultWheelchair: SSRItem[] = [
    { code: 'WCHR', key: 'WCHR', name: 'Wheelchair Assistance (Ramp)', desc: 'Passenger can climb stairs and walk to seat, assistance for distance', amount: 0, currency: 'INR', type: 'Wheelchair' },
  ];

  const displayMeals = (ssrData?.meals && ssrData.meals.length > 0) ? ssrData.meals : defaultMeals;
  const displayBaggage = (ssrData?.baggage && ssrData.baggage.length > 0) ? ssrData.baggage : defaultBaggage;
  const displayWheelchair = (ssrData?.wheelchair && ssrData.wheelchair.length > 0) ? ssrData.wheelchair : defaultWheelchair;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>←</span>
              <span>Back to Flights</span>
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{flight.origin}</span>
                <span className="text-blue-600">→</span>
                <span>{flight.destination}</span>
                <span className="text-xs font-normal text-slate-400">({flight.airline})</span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                {searchParams?.date || 'Selected Travel Date'} • {flight.class || 'Economy Class'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              24/7 Booking Desk Active
            </span>
          </div>
        </div>

        {/* Real-time Reprice Fare Change Notification */}
        {isFareChanged && originalPrice && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <span className="text-xl">ℹ️</span>
            <div>
              <span className="font-extrabold">Airline Real-Time Fare Update:</span> The live fare for this flight was repriced by the airline from{' '}
              <span className="line-through text-slate-400">
                {currency.symbol}{convertINR(originalPrice, currency.code).toLocaleString()}
              </span>{' '}
              to{' '}
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {currency.symbol}{convertedPrice.toLocaleString()} {currency.code}
              </span>{' '}
              to guarantee your seat.
            </div>
          </div>
        )}

        {isSuccess ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/20 animate-bounce">
              ✓
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Booking Request Confirmed!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Thank you, <strong className="text-slate-800 dark:text-slate-200">{customerName}</strong>. Your flight booking request has been securely stored in our database.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Request Reference ID
                </span>
                <span className="font-mono font-black text-base text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                  {submittedRequestId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span>Flight Route:</span>
                <span className="font-bold">{flight.origin} &rarr; {flight.destination} ({flight.airline} {flight.flightNumber || ''})</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span>Travel Date:</span>
                <span className="font-bold">{searchParams?.date || 'Upcoming Travel'}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span>Total Passengers:</span>
                <span className="font-bold">{passengers.length} Passenger(s)</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2 text-blue-900 dark:text-blue-200">
              <p className="font-extrabold flex items-center gap-2 text-blue-800 dark:text-blue-300 text-sm">
                <span>📞</span> What happens next?
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>We have dispatched an automated confirmation email to <strong>{customerEmail}</strong>.</li>
                <li>Our offline travel specialist will call you at <strong>{customerMobile}</strong> within minutes to lock in secret discounts and finalize your e-ticket.</li>
                <li>No online payment was charged. This is a 100% free fare-hold guarantee.</li>
              </ul>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:18887918007"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>📞 Call Offline Desk: +1 (888) 791-8007</span>
              </a>
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer"
              >
                Search More Flights
              </button>
            </div>
          </div>
        ) : (
          /* FULL FLIGHT DETAILS & BOOKING FORM GRID */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT 2 COLUMNS: Flight Details Timeline, Tabs, and Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Flight Itinerary Timeline Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg border border-blue-100 dark:border-slate-700">
                      ✈
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {flight.airline}
                      </h2>
                      <p className="text-xs text-slate-400 font-mono">Flight No: {flight.flightNumber || 'Direct'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg">
                      {flight.class || 'Economy'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                      Free Fare Hold
                    </span>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-3 items-center text-center sm:text-left gap-2 py-2">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{flight.departureTime}</span>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{flight.origin}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{searchParams?.date || 'Departure Date'}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-400 mb-1">{flight.duration}</span>
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
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{flight.arrivalTime}</span>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{flight.destination}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Arrival Station</p>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('fare')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'fare'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Fare Breakdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('baggage')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'baggage'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Baggage Allowance
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('policy')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'policy'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Policy & Changes
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="pt-3 text-xs text-slate-600 dark:text-slate-300">
                    {activeTab === 'fare' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span>Base Airfare (per adult):</span>
                          <span className="font-bold">{currency.symbol}{baseFare.toLocaleString()} {currency.code}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span>Airline Fuel Surcharges & Taxes:</span>
                          <span className="font-bold">{currency.symbol}{taxes.toLocaleString()} {currency.code}</span>
                        </div>
                        <div className="flex justify-between py-1 pt-2 font-extrabold text-slate-900 dark:text-white text-sm">
                          <span>Indicative Fare Total:</span>
                          <span className="text-blue-600 dark:text-blue-400">{currency.symbol}{convertedPrice.toLocaleString()} {currency.code}</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'baggage' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-bold block text-slate-900 dark:text-white">🎒 Cabin Baggage</span>
                          <p className="text-slate-500 mt-1">7 kg per passenger (Handbag/Laptop bag allowed free of charge).</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-bold block text-slate-900 dark:text-white">🧳 Check-in Baggage</span>
                          <p className="text-slate-500 mt-1">15 kg (Domestic) / 25-30 kg (International routes).</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'policy' && (
                      <div className="space-y-2">
                        <p><strong>Date Changes:</strong> Permitted up to 24 hours before scheduled departure. Contact our offline desk for immediate assistance.</p>
                        <p><strong>Cancellations:</strong> As per airline tariff guidelines. Dedicated offline agent helps process maximum eligible refunds.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Integrated Passenger Details & Booking Request Form */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Passenger Details & Booking Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fill in your contact and traveler details to hold this flight fare. No credit card required.
                  </p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  
                  {/* Contact Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span>1. Primary Contact Information</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold normal-case">(For booking confirmation)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amit Verma"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="amit@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 9876543210"
                          value={customerMobile}
                          onChange={(e) => setCustomerMobile(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passengers Roster */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        2. Passenger Information ({passengers.length})
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddPassenger('Adult')}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                        >
                          + Add Adult
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddPassenger('Child')}
                          className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                        >
                          + Add Child
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {passengers.map((pax, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 rounded-2xl space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">
                                {idx + 1}
                              </span>
                              Passenger {idx + 1} ({pax.paxType})
                            </span>
                            {passengers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePassenger(idx)}
                                className="text-red-500 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                              >
                                Remove Passenger
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                Passenger Type
                              </label>
                              <select
                                value={pax.paxType}
                                onChange={(e) => handlePassengerChange(idx, 'paxType', e.target.value)}
                                className="w-full px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                              >
                                <option value="Adult">Adult (12+ yrs)</option>
                                <option value="Child">Child (2-11 yrs)</option>
                                <option value="Infant">Infant (&lt;2 yrs)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                Title
                              </label>
                              <select
                                value={pax.title}
                                onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                                className="w-full px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                              >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Master">Master</option>
                                <option value="Dr">Dr</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                First Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="First Name"
                                value={pax.firstName}
                                onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Last Name"
                                value={pax.lastName}
                                onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                Gender
                              </label>
                              <select
                                value={pax.gender}
                                onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                                className="w-full px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                Age
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="120"
                                placeholder="Age"
                                value={pax.age || ''}
                                onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                              />
                            </div>

                            {showPassportFields && (
                              <>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                    Passport (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Passport No"
                                    value={pax.passportNumber || ''}
                                    onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                    Nationality
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Indian"
                                    value={pax.nationality || ''}
                                    onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Optional Add-ons & Special Services (SSR) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        3. Optional Add-ons & Special Services (SSR)
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {Object.keys(selectedSSRs).length} selected
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4 sm:p-5 space-y-4">
                      {/* In-Flight Meals */}
                      {displayMeals.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="text-sm">🍱</span>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                              In-Flight Meals
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {displayMeals.slice(0, 4).map((meal) => {
                              const key = meal.key || meal.code;
                              const isSelected = Boolean(selectedSSRs[key]);
                              const convertedCost = convertINR(meal.amount || 0, currency.code);

                              return (
                                <div
                                  key={key}
                                  onClick={() => handleToggleSSR(meal)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200'
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {meal.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                      {meal.desc}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className={`text-xs font-extrabold ${meal.amount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                      {meal.amount === 0 ? 'FREE' : `+${currency.symbol}${convertedCost.toLocaleString()}`}
                                    </span>
                                    <div className="mt-1 flex justify-end">
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-600'}`}>
                                        {isSelected ? '✓' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Extra Baggage Allowance */}
                      {displayBaggage.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="text-sm">🧳</span>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                              Additional Check-in Baggage
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {displayBaggage.slice(0, 4).map((bag) => {
                              const key = bag.key || bag.code;
                              const isSelected = Boolean(selectedSSRs[key]);
                              const convertedCost = convertINR(bag.amount || 0, currency.code);

                              return (
                                <div
                                  key={key}
                                  onClick={() => handleToggleSSR(bag)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200'
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {bag.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                      {bag.desc}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                      +{currency.symbol}{convertedCost.toLocaleString()}
                                    </span>
                                    <div className="mt-1 flex justify-end">
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-600'}`}>
                                        {isSelected ? '✓' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Special Assistance / Wheelchair */}
                      {displayWheelchair.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="text-sm">♿</span>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                              Special Assistance
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {displayWheelchair.slice(0, 2).map((wc) => {
                              const key = wc.key || wc.code;
                              const isSelected = Boolean(selectedSSRs[key]);

                              return (
                                <div
                                  key={key}
                                  onClick={() => handleToggleSSR(wc)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200'
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {wc.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                      Complimentary service
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                      FREE
                                    </span>
                                    <div className="mt-1 flex justify-end">
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-600'}`}>
                                        {isSelected ? '✓' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Special Requests / Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Jain meal, wheelchair assistance, aisle seat preference..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 font-semibold">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  {/* Submit Button Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                      🔒 No payment taken today. We verify fares & call you.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-black shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving Request...</span>
                        </>
                      ) : (
                        <span>Submit Flight Booking Request →</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Fare & Trust Summary Card */}
            <div className="space-y-5 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                  Fare Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Fare (x{passengers.length}):</span>
                    <span>{currency.symbol}{(baseFare * passengers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxes & Fees:</span>
                    <span>{currency.symbol}{(taxes * passengers.length).toLocaleString()}</span>
                  </div>
                  {ssrTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Add-ons ({Object.keys(selectedSSRs).length} item{Object.keys(selectedSSRs).length > 1 ? 's' : ''}):</span>
                      <span>+{currency.symbol}{ssrTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-baseline">
                    <span className="font-black text-slate-900 dark:text-white text-sm">Estimated Total:</span>
                    <span className="font-black text-lg text-blue-600 dark:text-blue-400">
                      {currency.symbol}{estimatedTotal.toLocaleString()} {currency.code}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Our Booking Guarantees:</p>
                  <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> Free Fare-Hold Guarantee
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> Exclusive Offline Discounts
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> 24/7 Dedicated Support Agent
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <a
                    href="tel:18887918007"
                    className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <span>📞 Offline Hotline: +1 (888) 791-8007</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default FlightDetails;