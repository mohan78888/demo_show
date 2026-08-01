import React from 'react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-950 py-24 border-t border-slate-50 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
          {/* Column 1: Deals */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-8 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-full scale-90 opacity-40"></div>
              <svg className="w-3/4 h-3/4 relative z-10 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L14 2L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5 7.5L21.5 9.5L19.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.5 9.5H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.5 7.5L2.5 9.5L4.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.5 9.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 11V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white max-w-[280px] leading-snug">
              The best hotel & flight deals in the universe
            </h3>
          </div>

          {/* Column 2: Payments */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-8 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-full scale-90 opacity-40"></div>
              <svg className="w-3/4 h-3/4 relative z-10 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white max-w-[280px] leading-snug">
              Flexible ways to pay
            </h3>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-8 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-orange-50 dark:bg-orange-900/20 rounded-full scale-90 opacity-40"></div>
              <svg className="w-3/4 h-3/4 relative z-10 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.364 5.63605L15.5355 8.46448" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.63604 18.364L8.46447 15.5355" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.63604 5.63605L8.46447 8.46448" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.364 18.364L15.5355 15.5355" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white max-w-[280px] leading-snug">
              Support that never sleeps, we’re with you 24/7
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
