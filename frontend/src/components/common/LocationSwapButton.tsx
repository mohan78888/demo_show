"use client";

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface LocationSwapButtonProps {
  onSwap: () => void;
  className?: string;
  ariaLabel?: string;
}

export const LocationSwapButton: React.FC<LocationSwapButtonProps> = ({
  onSwap,
  className = "flex justify-center -my-2.5 relative z-10",
  ariaLabel = "Swap Locations",
}) => {
  return (
    <div className={className}>
      <button
        onClick={onSwap}
        type="button"
        aria-label={ariaLabel}
        className="w-8 h-8 rounded-full bg-white dark:bg-white border-2 border-slate-300 dark:border-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-700 hover:bg-blue-50 dark:hover:bg-blue-50 hover:text-blue-600 transition-all shadow-md cursor-pointer"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default LocationSwapButton;
