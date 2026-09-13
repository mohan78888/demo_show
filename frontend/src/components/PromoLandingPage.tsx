"use client";

import React from 'react';
import Image from 'next/image';
import Hero from './Hero';
import Footer from './Footer';
import TrustBar from './TrustBar';
import { SearchParams } from '../types';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants/config';

interface PromoLandingPageProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  onLogoClick: () => void;
  // Footer props
  onLegalClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onCreditCardVerificationClick: () => void;
  onContactClick: () => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

const PromoLandingPage: React.FC<PromoLandingPageProps> = ({
  onSearch,
  isLoading,
  onLogoClick,
  onLegalClick,
  onAboutClick,
  onPrivacyClick,
  onTermsClick,
  onCreditCardVerificationClick,
  onContactClick,
  darkMode: propsDarkMode,
  toggleDarkMode: propsToggleDarkMode
}) => {
  let contextTheme: { darkMode: boolean; toggleDarkMode: () => void } | null = null;
  try {
    contextTheme = useTheme();
  } catch {
    contextTheme = null;
  }

  const darkMode = propsDarkMode ?? contextTheme?.darkMode ?? false;
  const toggleDarkMode = propsToggleDarkMode ?? contextTheme?.toggleDarkMode ?? (() => {});
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Simplified Header - No distractions */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-4 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <button onClick={onLogoClick} className="flex items-center gap-2 group outline-none">
            <div className="transition-all duration-500 flex items-center justify-center group-hover:scale-110">
              <Image 
                src="/tourhelpdesk-ts.png" 
                alt="Tour Help Desk logo" 
                width={130}
                height={35}
                priority
                style={{ width: 'auto', height: 'auto' }}
                className={`object-contain transition-all duration-500 h-8 w-auto md:h-9 ${darkMode ? 'brightness-110' : ''}`}
              />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white truncate">
              Tour Help Desk
            </span>
          </button>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                )}
              </button>

             <a href={CONTACT_INFO.HOTLINE_TEL} className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
               <span className="hidden sm:inline">{CONTACT_INFO.HOTLINE_DISPLAY}</span>
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Ad-focused Hero Section */}
        <div className="relative">
            {/* Special Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 shadow-md relative z-20">
                <p className="text-sm md:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Flash Sale: Exclusive Discounts on Unpublished Fares!
                </p>
            </div>
            <Hero 
              onSearch={onSearch} 
              isLoading={isLoading} 
              title={<>SEARCH <span className="text-purple-600 dark:text-purple-400">for</span></>}
              subtitle="International & domestic"
              badge="FLIGHTS UP TO 40% OFF"
            />
        </div>

        {/* Benefits / Why Choose Us Section */}
        <div className="bg-white dark:bg-slate-950 py-12 md:py-20 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
               <div className="text-center mb-10 md:mb-16">
                   <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Why Book With Us Today?</h2>
                   <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Skip the lines and hidden fees. Get direct access to exclusive airline inventory.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* Feature 1 */}
                   <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all hover:-translate-y-1">
                       <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Unpublished Fares</h3>
                       <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Access secret discounts not available on major travel websites. Call us to claim them.</p>
                   </div>
                   
                   {/* Feature 2 */}
                   <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all hover:-translate-y-1">
                       <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Booking</h3>
                       <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No waiting time. Search online or call our toll-free number for immediate ticket issuance.</p>
                   </div>
                   
                   {/* Feature 3 */}
                   <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all hover:-translate-y-1">
                       <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">100% Secure</h3>
                       <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your data and payments are protected with bank-level encryption. Travel with peace of mind.</p>
                   </div>
               </div>
           </div>
        </div>

        <TrustBar />
      </main>

      <Footer 
        onLegalClick={onLegalClick} 
        onAboutClick={onAboutClick} 
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onCreditCardVerificationClick={onCreditCardVerificationClick}
        onContactClick={onContactClick}
      />
    </div>
  );
};

export default PromoLandingPage;
