"use client";

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import CarRentals from '../../components/CarRentals';

export default function CarRentalRoute() {
  return (
    <AppLayout activeView="car-rental">
      <CarRentals />
    </AppLayout>
  );
}
