export interface FlightSegment {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  airlineCode?: string;
  flightNumber?: string;
  duration?: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode?: string;
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
  flightKey?: string;
  fareId?: string;
  seatsAvailable?: string;
  repriced?: boolean;
  searchKey?: string;
  layovers?: string[];
  segments?: FlightSegment[];
}

export interface FlightFilterState {
  selectedAirlines: string[];
  selectedStops: number[];
  departureTimeSlots: string[]; // 'early' | 'morning' | 'afternoon' | 'evening'
  arrivalTimeSlots: string[];
  maxPrice: number;
  maxDurationMinutes: number;
  selectedLayovers: string[];
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

export interface SSRItem {
  code: string;
  key: string;
  name: string;
  desc: string;
  amount: number;
  currency: string;
  type: string;
}

export interface SSRGroup {
  meals: SSRItem[];
  baggage: SSRItem[];
  wheelchair: SSRItem[];
  other: SSRItem[];
}

export interface PassengerInfo {
  paxId: number;
  paxType: number; // 0=Adult, 1=Child, 2=Infant
  title: string;
  firstName: string;
  lastName: string;
  gender: number; // 0=Male, 1=Female
  dob?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  nationality?: string;
  pancardNumber?: string;
}

export interface TempBookingResult {
  success: boolean;
  bookingRefNo?: string;
  totalAmount?: number;
  message: string;
}

export interface TicketingResult {
  success: boolean;
  bookingRefNo?: string;
  airlinePnr?: string;
  ticketNumber?: string;
  airlineCode?: string;
  status?: string;
  message: string;
}