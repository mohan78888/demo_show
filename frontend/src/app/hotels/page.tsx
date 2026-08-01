"use client";

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import HotelsPage from '../../components/HotelsPage';

export default function HotelsRoute() {
  return (
    <AppLayout activeView="hotels">
      <HotelsPage />
    </AppLayout>
  );
}
