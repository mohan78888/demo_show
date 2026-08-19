"use client";

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FlightsPage from '../../components/FlightsPage';

export default function CheapFlightsRoute() {
  return (
    <AppLayout activeView="cheap-flights">
      <FlightsPage isCheapFlights={true} />
    </AppLayout>
  );
}

