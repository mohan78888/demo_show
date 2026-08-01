
export interface Flight {
  id: string;
  airline: string;
  flightNumber?: string;
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  origin: string;
  destination: string;
  price: number;
  stops: number;
  class: string;
  baggage?: string;
  refundable?: boolean;
  bookingLink?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  image: string;
  tags: string[];
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: number;
  travelClass: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  color: string;
  image: string;
}