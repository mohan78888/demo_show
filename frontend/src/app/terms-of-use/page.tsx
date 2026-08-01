"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import TermsOfUsePage from '../../components/TermsOfUsePage';

export default function TermsOfUseRoute() {
  const router = useRouter();
  return <TermsOfUsePage onBack={() => router.push('/')} />;
}
