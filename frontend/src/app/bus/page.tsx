"use client";

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import BusPage from '../../components/BusPage';

export default function BusRoute() {
  return (
    <AppLayout activeView="bus">
      <BusPage />
    </AppLayout>
  );
}
