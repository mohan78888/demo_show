import React from 'react';

export type BadgeVariant = 'default' | 'luxury' | 'warning' | 'success' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300',
  luxury:
    'bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400',
  warning:
    'bg-orange-500/10 border border-orange-500/25 text-orange-600 dark:text-orange-400',
  success:
    'bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400',
  info:
    'bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400',
};

const BASE_BADGE_CLASSES =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors';

export const Badge: React.FC<BadgeProps> = React.memo(({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const selectedVariantClass = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={className ? `${BASE_BADGE_CLASSES} ${selectedVariantClass} ${className}` : `${BASE_BADGE_CLASSES} ${selectedVariantClass}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
