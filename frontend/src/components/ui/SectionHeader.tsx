import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  return (
    <div
      className={cn(
        'max-w-3xl mb-16',
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        className
      )}
    >
      {badge && (
        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800 mb-4 inline-block shadow-sm">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
