import React from 'react';

interface LegalPageLayoutProps {
  title: string;
  effectiveDate?: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  effectiveDate = 'Effective Date: January 1, 2026. Your trust and security are our top priorities.',
  onBack,
  children,
}) => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          {effectiveDate && (
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              {effectiveDate}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {children}
      </div>
    </div>
  );
};

export default LegalPageLayout;
