import React from 'react';
import { CONTACT_INFO } from '../../constants/config';
import { cn } from '../../lib/utils';

interface CallHotlineButtonProps {
  variant?: 'emerald' | 'solid' | 'outline' | 'banner';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const CallHotlineButton: React.FC<CallHotlineButtonProps> = ({
  variant = 'emerald',
  size = 'md',
  label = CONTACT_INFO.HOTLINE_DISPLAY,
  showIcon = true,
  className,
}) => {
  const baseClasses = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3.5 rounded-2xl',
  }[size];

  const variantClasses = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    solid: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
    outline: 'border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    banner: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl shadow-xl',
  }[variant];

  return (
    <a
      href={CONTACT_INFO.HOTLINE_TEL}
      className={cn(baseClasses, sizeClasses, variantClasses, className)}
    >
      {showIcon && (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      )}
      <span>{label}</span>
    </a>
  );
};

export default CallHotlineButton;
