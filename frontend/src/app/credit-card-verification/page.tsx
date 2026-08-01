"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import CreditCardVerificationPage from '../../components/CreditCardVerificationPage';

export default function CreditCardVerificationRoute() {
  const router = useRouter();
  return <CreditCardVerificationPage onBack={() => router.push('/')} />;
}
