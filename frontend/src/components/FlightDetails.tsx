"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Flight } from '../types';

interface FlightDetailsProps {
  flight: Flight;
  onBack: () => void;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flight, onBack }) => {
  const [activeTab, setActiveTab] = useState<'fare' | 'baggage' | 'policy'>('fare');

  const baseFare = Math.floor(flight.price * 0.85);
  const taxes = Math.floor(flight.price * 0.12);
  const fees = flight.price - baseFare - taxes;

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
                 { id: 'policy', label: 'Cancellation Rules', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
               ].map((tab) => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 min-w-[150px] py-5 px-6 flex items-center justify-center gap-3 text-sm font-bold transition-all relative ${
                     activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                   }`}
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
                   {tab.label}
                   {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-500"></div>}
                 </button>
               ))}
             </div>
             
             <div className="p-10">
                {activeTab === 'fare' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                       <div className="flex flex-col">
                         <span className="text-slate-800 dark:text-white font-bold">Base Fare</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Adult(s) (1 X ${baseFare.toLocaleString()})</span>
                       </div>
                       <span className="font-bold text-slate-900 dark:text-white text-lg">${baseFare.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                       <div className="flex flex-col">
                         <span className="text-slate-800 dark:text-white font-bold">Taxes & Fees</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Fuel surcharge, Airport fees, GST</span>
                       </div>
                       <span className="font-bold text-slate-900 dark:text-white text-lg">${(taxes + fees).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center pt-6">
                       <div className="flex flex-col">
                         <span className="text-xl font-black text-slate-900 dark:text-white">Total Fare</span>
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Inclusive of all taxes and surcharges</span>
                       </div>
                       <span className="text-3xl font-black text-blue-900 dark:text-blue-400">${flight.price.toLocaleString()}</span>
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
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 border-dashed">
                        <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">Extra Baggage</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pre-book extra luggage starting at just $400 per 5 kg. Adding baggage at the airport costs significantly more.</p>
                     </div>
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
                
                <div className="space-y-5 mb-10">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500 dark:text-slate-400 font-bold">Adult Fare (x1)</span>
                     <span className="text-slate-900 dark:text-white font-black">${baseFare.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500 dark:text-slate-400 font-bold">Fee & Surcharges</span>
                     <span className="text-slate-900 dark:text-white font-black">${(taxes + fees).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <div className="flex items-center gap-2">
                       <span className="text-slate-500 dark:text-slate-400 font-bold">Convenience Discount</span>
                       <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-[9px] font-black text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase">Auto</span>
                     </div>
                     <span className="text-emerald-600 dark:text-emerald-400 font-black">-$200</span>
                   </div>
                   
                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Total Payable</span>
                       <span className="text-3xl font-black text-blue-900 dark:text-blue-400">${(flight.price - 200).toLocaleString()}</span>
                     </div>
                     <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 underline decoration-dotted cursor-pointer">View Breakdown</span>
                   </div>
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 mb-4 group flex items-center justify-center gap-3">
                  <span>Book Flight Ticket</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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
      </div>
    </div>
  );
};

export default FlightDetails;