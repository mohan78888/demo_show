import React from 'react';
import Image from 'next/image';

interface FooterProps {
  onLegalClick?: () => void;
  onAboutClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onCreditCardVerificationClick?: () => void;
  onContactClick?: () => void;
  bgClass?: string;
  showTopAirlines?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  onLegalClick = () => { },
  onAboutClick = () => { },
  onPrivacyClick = () => { },
  onTermsClick = () => { },
  onCreditCardVerificationClick = () => { },
  onContactClick = () => { },
  bgClass = "bg-[#0E255E]",
  showTopAirlines = false
}) => {
  return (
    <footer className={`${bgClass} dark:bg-slate-950 text-slate-400 py-8 md:py-12 border-t border-slate-800 dark:border-slate-900 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 mb-12 md:mb-16">
          {/* Brand & About Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm shrink-0">
                <Image
                  src="/tourhelpdesk-ts.png"
                  alt="Tour Help Desk logo"
                  width={34}
                  height={31}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-7 w-auto object-contain brightness-125"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                Tour Help Desk
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-slate-300 dark:text-slate-400 max-w-sm">
              Leading the sky with innovation, luxury, and unmatched safety standards. Your journey starts with us.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/tourhelpdesk.us" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 dark:bg-slate-900 flex items-center justify-center hover:bg-[#1877F2] transition-colors text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="https://www.instagram.com/tourhelpdesk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 dark:bg-slate-900 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 transition-all text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://www.youtube.com/@tour_help_desk" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 dark:bg-slate-900 flex items-center justify-center hover:bg-[#FF0000] transition-colors text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* Optional Top Airlines or Spacing Column */}
          {showTopAirlines && (
            <div className="lg:col-span-2">
              <h5 className='text-white font-bold mb-5'>Top Airlines</h5>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><span className="hover:text-white transition-colors cursor-pointer">Delta Airlines</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">United Airlines</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">American Airlines</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Emirates</span></li>
              </ul>
            </div>
          )}

          {/* Company Column */}
          <div className={showTopAirlines ? "lg:col-span-2" : "lg:col-span-2 md:pl-4"}>
            <h5 className="text-white font-bold mb-5">Company</h5>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><button onClick={onAboutClick} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={onPrivacyClick} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={onContactClick} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className={showTopAirlines ? "lg:col-span-2" : "lg:col-span-2"}>
            <h5 className="text-white font-bold mb-5">Support</h5>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><button onClick={onCreditCardVerificationClick} className="hover:text-white transition-colors">Credit Card Verification</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className={showTopAirlines ? "lg:col-span-2" : "lg:col-span-4"}>
            <h5 className="text-white font-bold mb-4">Newsletter</h5>
            <p className="text-sm mb-4 text-slate-300 dark:text-slate-400">Subscribe for exclusive travel deals.</p>
            <div className="flex gap-2 max-w-sm">
              <input type="email" placeholder="Email address" className="bg-white/10 dark:bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full" />
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors shrink-0 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">
          <button onClick={onTermsClick} className="text-slate-400 hover:text-white transition-colors">Terms of Service</button>
          <p className="text-slate-500 dark:text-slate-600">&copy; 2026 Tour Help Desk Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;