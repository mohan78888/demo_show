"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import OffersPage from '../../components/OffersPage';

export default function OffersRoute() {
  const router = useRouter();
  return <OffersPage onBack={() => router.push('/')} />;
}
