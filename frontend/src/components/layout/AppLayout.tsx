"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';
import { useTheme } from '../../context/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  showHotels?: boolean;
  footerBgClass?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeView,
  showHotels = true,
  footerBgClass = 'bg-[#0E255E]',
}) => {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Prefetch main destinations
    router.prefetch('/');
    router.prefetch('/hotels');
    router.prefetch('/flights');
    router.prefetch('/bus');
    router.prefetch('/offers');
    router.prefetch('/customer-service');
  }, [router]);

  const handleAuthSuccess = (_user: any) => {
    // Refresh current page or state when user logs in/registers
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300 relative">
      <Navbar
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoClick={() => router.push('/')}
        onSupportClick={() => router.push('/customer-service')}
        onOffersClick={() => router.push('/offers')}
        onHotelsClick={() => router.push('/hotels')}
        activeView={activeView}
        showHotels={showHotels}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex-grow w-full min-w-0">
        {children}
      </main>

      {/* Centered Native Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Footer
        bgClass={footerBgClass}
        showTopAirlines={activeView === 'cheap-flights'}
        onLegalClick={() => router.push('/terms')}
        onAboutClick={() => router.push('/about')}
        onPrivacyClick={() => router.push('/privacy')}
        onTermsClick={() => router.push('/terms-of-use')}
      />
    </div>
  );
};

export default AppLayout;
