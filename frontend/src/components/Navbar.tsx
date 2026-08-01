"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { authService } from '../services/authService';

interface NavbarProps {
  onLoginClick: () => void;
  onLogoClick: () => void;
  onSupportClick: () => void;
  onOffersClick: () => void;
  onHotelsClick: () => void;
  activeView?: string;
  showHotels?: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

type MobileCategory = 'hotels' | 'flights' | 'packages' | 'cars' | 'cruises';

const Navbar: React.FC<NavbarProps> = ({ 
  onLoginClick, 
  onLogoClick, 
  onSupportClick, 
  onOffersClick, 
  onHotelsClick, 
  activeView,
  showHotels = true,
  darkMode,
  toggleDarkMode,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hideMobileCategoryStrip, setHideMobileCategoryStrip] = useState(false);

  useEffect(() => {
    // Check local JWT user authentication
    const checkUser = async () => {
      const token = authService.getToken();
      if (token) {
        const profileData = await authService.getProfile();
        if (profileData && profileData.user) {
          setUser(profileData.user);
        }
      }
    };
    checkUser();
  }, []);

  const isSidebarOpenRef = useRef(isSidebarOpen);
  isSidebarOpenRef.current = isSidebarOpen;

  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const stripHiddenRef = useRef(false);
  const scrollLockUntilRef = useRef(0);
  const rafScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  const getMobileActiveCategory = (): MobileCategory => {
    if (activeView === 'hotels') return 'hotels';
    if (activeView === 'offers') return 'packages';
    if (activeView === 'home' || activeView === 'details') return 'flights';
    return 'flights';
  };

  useEffect(() => {
    const setStripHidden = (next: boolean) => {
      if (stripHiddenRef.current === next) return;
      stripHiddenRef.current = next;
      setHideMobileCategoryStrip(next);
      scrollLockUntilRef.current = Date.now() + 380;
    };

    const runScroll = () => {
      rafScrollRef.current = null;
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 1024;
      const menuOpen = isSidebarOpenRef.current;

      setIsScrolled(currentScrollY > 20);

      if (now < scrollLockUntilRef.current) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (!isMobile) {
        if (stripHiddenRef.current) setStripHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (menuOpen) {
        if (!stripHiddenRef.current) setStripHidden(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollYRef.current;
      const absDelta = Math.abs(delta);

      if (absDelta < 14) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const scrollingDown = delta > 0;

      if (currentScrollY <= 48) {
        if (stripHiddenRef.current) setStripHidden(false);
      } else if (scrollingDown && currentScrollY > 96) {
        if (!stripHiddenRef.current) setStripHidden(true);
      } else if (!scrollingDown) {
        if (stripHiddenRef.current) setStripHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      if (rafScrollRef.current != null) return;
      rafScrollRef.current = window.requestAnimationFrame(runScroll);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setStripHidden(false);
      }
      lastScrollYRef.current = window.scrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    runScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafScrollRef.current != null) {
        window.cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowUserMenu(false);
  };

  const isTripHeader = activeView === 'flights' || activeView === 'hotels';

  return (
    <nav 
      className={`z-50 transition-all duration-300 ${
        isTripHeader 
          ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-950/85 via-slate-900/50 to-transparent text-white border-b border-white/10 shadow-sm'
          : 'sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[64px] sm:h-[72px] relative">
        
        {/* Left: Hamburger + Logo + Inline Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0">
          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024 && onToggleSidebar) {
                onToggleSidebar();
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isTripHeader ? 'text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle Sidebar Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0 min-w-0"
            onClick={() => { onLogoClick(); setIsSidebarOpen(false); }}
          >
            <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Image 
                src="/tourhelpdesk.png" 
                alt="Tour Help Desk logo" 
                width={160}
                height={40}
                priority
                className={`object-contain h-7 sm:h-8 md:h-10 w-auto ${isTripHeader || darkMode ? 'brightness-110' : ''}`}
              />
            </div>
            <span className={`hidden min-[380px]:inline text-sm sm:text-lg md:text-xl font-extrabold tracking-tight truncate ml-1 ${
              isTripHeader ? 'text-white' : 'text-slate-800 dark:text-white'
            }`}>
              Tour Help Desk
            </span>
          </div>

          {/* Inline Navigation Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 ml-2 text-sm font-semibold">
            <button 
              onClick={onHotelsClick} 
              className={`transition-all relative py-1 cursor-pointer ${
                activeView === 'hotels'
                  ? (isTripHeader ? 'text-white font-extrabold border-b-2 border-white pb-0.5' : 'text-blue-600 font-extrabold border-b-2 border-blue-600 pb-0.5')
                  : (isTripHeader ? 'text-slate-200 hover:text-white' : 'text-slate-700 dark:text-slate-200')
              }`}
            >
              Hotels & Homes
            </button>

            <button 
              onClick={onLogoClick} 
              className={`transition-all relative py-1 cursor-pointer ${
                activeView === 'flights' || activeView === 'home'
                  ? (isTripHeader ? 'text-white font-extrabold border-b-2 border-white pb-0.5' : 'text-blue-600 font-extrabold border-b-2 border-blue-600 pb-0.5')
                  : (isTripHeader ? 'text-slate-200 hover:text-white' : 'text-slate-700 dark:text-slate-200')
              }`}
            >
              Flights
            </button>

            <button 
              onClick={onOffersClick} 
              className={`transition-all hover:text-white ${isTripHeader ? 'text-slate-200 hover:text-white' : 'text-slate-700 dark:text-slate-200'}`}
            >
              Flight + Hotel
            </button>

            <button 
              onClick={() => {}} 
              className={`transition-all hover:text-white ${isTripHeader ? 'text-slate-200 hover:text-white' : 'text-slate-700 dark:text-slate-200'}`}
            >
              Cars
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className={`transition-all font-bold ${isTripHeader ? 'text-slate-200 hover:text-white' : 'text-slate-700 dark:text-slate-200'}`}
            >
              •••
            </button>
          </div>

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0">
          
          {/* App Link */}
          <div className={`hidden md:flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
            isTripHeader ? 'text-white hover:text-amber-300' : 'text-slate-700 dark:text-slate-200 hover:text-blue-600'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>App</span>
          </div>

          {/* Currency Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
            isTripHeader ? 'text-white hover:bg-white/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}>
            <span className="text-sm">🇮🇳</span>
            <span className="opacity-40">|</span>
            <span className="font-extrabold tracking-wider">INR</span>
          </div>

          {/* Support Link */}
          <button 
            onClick={onSupportClick}
            className={`hidden md:inline-block text-xs font-bold transition-all cursor-pointer ${
              isTripHeader ? 'text-white hover:text-amber-300' : 'text-slate-700 dark:text-slate-200 hover:text-blue-600'
            }`}
          >
            Customer support
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 sm:p-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
              isTripHeader
                ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          {/* Custom Sign In / Account Dropdown */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-blue-600 font-black flex items-center justify-center text-xs">
                    {(user.firstName || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span>{user.firstName || user.name || 'Account'}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name || `${user.firstName} ${user.lastName}`}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 mt-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className={`${
                  isTripHeader 
                    ? 'bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer'
                    : 'bg-gold-gradient hover:opacity-95 text-[#0F172A] font-extrabold text-xs px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm'
                }`}
              >
                Sign In/register
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/35 backdrop-blur-[1px] z-[90] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] transition-transform duration-300 ease-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-[72px] px-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none"
            aria-label="Close Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div 
            className="flex items-center cursor-pointer select-none"
            onClick={() => { onLogoClick(); setIsSidebarOpen(false); }}
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
              tour<span className="text-[#E8A11A]">.</span>helpdesk
            </span>
          </div>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col">
            
            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-3.18a2 2 0 00-1.737 1.01l-1.026 1.78a2 2 0 01-1.737 1.01H9.943a2 2 0 01-1.737-1.01l-1.026-1.78A2 2 0 005.44 13H2" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Cruises</span>
            </button>

            <button 
              onClick={() => { onLogoClick(); setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Flights</span>
            </button>

            <button 
              onClick={() => { onHotelsClick(); setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V19M21 10V19M3 14H21M3 10C3 10 6 7 12 7C18 7 21 10 21 10M5 19H19" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Hotels</span>
            </button>

            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 5h-16l1-5zm2 12a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Car Rental</span>
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-6" />

            <button 
              onClick={() => { onOffersClick(); setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 0112.728 0M12 3v15M12 18a3 3 0 100-6 3 3 0 000 6zM5.636 5.636L12 12m6.364-6.364L12 12" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Holidays</span>
            </button>

            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-9l2 4-4-2 2-2z" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Activities</span>
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-6" />

            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Insurance</span>
            </button>

            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Visa</span>
            </button>

            <button 
              onClick={() => { setIsSidebarOpen(false); }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left group transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#0F172A]/70 dark:text-slate-400 group-hover:text-[#E8A11A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8M16 7v8M3 9v7a2 2 0 002 2h14a2 2 0 002-2V9M3 9a2 2 0 012-2h14a2 2 0 012 2M3 9h18M6 21h2m8 0h2" />
              </svg>
              <span className="text-[14px] font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors">Bus</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
