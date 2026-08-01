"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Login from '../../components/Login';

export default function LoginRoute() {
  const router = useRouter();
  return <Login onBack={() => router.push('/')} />;
}
