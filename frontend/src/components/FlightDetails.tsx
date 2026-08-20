"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Flight, SSRGroup, SSRItem, PassengerInfo } from '../types';
import { flightService } from '../services/flightService';
import { convertINR, getSavedCurrency, CurrencyOption } from '../lib/currency';

interface FlightDetailsProps {
  flight: Flight;
  onBack: () => void;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flight, onBack }) => {
  const [activeTab, setActiveTab] = useState<'fare' | 'baggage' | 'services' | 'policy'>('fare');
  const [currentFlight, setCurrentFlight] = useState<Flight>(flight);
  const [currency, setCurrency] = useState<CurrencyOption>(getSavedCurrency);

  useEffect(() => {
    const handleCurrencyChange = () => setCurrency(getSavedCurrency());
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  const [isRepricing, setIsRepricing] = useState<boolean>(false);
  const [repriceNotice, setRepriceNotice] = useState<{
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    oldPrice?: number;
    newPrice?: number;
    seatsAvailable?: string;
  } | null>(null);

  const [ssrGroup, setSsrGroup] = useState<SSRGroup>({ meals: [], baggage: [], wheelchair: [], other: [] });
  const [isLoadingSSR, setIsLoadingSSR] = useState<boolean>(false);
  const [selectedSSR, setSelectedSSR] = useState<{ [category: string]: SSRItem }>({});

  const [showTravellerModal, setShowTravellerModal] = useState<boolean>(false);
  const [isSubmittingTempBooking, setIsSubmittingTempBooking] = useState<boolean>(false);
  const [tempBookingSuccess, setTempBookingSuccess] = useState<{ bookingRefNo: string; totalAmount: number } | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [isTicketing, setIsTicketing] = useState<boolean>(false);
  const [ticketingError, setTicketingError] = useState<string | null>(null);
  const [ticketingResult, setTicketingResult] = useState<{
    bookingRefNo: string;
    airlinePnr: string;
    ticketNumber: string;
    airlineCode: string;
    status: string;
    totalAmount: number;
  } | null>(null);

  const handleIssueTicket = async () => {
    if (!tempBookingSuccess?.bookingRefNo) return;

    setIsTicketing(true);
    setTicketingError(null);

    try {
      const res = await flightService.issueTicket({
        bookingRefNo: tempBookingSuccess.bookingRefNo,
      });

      if (res.success && res.airlinePnr) {
        const ticketData = {
          bookingRefNo: res.bookingRefNo || tempBookingSuccess.bookingRefNo,
          airlinePnr: res.airlinePnr,
          ticketNumber: res.ticketNumber || `TKT_${Date.now()}`,
          airlineCode: res.airlineCode || 'SG',
          status: 'CONFIRMED',
          flight: currentFlight,
          passengers,
          totalAmount: tempBookingSuccess.totalAmount,
          issuedAt: new Date().toISOString(),
        };

        localStorage.setItem('THD_ISSUED_FLIGHT_TICKET', JSON.stringify(ticketData));
        setTicketingResult({
          bookingRefNo: ticketData.bookingRefNo,
          airlinePnr: ticketData.airlinePnr,
          ticketNumber: ticketData.ticketNumber,
          airlineCode: ticketData.airlineCode,
          status: 'CONFIRMED',
          totalAmount: ticketData.totalAmount,
        });
        setTempBookingSuccess(null);
      } else {
        setTicketingError(res.message || 'Ticketing failed with airline GDS.');
      }
    } catch (err: any) {
      setTicketingError(err?.message || 'Error occurred during e-ticket generation.');
    } finally {
      setIsTicketing(false);
    }
  };


  const [contactEmail, setContactEmail] = useState<string>('guest.traveller@example.com');
  const [contactMobile, setContactMobile] = useState<string>('9876543210');
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      paxId: 1,
      paxType: 0,
      title: 'Mr',
      firstName: 'Guest',
      lastName: 'Traveller',
      gender: 0,
      dob: '1995-05-15',
      pancardNumber: '',
      passportNumber: '',
      passportCountry: '',
      passportExpiry: '',
      nationality: 'Indian',
    },
  ]);

  const [isGst, setIsGst] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>('');
  const [gstHolderName, setGstHolderName] = useState<string>('');
  const [gstAddress, setGstAddress] = useState<string>('');

  useEffect(() => {
    if (currentFlight.fareId && currentFlight.flightKey) {
      setIsLoadingSSR(true);
      flightService.getSSR({
        fareId: currentFlight.fareId,
        flightKey: currentFlight.flightKey,
      }).then((res) => {
        if (res.success && res.ssr) {
          setSsrGroup(res.ssr);
        }
      }).catch((err) => {
        console.error('SSR Fetch error:', err);
      }).finally(() => {
        setIsLoadingSSR(false);
      });
    }
  }, [currentFlight.fareId, currentFlight.flightKey]);

  const toggleSsrItem = (category: string, item: SSRItem) => {
    setSelectedSSR((prev) => {
      const copy = { ...prev };
      if (copy[category]?.code === item.code) {
        delete copy[category];
      } else {
        copy[category] = item;
      }
      return copy;
    });
  };

  const selectedSsrTotal = Object.values(selectedSSR).reduce((sum, item) => sum + (item.amount || 0), 0);
  const baseFare = Math.floor(currentFlight.price * 0.85);
  const taxes = Math.floor(currentFlight.price * 0.12);
  const fees = currentFlight.price - baseFare - taxes;


  const handleBookClick = async () => {
    setIsRepricing(true);
    setRepriceNotice(null);

    try {
      const result = await flightService.repriceFlight({
        fareId: currentFlight.fareId,
        flightKey: currentFlight.flightKey,
        searchKey: (currentFlight as any).searchKey || '',
        flightId: currentFlight.id,
      });


      if (!result.success) {
        setRepriceNotice({
          type: 'error',
          title: 'Seat or Fare Unavailable',
          message: result.message || 'The selected seat or fare is no longer available with the airline.',
        });
      } else {
        // ALWAYS update currentFlight with latest GDS keys from Air_Reprice (Point 1)
        setCurrentFlight((prev) => ({
          ...prev,
          price: result.newPrice || prev.price,
          fareId: result.updatedFareId || prev.fareId,
          flightKey: result.updatedFlightKey || prev.flightKey,
          seatsAvailable: result.seatsAvailable || prev.seatsAvailable,
        }));

        if (result.isFareChanged && result.newPrice && result.newPrice !== currentFlight.price) {
          const oldPrice = currentFlight.price;
          const newPrice = result.newPrice;
          setRepriceNotice({
            type: 'warning',
            title: 'Airline Fare Updated',
            message: `The airline has updated the real-time fare from ₹${oldPrice.toLocaleString()} to ₹${newPrice.toLocaleString()}.`,
            oldPrice,
            newPrice,
            seatsAvailable: result.seatsAvailable,
          });
        } else {
          setRepriceNotice({
            type: 'success',
            title: 'Fare & Seats Verified',
            message: result.message || 'Real-time fare and seat availability confirmed with airline.',
            seatsAvailable: result.seatsAvailable,
          });
        }
        setShowTravellerModal(true);
      }
    } catch (err: any) {
      setRepriceNotice({
        type: 'error',
        title: 'Reprice Error',
        message: err.message || 'Error re-verifying flight with airline.',
      });
    } finally {
      setIsRepricing(false);
    }
  };

  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      {
        paxId: prev.length + 1,
        paxType: 0,
        title: 'Mr',
        firstName: '',
        lastName: '',
        gender: 0,
        dob: '1998-08-20',
        pancardNumber: '',
        passportNumber: '',
        passportCountry: '',
        passportExpiry: '',
        nationality: 'Indian',
      },
    ]);
  };

  const removePassenger = (indexToRemove: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) =>
      prev
        .filter((_, idx) => idx !== indexToRemove)
        .map((p, idx) => ({ ...p, paxId: idx + 1 }))
    );
  };

  const handleTempBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    // Validate all passengers according to official Flyshop API specs (Point 3)
    const isIntl = (currentFlight as any).isInternational ||
      (currentFlight.origin && !['DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'AMD', 'PNQ', 'COK', 'GOI'].includes(currentFlight.origin.toUpperCase()));

    for (let i = 0; i < passengers.length; i++) {
      const pax = passengers[i];
      if (!pax.firstName.trim() || !pax.lastName.trim()) {
        setBookingError(`Please enter first name and last name for Passenger ${i + 1}.`);
        return;
      }

      if (isIntl) {
        if (!pax.passportNumber?.trim() || !pax.passportExpiry?.trim() || !pax.passportCountry?.trim()) {
          setBookingError(`Passport number, country, and expiry date are required for Passenger ${i + 1} on international flights.`);
          return;
        }
      }
    }

    if (!contactEmail.trim() || !contactMobile.trim()) {
      setBookingError('Please enter valid contact email and mobile number.');
      return;
    }

    setIsSubmittingTempBooking(true);

    try {
      const ssrDetails = Object.values(selectedSSR).map((item) => ({
        paxId: 1,
        ssrKey: item.key,
      }));

      const res = await flightService.tempBooking({
        flightKey: currentFlight.flightKey || '',
        searchKey: (currentFlight as any).searchKey || '',
        email: contactEmail,
        mobile: contactMobile,
        passengers: passengers,
        bookingSSRDetails: ssrDetails,
        gst: isGst ? { isGst: true, gstNumber, gstHolderName, gstAddress } : undefined,
      });


      if (res.success && res.bookingRefNo) {
        const totalPayableAmount = Math.max(0, currentFlight.price - 200) + selectedSsrTotal;
        const bookingRecord = {
          bookingRefNo: res.bookingRefNo,
          status: 'HOLD',
          flight: currentFlight,
          passengers,
          contact: { email: contactEmail, mobile: contactMobile },
          selectedSSR,
          totalAmount: totalPayableAmount,
          timestamp: Date.now(),
        };

        localStorage.setItem('THD_FLIGHT_TEMP_BOOKING', JSON.stringify(bookingRecord));
        setTempBookingSuccess({
          bookingRefNo: res.bookingRefNo,
          totalAmount: totalPayableAmount,
        });
        setShowTravellerModal(false);
      } else {
        setBookingError(res.message || 'Unable to complete hold booking with airline GDS.');
      }
    } catch (err: any) {
      setBookingError(err?.message || 'An error occurred while creating temporary booking.');
    } finally {
      setIsSubmittingTempBooking(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-950 transition-colors duration-300">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-8 font-semibold text-sm"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search Results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Itinerary Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden">
            {/* Itinerary Header */}
            <div className="bg-slate-900 dark:bg-slate-800 p-6 flex items-center justify-between text-white">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center relative">
                   <Image src={flight.airlineLogo} alt={flight.airline} fill unoptimized className="object-contain p-1.5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg leading-tight">{flight.airline} <span className="text-slate-400 font-normal mx-2">|</span> <span className="text-blue-400 dark:text-blue-300">Flight TH-402</span></h3>
                   <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{flight.class} Class</p>
                 </div>
               </div>
               <div className="hidden md:block text-right">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600">Scheduled Departure</p>
                 <p className="text-sm font-bold text-blue-400 dark:text-blue-300">{flight.departureTime}</p>
               </div>
            </div>

            {/* Flight Path Visual */}
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[40%] h-px bg-slate-100 dark:bg-slate-800 hidden md:block">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{flight.departureTime}</span>
                  <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tight">{flight.origin}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-600 mt-1">Indira Gandhi Intl Airport, T3</p>
                  <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    On Time
                  </div>
                </div>

                <div className="flex flex-col items-center py-4 md:py-0">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">{flight.duration}</span>
                  </div>
                  <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 md:hidden"></div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                  <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{flight.arrivalTime}</span>
                  <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tight">{flight.destination}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-600 mt-1">Chhatrapati Shivaji Intl Airport, T2</p>
                  <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    2.2 km to City Center
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Tabs Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden">
             <div className="flex flex-wrap border-b border-slate-100 dark:border-slate-800">
               {[
                 { id: 'fare', label: 'Fare Summary', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5L12 2z' },
                 { id: 'baggage', label: 'Baggage Allowance', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                 { id: 'services', label: 'Add-ons (SSR)', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                 { id: 'policy', label: 'Cancellation Rules', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
               ].map((tab) => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 min-w-[140px] py-5 px-4 flex items-center justify-center gap-2 text-xs md:text-sm font-bold transition-all relative ${
                     activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                   }`}
                 >
                   <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
                   <span>{tab.label}</span>
                   {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-500"></div>}
                 </button>
               ))}
             </div>
             
             <div className="p-8 md:p-10">
                {activeTab === 'fare' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                       <div className="flex flex-col">
                         <span className="text-slate-800 dark:text-white font-bold">Base Fare</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Adult(s) (1 X {currency.symbol}{convertINR(baseFare, currency.code).toLocaleString()})</span>
                       </div>
                       <span className="font-bold text-slate-900 dark:text-white text-lg">{currency.symbol}{convertINR(baseFare, currency.code).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                       <div className="flex flex-col">
                         <span className="text-slate-800 dark:text-white font-bold">Taxes & Fees</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Fuel surcharge, Airport fees, GST</span>
                       </div>
                       <span className="font-bold text-slate-900 dark:text-white text-lg">{currency.symbol}{convertINR(taxes + fees, currency.code).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center pt-6">
                       <div className="flex flex-col">
                         <span className="text-xl font-black text-slate-900 dark:text-white">Total Fare</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Inclusive of all taxes and surcharges ({currency.code})</span>
                       </div>
                       <span className="text-3xl font-black text-blue-900 dark:text-blue-400">{currency.symbol}{convertINR(currentFlight.price, currency.code).toLocaleString()}</span>
                     </div>
                     <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex gap-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-orange-900 dark:text-orange-200">Price Guarantee</p>
                          <p className="text-xs text-orange-700 dark:text-orange-400/80 leading-relaxed mt-1">Found a lower price elsewhere? We'll match it and give you double the difference as Tour Help Desk credits!</p>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'baggage' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex items-start gap-5">
                           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 shrink-0">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white text-lg">Check-in Luggage</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">15 kg per person</p>
                             <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-3">Maximum dimensions: Length + Breadth + Height should not exceed 158 cm (62 inches).</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-5">
                           <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white text-lg">Cabin Baggage</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">7 kg per person</p>
                             <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-3">Maximum dimensions: 55 cm x 35 cm x 25 cm. Must fit in the overhead bin or under the seat.</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-8">
                    {isLoadingSSR ? (
                      <div className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-xs font-bold text-slate-400">Loading live Special Service Requests (SSRs) from airline...</p>
                      </div>
                    ) : (
                      <>
                        {/* 🍱 MEALS SECTION (Skipped if unavailable) */}
                        {ssrGroup.meals && ssrGroup.meals.length > 0 && (
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                              <span>🍱 In-Flight Meals</span>
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                                {ssrGroup.meals.length} Options
                              </span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ssrGroup.meals.map((item) => {
                                const isSelected = selectedSSR['meals']?.code === item.code;
                                return (
                                  <div
                                    key={item.code || item.name}
                                    onClick={() => toggleSsrItem('meals', item)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-500/20'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                                    }`}
                                  >
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-white text-xs">{item.name}</h5>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Code: {item.code}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                        {item.amount === 0 ? 'Free' : `+₹${item.amount.toLocaleString()}`}
                                      </span>
                                      {isSelected && (
                                        <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Selected</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 🧳 EXTRA BAGGAGE SECTION (Skipped if unavailable) */}
                        {ssrGroup.baggage && ssrGroup.baggage.length > 0 && (
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                              <span>🧳 Prepaid Extra Baggage</span>
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                                {ssrGroup.baggage.length} Options
                              </span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ssrGroup.baggage.map((item) => {
                                const isSelected = selectedSSR['baggage']?.code === item.code;
                                return (
                                  <div
                                    key={item.code || item.name}
                                    onClick={() => toggleSsrItem('baggage', item)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-500/20'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                                    }`}
                                  >
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-white text-xs">{item.name}</h5>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Code: {item.code}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                        +₹{item.amount.toLocaleString()}
                                      </span>
                                      {isSelected && (
                                        <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Selected</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 👨‍🦽 WHEELCHAIR SECTION (Skipped if unavailable) */}
                        {ssrGroup.wheelchair && ssrGroup.wheelchair.length > 0 && (
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                              <span>👨‍🦽 Wheelchair & Special Assistance</span>
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                                Available
                              </span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ssrGroup.wheelchair.map((item) => {
                                const isSelected = selectedSSR['wheelchair']?.code === item.code;
                                return (
                                  <div
                                    key={item.code || item.name}
                                    onClick={() => toggleSsrItem('wheelchair', item)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-500/20'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                                    }`}
                                  >
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-white text-xs">{item.name}</h5>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Code: {item.code}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                        {item.amount === 0 ? 'Complimentary' : `+₹${item.amount.toLocaleString()}`}
                                      </span>
                                      {isSelected && (
                                        <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Selected</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ⚡ OTHER PRIORITY ADD-ONS (Skipped if unavailable) */}
                        {ssrGroup.other && ssrGroup.other.length > 0 && (
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                              <span>⚡ Priority & Extra Add-ons</span>
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                                {ssrGroup.other.length} Options
                              </span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ssrGroup.other.map((item) => {
                                const isSelected = selectedSSR['other']?.code === item.code;
                                return (
                                  <div
                                    key={item.code || item.name}
                                    onClick={() => toggleSsrItem('other', item)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-500/20'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                                    }`}
                                  >
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-white text-xs">{item.name}</h5>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Code: {item.code}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                        +₹{item.amount.toLocaleString()}
                                      </span>
                                      {isSelected && (
                                        <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Selected</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Fallback if no SSR options available */}
                        {(!ssrGroup.meals || ssrGroup.meals.length === 0) &&
                         (!ssrGroup.baggage || ssrGroup.baggage.length === 0) &&
                         (!ssrGroup.wheelchair || ssrGroup.wheelchair.length === 0) &&
                         (!ssrGroup.other || ssrGroup.other.length === 0) && (
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              Standard fare includes default baggage & cabin allowance. No optional GDS add-ons required for this ticket class.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}


                {activeTab === 'policy' && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] border border-blue-100 dark:border-blue-900/30">
                       <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                       <div>
                          <h4 className="font-bold text-blue-900 dark:text-blue-300">Hawk-Shield Cancellation</h4>
                          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-1">Full refund for medical emergencies or valid reasons. Standard policies apply otherwise.</p>
                       </div>
                     </div>
                     
                     <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-8">
                        <div className="relative">
                           <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                           <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Before 96 Hours</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Free Cancellation</p>
                              </div>
                              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">100% Refund</span>
                           </div>
                        </div>
                        <div className="relative">
                           <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                           <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-800 dark:text-white">24 to 96 Hours</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Flat cancellation fee of $3,500 applies</p>
                              </div>
                              <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">Partial Refund</span>
                           </div>
                        </div>
                        <div className="relative">
                           <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                           <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Less than 24 Hours</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Non-refundable or Rebooking available</p>
                              </div>
                              <span className="text-red-500 dark:text-red-400 text-sm font-bold">No Refund</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none p-8 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-0"></div>
                          <div className="relative z-10">
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Fare Summary</h4>
                
                {repriceNotice && (
                  <div
                    className={`mb-6 p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 ${
                      repriceNotice.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : repriceNotice.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {repriceNotice.type === 'warning' && '⚠️ '}
                      {repriceNotice.type === 'error' && '❌ '}
                      {repriceNotice.type === 'success' && '✅ '}
                      <span>{repriceNotice.title}</span>
                    </div>
                    <p>{repriceNotice.message}</p>
                    {repriceNotice.seatsAvailable && (
                      <p className="mt-1.5 font-bold uppercase tracking-wider text-[10px]">
                        Available Seats: {repriceNotice.seatsAvailable}
                      </p>
                    )}
                  </div>
                )}

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">Adult Fare (x1)</span>
                      <span className="text-slate-900 dark:text-white font-black">{currency.symbol}{convertINR(baseFare, currency.code).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">Fee & Surcharges</span>
                      <span className="text-slate-900 dark:text-white font-black">{currency.symbol}{convertINR(taxes + fees, currency.code).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">Convenience Discount</span>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-[9px] font-black text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase">Auto</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">-{currency.symbol}{convertINR(200, currency.code).toLocaleString()}</span>
                    </div>
                    
                    {selectedSsrTotal > 0 && (
                      <div className="flex justify-between text-sm pt-2 border-t border-dashed border-blue-100 dark:border-blue-900/40">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Selected Add-ons (SSR)</span>
                        <span className="text-blue-600 dark:text-blue-400 font-black">+{currency.symbol}{convertINR(selectedSsrTotal, currency.code).toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Total Payable ({currency.code})</span>
                        <span className="text-3xl font-black text-blue-900 dark:text-blue-400">
                          {currency.symbol}{convertINR(Math.max(0, currentFlight.price - 200) + selectedSsrTotal, currency.code).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 underline decoration-dotted cursor-pointer">View Breakdown</span>
                    </div>

                
                <button 
                  onClick={handleBookClick}
                  disabled={isRepricing}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 mb-4 group flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isRepricing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Real-Time Fare...</span>
                    </>
                  ) : (
                    <>
                      <span>Book Flight Ticket</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                     <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">100% Secure Checkout</span>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">By booking, you agree to Tour Help Desk's booking policy and airline terms.</p>
                </div>
              </div>
           </div>
        </div>

        {/* TRAVELLER DETAILS FORM MODAL */}
        {showTravellerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
              <div className="bg-slate-900 dark:bg-slate-800 p-6 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-extrabold text-lg">Traveller Information</h3>
                  <p className="text-xs text-slate-400">Required for Flyshop GDS Air_TempBooking</p>
                </div>
                <button
                  onClick={() => setShowTravellerModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleTempBookingSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {bookingError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-200">
                    ⚠️ <strong>Booking Error:</strong> {bookingError}
                  </div>
                )}

                {/* Contact Details */}
                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest">Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>
                </div>

                {/* Passenger Details Header with Add Passenger Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Passenger Information ({passengers.length})</span>
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    + Add Passenger
                  </button>
                </div>

                {/* Passenger Details */}
                {passengers.map((pax, idx) => (
                  <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest">
                        Passenger {idx + 1} ({pax.paxType === 0 ? 'Adult' : pax.paxType === 1 ? 'Child' : 'Infant'})
                      </h4>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(idx)}
                          className="text-[11px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                        <select
                          value={pax.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) => {
                              const copy = [...prev];
                              copy[idx].title = val;
                              copy[idx].gender = val === 'Mrs' || val === 'Ms' ? 1 : 0;
                              return copy;
                            });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          value={pax.firstName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) => {
                              const copy = [...prev];
                              copy[idx].firstName = val;
                              return copy;
                            });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={pax.lastName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) => {
                              const copy = [...prev];
                              copy[idx].lastName = val;
                              return copy;
                            });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={pax.dob || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) => {
                              const copy = [...prev];
                              copy[idx].dob = val;
                              return copy;
                            });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PAN Card Number (Optional)</label>
                        <input
                          type="text"
                          value={pax.pancardNumber || ''}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setPassengers((prev) => {
                              const copy = [...prev];
                              copy[idx].pancardNumber = val;
                              return copy;
                            });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ABCDE1234F"
                        />
                      </div>
                    </div>

                    {/* Optional Passport Section */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Passport Details (For International Travels)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            value={pax.passportNumber || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassengers((prev) => {
                                const copy = [...prev];
                                copy[idx].passportNumber = val;
                                return copy;
                              });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Passport Number"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={pax.passportCountry || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassengers((prev) => {
                                const copy = [...prev];
                                copy[idx].passportCountry = val;
                                return copy;
                              });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Issuing Country (e.g. IND)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional GST Section */}
                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGst}
                      onChange={(e) => setIsGst(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add GST Details (For Corporate Invoicing)</span>
                  </label>

                  {isGst && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div>
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                          placeholder="GSTIN (e.g. 07AAAAA0000A1Z5)"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={gstHolderName}
                          onChange={(e) => setGstHolderName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={gstAddress}
                          onChange={(e) => setGstAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                          placeholder="Registered Address"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowTravellerModal(false)}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTempBooking}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingTempBooking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Hold Booking...</span>
                      </>
                    ) : (
                      <span>Confirm & Create Hold Booking (Air_TempBooking)</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HOLD BOOKING SUCCESS CONFIRMATION MODAL */}
        {tempBookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Temporary Booking Hold Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live GDS PNR lock created via Flyshop Air_TempBooking</p>
              </div>

              {ticketingError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-200 text-left">
                  ⚠️ <strong>Ticketing Error:</strong> {ticketingError}
                </div>
              )}

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Booking Reference (PNR)</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{tempBookingSuccess.bookingRefNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded text-[10px]">HOLD CONFIRMED</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Amount Locked</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">₹{tempBookingSuccess.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleIssueTicket}
                  disabled={isTicketing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isTicketing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Issuing E-Ticket & PNR (Air_Ticketing)...</span>
                    </>
                  ) : (
                    <span>Confirm & Issue E-Ticket (Air_Ticketing)</span>
                  )}
                </button>

                <button
                  onClick={() => setTempBookingSuccess(null)}
                  className="w-full py-2.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Keep on Hold
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL E-TICKET CONFIRMATION RECEIPT MODAL (AIR_TICKETING SUCCESS) */}
        {ticketingResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-lg w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 my-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-950">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                  CONFIRMED & TICKETED
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">E-Ticket Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live Airline PNR & Ticket Number generated via Flyshop Air_Ticketing</p>
              </div>

              {/* Official Ticket Details Card */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Airline PNR</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-lg tracking-wider">{ticketingResult.airlinePnr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Number</span>
                    <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">{ticketingResult.ticketNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Booking RefNo (GDS)</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{ticketingResult.bookingRefNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Booking Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{ticketingResult.status} (Code 11)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Flight Itinerary</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{currentFlight.origin} → {currentFlight.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Total Paid</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">₹{ticketingResult.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-left text-xs space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-300">📄 E-Ticket Receipt Saved</p>
                <p className="text-blue-700 dark:text-blue-400 text-[11px]">
                  Your ticket details have been saved in session storage (<code className="font-mono">THD_ISSUED_FLIGHT_TICKET</code>).
                </p>
              </div>

              <button
                onClick={() => setTicketingResult(null)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl cursor-pointer transition-all"
              >
                Close & Return to Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetails;