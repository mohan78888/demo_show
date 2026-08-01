"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import TermsPage from '../../components/TermsPage';

export default function TermsRoute() {
  const router = useRouter();
  return <TermsPage onBack={() => router.push('/')} />;
}
