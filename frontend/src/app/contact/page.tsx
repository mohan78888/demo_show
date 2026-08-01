"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ContactUsPage from '../../components/ContactUsPage';

export default function ContactRoute() {
  const router = useRouter();
  return <ContactUsPage onBack={() => router.push('/')} />;
}
