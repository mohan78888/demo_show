"use client";

import React, { useState } from 'react';
import { hotelService, HotelDetailInfo } from '../services/hotelService';
import { 
  X, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Building2, 
  Calendar, 
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface HotelBookingModalProps {
  room: any;
  hotel: HotelDetailInfo;
  checkInDate: string;
  checkOutDate: string;
  onClose: () => void;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  room,
  hotel,
  checkInDate,
  checkOutDate,
  onClose
}) => {
  const [step, setStep] = useState<'traveller' | 'confirm' | 'success'>('traveller');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRefNo, setBookingRefNo] = useState('');
  const [voucherId, setVoucherId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage('Please fill in all mandatory guest fields.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Step 1: Call HotelTempBooking
      const fullName = `${firstName} ${lastName}`.trim();
      const tempRes = await hotelService.createTempBooking({
        hotelKey: hotel.hotelKey,
        searchKey: hotel.searchKey,
        recommendationId: room.recommendationId || 'REC1',
        customerName: fullName,
        customerMobile: phone,
        occupantEmail: email,
        panNumber: panNumber || 'ABCDE1234F',
        occupantDetails: [
          {
            FirstName: firstName,
            LastName: lastName,
            Title: 'Mr',
            OccupantType: 1
          }
        ]
      });

      if (!tempRes.success || !tempRes.bookingRefNo) {
        setErrorMessage(tempRes.message || 'Failed to hold temporary booking with hotel API.');
        setIsSubmitting(false);
        return;
      }

      const refNo = tempRes.bookingRefNo;
      setBookingRefNo(refNo);

      // Step 2: Confirm Ticketing via HotelTicketing
      const ticketRes = await hotelService.issueHotelTicket(refNo);
      if (ticketRes.success) {
        setVoucherId(ticketRes.voucherId || `VOUCH_${Date.now()}`);
        setStep('success');
      } else {
        setErrorMessage(ticketRes.message || 'Ticketing confirmation error.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unexpected error during hotel booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-left">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'traveller' && (
          <form onSubmit={handleCreateBooking} className="space-y-5">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                Step 1 of 2: Guest Details
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                Guest & Booking Information
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {hotel.name} • {room.roomName}
              </p>
            </div>

            {/* SUMMARY CARD */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Check-In:</span>
                <span className="text-slate-900 dark:text-white">{checkInDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Check-Out:</span>
                <span className="text-slate-900 dark:text-white">{checkOutDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-900 dark:text-white">Total Amount:</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">₹{room.price.toLocaleString()}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            {/* INPUT FIELDS */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">First Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {hotel.isPANMandatory && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">PAN Card Number *</label>
                  <input
                    type="text"
                    required
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 uppercase"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Holding Reservation & Issuing Ticket...' : 'Confirm Reservation'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Hotel Booking Confirmed!</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Your hotel reservation voucher has been successfully issued.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Booking Ref:</span>
                <span className="text-blue-600 dark:text-blue-400">{bookingRefNo}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Voucher Reference:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{voucherId}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Hotel Name:</span>
                <span className="text-slate-900 dark:text-white">{hotel.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Room Category:</span>
                <span className="text-slate-900 dark:text-white">{room.roomName}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HotelBookingModal;
