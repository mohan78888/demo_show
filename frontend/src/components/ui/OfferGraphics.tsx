"use client";

import React from 'react';

export function RedBusGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M12 22 C12 14, 22 10, 38 10 L102 10 C110 10, 115 14, 115 22 L115 48 C115 54, 110 57, 100 57 L18 57 C12 57, 12 52, 12 48 Z" fill="#EF4444" />
        <path d="M14 20 C14 15, 20 12, 30 12 L34 12 L34 30 L14 30 Z" fill="#93C5FD" opacity="0.9" />
        <path d="M38 13 L52 13 L52 26 L38 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M55 13 L69 13 L69 26 L55 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M72 13 L86 13 L86 26 L72 26 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M89 13 L103 13 L103 26 L89 26 Z" fill="#1E3A8A" opacity="0.75" />
        <circle cx="18" cy="42" r="3" fill="#FEF08A" />
        <circle cx="34" cy="57" r="7" fill="#0F172A" />
        <circle cx="34" cy="57" r="3.5" fill="#94A3B8" />
        <circle cx="88" cy="57" r="7" fill="#0F172A" />
        <circle cx="88" cy="57" r="3.5" fill="#94A3B8" />
      </svg>
    </div>
  );
}

export function PrimoOfferGraphic() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-amber-300 flex flex-col items-center justify-center text-center w-24 h-14">
        <span className="text-[10px] font-black text-indigo-950 uppercase tracking-tighter leading-none">Primo</span>
        <span className="text-xs font-black text-blue-600 uppercase tracking-tight leading-none mt-0.5">Monsoon</span>
        <span className="text-[8px] font-extrabold text-amber-600 uppercase tracking-widest leading-none mt-0.5">Offer</span>
      </div>
    </div>
  );
}

export function BankBadgeGraphic() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="bg-white rounded-xl p-1.5 shadow-md border border-rose-200 flex items-center gap-1.5 w-24 h-12">
        <div className="w-5 h-5 rounded bg-red-700 text-white flex items-center justify-center font-black text-[9px]">
          IDFC
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-black text-slate-900">IDFC FIRST</span>
          <span className="text-[7px] font-bold text-slate-500 uppercase mt-0.5">Bank Card</span>
        </div>
      </div>
    </div>
  );
}

export function TrainGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M10 25 C10 18, 20 12, 40 12 L105 12 C112 12, 115 18, 115 25 L115 48 C115 54, 110 56, 100 56 L10 56 Z" fill="#2563EB" />
        <path d="M12 24 L35 24 L35 34 L12 34 Z" fill="#93C5FD" opacity="0.9" />
        <path d="M42 16 L60 16 L60 30 L42 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M65 16 L83 16 L83 30 L65 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M88 16 L106 16 L106 30 L88 30 Z" fill="#1E3A8A" opacity="0.75" />
        <path d="M10 40 L115 40 L115 44 L10 44 Z" fill="#F59E0B" />
        <circle cx="28" cy="56" r="6" fill="#0F172A" />
        <circle cx="68" cy="56" r="6" fill="#0F172A" />
        <circle cx="98" cy="56" r="6" fill="#0F172A" />
      </svg>
    </div>
  );
}

export function HotelGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-emerald-300 flex flex-col items-center justify-center text-center w-24 h-14">
        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter leading-none">Hotel & Stay</span>
        <span className="text-xs font-black text-emerald-600 uppercase tracking-tight leading-none mt-0.5">30% OFF</span>
        <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Luxury Stay</span>
      </div>
    </div>
  );
}

export function FlightGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M15 35 Q40 25 70 30 L105 15 L108 22 L80 37 L110 40 L108 45 L72 42 L45 58 L38 56 L50 40 L15 35 Z" fill="#4F46E5" />
        <path d="M75 28 L95 18 L96 23 L80 34 Z" fill="#818CF8" />
        <circle cx="35" cy="34" r="2" fill="#FFFFFF" />
        <circle cx="45" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="55" cy="36" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function CabGraphic() {
  return (
    <div className="w-24 h-14 relative shrink-0">
      <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 120 70" fill="none">
        <path d="M20 32 L35 18 C38 15, 45 14, 60 14 L80 14 C90 14, 95 18, 100 24 L108 34 L112 36 C115 38, 115 44, 110 48 L15 48 C10 48, 10 42, 12 36 Z" fill="#EAB308" />
        <path d="M38 18 L55 18 L55 30 L28 30 Z" fill="#1E293B" opacity="0.85" />
        <path d="M60 18 L78 18 L88 30 L60 30 Z" fill="#1E293B" opacity="0.85" />
        <rect x="52" y="9" width="16" height="5" rx="1.5" fill="#0F172A" />
        <circle cx="32" cy="48" r="7" fill="#0F172A" />
        <circle cx="32" cy="48" r="3.5" fill="#94A3B8" />
        <circle cx="88" cy="48" r="7" fill="#0F172A" />
        <circle cx="88" cy="48" r="3.5" fill="#94A3B8" />
      </svg>
    </div>
  );
}
