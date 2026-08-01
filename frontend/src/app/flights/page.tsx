"use client";

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FlightsPage from '../../components/FlightsPage';

export default function FlightsRoute() {
  return (
    <AppLayout activeView="flights">
      <FlightsPage />
    </AppLayout>
  );
}
