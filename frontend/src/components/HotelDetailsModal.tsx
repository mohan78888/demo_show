"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { hotelService, HotelDetailInfo, CancellationPolicyInfo } from '../services/hotelService';
import { 
  X, 
  Star, 
  MapPin, 
  Wifi, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Coffee, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface HotelDetailsModalProps {
  hotelKey: string;
  searchKey: string;
  onClose: () => void;
  onSelectRoom: (room: any, hotelDetail: HotelDetailInfo) => void;
}

const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({
  hotelKey,
  searchKey,
  onClose,
  onSelectRoom
}) => {
  const [details, setDetails] = useState<HotelDetailInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedRoomForPolicy, setSelectedRoomForPolicy] = useState<any | null>(null);
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicyInfo | null>(null);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setIsLoading(true);
      const res = await hotelService.getHotelDetails(hotelKey, searchKey);
      if (isMounted && res) {
        setDetails(res);
      }
      if (isMounted) setIsLoading(false);
    };

    fetchDetails();
    return () => { isMounted = false; };
  }, [hotelKey, searchKey]);

  const handleFetchPolicy = async (room: any) => {
    setSelectedRoomForPolicy(room);
    setIsLoadingPolicy(true);
    const policy = await hotelService.getCancellationPolicy(
      hotelKey, 
      searchKey, 
      room.ratePlanId || 'RP1', 
      room.recommendationId || 'REC1'
    );
    setCancellationPolicy(policy);
    setIsLoadingPolicy(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Fetching Hotel Details...</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Loading rooms, rates, amenities & live availability</p>
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 relative text-left">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. PHOTO GALLERY HERO */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950 overflow-hidden rounded-t-3xl">
          {details.photos && details.photos.length > 0 && (
            <Image
              src={details.photos[selectedPhotoIndex] || details.photos[0]}
              alt={details.name}
              fill
              className="object-cover transition-all duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Thumbnail Strip Overlay */}
          {details.photos && details.photos.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {details.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedPhotoIndex === idx ? 'border-amber-400 scale-105 shadow-lg' : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-500 flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{details.rating} Star Luxury</span>
          </div>
        </div>

        {/* 2. HOTEL HEADER INFO */}
        <div className="p-5 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {details.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{details.address}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-In</p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">{details.checkInTime}</p>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-Out</p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">{details.checkOutTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-sm uppercase font-black tracking-wider text-slate-400 mb-2">About The Property</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {details.description}
            </p>
          </div>

          {/* AMENITIES */}
          <div>
            <h3 className="text-sm uppercase font-black tracking-wider text-slate-400 mb-3">Featured Hotel Amenities</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {details.amenities.map((item, idx) => (
                <span 
                  key={idx} 
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/40 px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CANCELLATION POLICY MODAL INSET */}
          {selectedRoomForPolicy && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Cancellation & Refund Terms ({selectedRoomForPolicy.roomName})
                </h4>
                <button onClick={() => setSelectedRoomForPolicy(null)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Close</button>
              </div>

              {isLoadingPolicy ? (
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Fetching live policy terms from Flyshop API...</p>
              ) : cancellationPolicy ? (
                <div className="text-xs space-y-1 font-medium text-slate-700 dark:text-slate-300">
                  <p><strong className="text-slate-900 dark:text-white">Free Cancellation Deadline:</strong> {cancellationPolicy.freeCancellationDate}</p>
                  <p><strong className="text-slate-900 dark:text-white">Charges:</strong> {cancellationPolicy.cancellationCharges}</p>
                  <p><strong className="text-slate-900 dark:text-white">Refund Policy:</strong> {cancellationPolicy.remarks}</p>
                </div>
              ) : null}
            </div>
          )}

          {/* 3. AVAILABLE ROOM CATEGORIES & PRICING */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              Select Your Room Category
            </h3>

            <div className="space-y-4">
              {details.rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-all hover:border-blue-500"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{room.roomName}</h4>
                      {room.freeCancellation && (
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          Free Cancellation
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-blue-500" />
                      <span>{room.inclusion}</span>
                    </p>
                    <button
                      onClick={() => handleFetchPolicy(room)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Check Cancellation Rules</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-700">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Price per night</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">₹{room.price.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => onSelectRoom(room, details)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HotelDetailsModal;
