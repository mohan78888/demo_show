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
        'bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-slate-700 group',
        offer.bgClass,
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="bg-rose-500 text-white font-black text-xs uppercase px-3 py-1 rounded-xl shadow-sm tracking-wider">
            {badgeText}
          </span>
          <span className="text-slate-400 text-xs font-semibold">{validityText}</span>
        </div>

        <h3 className="text-xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
          {offer.title}
        </h3>
        {offer.tagline && (
          <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
            {offer.tagline}
          </p>
        )}
        <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2">
          {offer.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-dashed border-slate-700 text-slate-200 font-mono text-xs font-bold tracking-widest">
          {offer.code}
        </div>
        <button
          onClick={() => copy(offer.code)}
          className={cn(
            'px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 shadow-md',
            isCopied
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
          )}
        >
          {isCopied ? 'Copied! ✓' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
