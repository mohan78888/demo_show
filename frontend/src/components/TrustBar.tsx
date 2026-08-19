import React from 'react';

const TrustBar: React.FC = () => {
  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.querySelector('input[name="from"]');
    if (searchInput instanceof HTMLElement) {
      searchInput.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-10 md:py-14 border-t border-slate-50 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Simplified Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-10 opacity-60 dark:opacity-80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Easy Refunds</span>
          </div>
        </div>

        {/* Minimal Content - No Card */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest">Trusted Deals • Canada & US</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Affordable Flights Across Canada & US
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium mb-8">
            Save up to 40% on Selected Routes. Book smart and save big.
          </p>
          
          <button 
            onClick={scrollToSearch}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 font-bold px-8 py-4 rounded-xl transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <span>Search Flights</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TrustBar);
