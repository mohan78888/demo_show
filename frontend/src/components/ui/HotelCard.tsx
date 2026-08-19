"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

export interface RecommendedHotel {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  image: string;
  rating: number;
  reviewsCount?: number;
  price: number;
  originalPrice: number;
  tag?: string;
}

interface HotelCardProps {
  hotel: RecommendedHotel;
  onBookNow?: (hotel: RecommendedHotel) => void;
  className?: string;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onBookNow,
  className = "",
}) => {
  return (
    <div className={`group bg-white dark:bg-slate-900 rounded-none shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden border border-slate-200/80 dark:border-slate-800/80 ${className}`}>
      <div>
        {/* Hotel Image & Rating Overlay */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

          {/* Tag / Discount Badge */}
          {hotel.tag && (
            <span className="absolute top-3 left-3 bg-[#E8A11A] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md">
              {hotel.tag}
            </span>
          )}

          {/* Star Rating Badge */}
          <div className="absolute top-3 right-3 bg-slate-950/80 text-white backdrop-blur-md px-2 py-1 rounded-md text-xs font-extrabold flex items-center gap-1 shadow-md border border-white/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
          </div>
        </div>

        {/* Card Content (Title, Description, Location) */}
        <div className="p-4 text-left space-y-2">
          {/* Hotel Name - Left Aligned */}
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {hotel.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed line-clamp-2">
            {hotel.subtitle}
          </p>

          {/* Location Badge */}
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#E8A11A] shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </p>
        </div>
      </div>

      {/* Card Footer (Price in USD & Sky Blue CTA Buttons) */}
      <div className="p-4 pt-0 text-left space-y-3">
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Starting from</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                ${hotel.price}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${hotel.originalPrice}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">/ night</span>
            </div>
          </div>
        </div>

        {/* Single Sky-Blue "Book Now" Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onBookNow && onBookNow(hotel)}
            className="w-full h-9 bg-[#47A2F5] hover:bg-[#3492e8] text-white font-extrabold text-xs rounded-md shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center tracking-wider uppercase"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
