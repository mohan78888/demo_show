"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import PrivacyPolicyPage from '../../components/PrivacyPolicyPage';

export default function PrivacyRoute() {
  const router = useRouter();
  return <PrivacyPolicyPage onBack={() => router.push('/')} />;
}
