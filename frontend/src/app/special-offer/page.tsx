"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import PromoLandingPage from '../../components/PromoLandingPage';
import { SearchParams } from '../../types';

export default function SpecialOfferRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    router.push(`/?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&date=${params.date}&class=${params.travelClass}`);
  };

  return (
    <AppLayout activeView="special-offer">
      <PromoLandingPage
        onSearch={handleSearch}
        isLoading={isLoading}
        onLogoClick={() => router.push('/')}
        onLegalClick={() => router.push('/terms')}
        onAboutClick={() => router.push('/about')}
        onPrivacyClick={() => router.push('/privacy')}
        onTermsClick={() => router.push('/terms-of-use')}
        onCreditCardVerificationClick={() => router.push('/credit-card-verification')}
        onContactClick={() => router.push('/contact')}
      />
    </AppLayout>
  );
}
