"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import AboutPage from '../../components/AboutPage';

export default function AboutRoute() {
  const router = useRouter();
  return <AboutPage onBack={() => router.push('/')} />;
}
