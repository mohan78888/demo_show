"use client";

import React, { useState, useEffect } from 'react';
import { Flight, SearchParams } from '../types';
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

interface FlightBookingModalProps {
  isOpen: boolean;
  flight: Flight | null;
  searchParams?: SearchParams | null;
  onClose: () => void;
}

const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  isOpen,
  flight,
  searchParams,
  onClose,
}) => {
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showPassportFields, setShowPassportFields] = useState(false);

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

  // Sync currency from local storage
  useEffect(() => {
    setCurrency(getSavedCurrency());
  }, [isOpen]);

  // Auto-populate initial passenger count from searchParams
  useEffect(() => {
    if (isOpen && flight) {
      setIsSuccess(false);
      setErrorMessage('');
      setSubmittedRequestId('');

      const count = Number(searchParams?.passengers) || 1;
      const initialPaxList: PassengerFormData[] = [];
      for (let i = 0; i < Math.max(1, Math.min(count, 9)); i++) {
        initialPaxList.push({
          paxType: 'Adult',
          title: i === 0 ? 'Mr' : 'Ms',
          firstName: '',
          lastName: '',
          gender: i === 0 ? 'Male' : 'Female',
          age: 30,
          dob: '',
          passportNumber: '',
          nationality: 'Indian',
        });
      }
      setPassengers(initialPaxList);

      // Auto-detect international route for passport prompt
      const isInternational =
        (flight.origin && flight.destination && (flight.origin.length === 3 || flight.destination.length === 3)) &&
        (flight.origin !== 'DEL' && flight.destination !== 'BOM' && flight.destination !== 'BLR');
      setShowPassportFields(Boolean(isInternational));
    }
  }, [isOpen, flight, searchParams]);

  if (!isOpen || !flight) return null;

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
        age: type === 'Child' ? 8 : type === 'Infant' ? 1 : 25,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic Validation
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
      } else {
        throw new Error(result.message || 'Failed to submit booking request.');
      }
    } catch (err: any) {
      console.error('Booking request submission error:', err);
      setErrorMessage(err?.message || 'Something went wrong while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertedPrice = convertINR(flight.price, currency.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0 border-b border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
              ✈️
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                {isSuccess ? 'Booking Request Confirmed' : 'Flight Booking Request'}
              </h3>
              <p className="text-xs text-slate-300">
                {flight.origin} &rarr; {flight.destination} • {flight.airline} {flight.flightNumber || ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {isSuccess ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="text-center py-6 px-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10 animate-bounce">
                ✓
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Booking Request Received!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-800 dark:text-slate-200">{customerName}</strong>. Your request has been saved and our travel desk has been alerted.
                </p>
              </div>

              {/* Request ID Badge */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Request Reference ID:</span>
                  <span className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                    {submittedRequestId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Itinerary:</span>
                  <span className="font-bold">{flight.origin} &rarr; {flight.destination} ({flight.airline})</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Passengers:</span>
                  <span className="font-bold">{passengers.length} Traveler(s)</span>
                </div>
              </div>

              {/* What Happens Next Notice */}
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 text-blue-900 dark:text-blue-200">
                <p className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                  <span>📞</span> What happens next?
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>A confirmation email has been sent to <strong>{customerEmail}</strong>.</li>
                  <li>Our flight executive will call you at <strong>{customerMobile}</strong> to confirm passenger details and payment options.</li>
                  <li>This is a booking request with free fare-hold guarantee.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:18887918007"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>📞 Call Offline Desk: +1 (888) 791-8007</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING REQUEST FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Flight Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{flight.airline}</span>
                    <span className="text-xs text-slate-400 font-mono">{flight.flightNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md">
                      {flight.class || 'Economy'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">
                    {flight.origin} ({flight.departureTime}) &rarr; {flight.destination} ({flight.arrivalTime}) • {flight.duration}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-xs text-slate-400 block font-medium">Estimated Total</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {currency.symbol}{convertedPrice.toLocaleString()} {currency.code}
                  </span>
                </div>
              </div>

              {/* Free Fare-Hold & Zero Payment Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <span className="text-base shrink-0">🏷️</span>
                <p>
                  <strong>Zero-Risk Booking Request:</strong> No immediate online card payment required. Submit your passenger details to hold this fare while our offline desk verifies secret discounts.
                </p>
              </div>

              {/* Section 1: Customer Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Contact Details</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 normal-case font-semibold">(For ticket & confirmation)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Passengers Roster */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    2. Passenger Information ({passengers.length})
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddPassenger('Adult')}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    >
                      + Add Adult
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPassenger('Child')}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                    >
                      + Add Child
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {passengers.map((pax, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 rounded-2xl space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center text-[10px]">
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
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            Type
                          </label>
                          <select
                            value={pax.paxType}
                            onChange={(e) => handlePassengerChange(idx, 'paxType', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                          >
                            <option value="Adult">Adult (12+)</option>
                            <option value="Child">Child (2-11)</option>
                            <option value="Infant">Infant (&lt;2)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            Title
                          </label>
                          <select
                            value={pax.title}
                            onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Master">Master</option>
                            <option value="Dr">Dr</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="First Name"
                            value={pax.firstName}
                            onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Last Name"
                            value={pax.lastName}
                            onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Gender & Age / Passport Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            Gender
                          </label>
                          <select
                            value={pax.gender}
                            onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            Age
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={pax.age || ''}
                            onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                          />
                        </div>

                        {showPassportFields && (
                          <>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                                Passport No (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="A1234567"
                                value={pax.passportNumber || ''}
                                onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                                Nationality
                              </label>
                              <input
                                type="text"
                                placeholder="Indian"
                                value={pax.nationality || ''}
                                onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Special Requests / Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Special Requests / Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Vegetarian meal, wheelchair assistance, window seat preference, etc."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Submit & Cancel Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Submit Booking Request →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBookingModal;
