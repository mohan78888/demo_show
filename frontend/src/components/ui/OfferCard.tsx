"use client";

import React from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { cn } from '../../lib/utils';

export interface OfferItem {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  discountBadge?: string;
  discount?: string;
  code: string;
  expiry?: string;
  validity?: string;
  image?: string;
  bgClass?: string;
}

interface OfferCardProps {
  offer: OfferItem;
  className?: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, className }) => {
  const { copy, isCopied } = useCopyToClipboard();
  const badgeText = offer.discountBadge || offer.discount || 'LIMITED OFFER';
  const validityText = offer.expiry || offer.validity || 'Limited Time';

  return (
    <div
      className={cn(
        'relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group select-none border border-white/20 dark:border-white/10 hover:border-white/45 dark:hover:border-white/30 bg-slate-950 text-white',
        offer.bgClass,
        className
      )}
    >
      {/* Top Specular Edge Shine */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

      {/* Ticket Cutout Notches */}
      <div className="absolute -left-2.5 top-[65%] -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 z-20 pointer-events-none shadow-inner" />
      <div className="absolute -right-2.5 top-[65%] -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-l border-slate-200/80 dark:border-slate-800/80 z-20 pointer-events-none shadow-inner" />

      {/* Multi-layered Background */}
      {offer.image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${offer.image})` }}
          />
          {/* Subtle edge-only gradients for text contrast leaving the photo clearly visible */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
        </>
      ) : (
        <>
          {/* Ambient Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.25),transparent_60%)] pointer-events-none" />
          
          {/* Subtle Travel Path Decorative SVG Watermark */}
          <svg className="absolute -right-6 -bottom-6 w-40 h-40 opacity-15 text-blue-400 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500 pointer-events-none" fill="none" viewBox="0 0 100 100" stroke="currentColor">
            <path strokeWidth="1.5" strokeDasharray="3 3" d="M10 80 Q 40 10 90 20" />
            <path strokeWidth="1.5" d="M70 15 L85 22 L75 35 L65 25 Z" fill="currentColor" fillOpacity="0.3" />
            <circle cx="85" cy="22" r="14" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </>
      )}

      {/* Specular Radial Lighting Flare on Top Right */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Details */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs uppercase px-3 py-1 rounded-xl shadow-md tracking-wider border border-white/20 backdrop-blur-md">
            {badgeText}
          </span>
          <span className="text-slate-300/90 text-xs font-semibold bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
            {validityText}
          </span>
        </div>

        <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors drop-shadow-md">
          {offer.title}
        </h3>
        {offer.tagline && (
          <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-2">
            {offer.tagline}
          </p>
        )}
        <p className="text-slate-300 text-sm font-medium mb-6 line-clamp-2 drop-shadow-xs">
          {offer.description}
        </p>
      </div>

      {/* Bottom Voucher Coupon Bar */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-dashed border-white/20 relative z-10">
        <div className="bg-black/75 px-3 py-1.5 rounded-xl border border-dashed border-amber-400/60 text-amber-300 font-mono text-xs font-bold tracking-widest flex items-center gap-1.5 shadow-sm">
          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{offer.code}</span>
        </div>

        <button
          onClick={() => copy(offer.code)}
          className={cn(
            'px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 shadow-md cursor-pointer flex items-center gap-1',
            isCopied
              ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-105'
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95 border border-white/20'
          )}
        >
          {isCopied ? 'Copied! ✓' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
