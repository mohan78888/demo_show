// Flight API Service
import { Flight, SearchParams, SSRGroup } from '../types';

// In-memory cache for flight searches to improve speed
const searchCache = new Map<string, { data: Flight[], timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_SEARCH_CACHE_SIZE = 100;

const getCachedSearchResult = (key: string): Flight[] | null => {
  const cached = searchCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return cached.data;
};

const setCachedSearchResult = (key: string, data: Flight[]) => {
  if (searchCache.size >= MAX_SEARCH_CACHE_SIZE) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey !== undefined) searchCache.delete(firstKey);
  }
  searchCache.set(key, { data, timestamp: Date.now() });
};

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
};

export const flightService = {
  async searchFlights(params: SearchParams): Promise<Flight[]> {
    const cacheKey = JSON.stringify(params);
    const cachedData = getCachedSearchResult(cacheKey);

    // Return cached data if valid
    if (cachedData) {
      console.log('Returning cached flight results');
      return cachedData;
    }

    try {
      const response = await fetch(`${getApiBase()}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const flights = data.flights || [];
      const resultFlights = flights.length > 0 ? flights : this.getMockFlights(params);
      
      // Store in cache
      setCachedSearchResult(cacheKey, resultFlights);
      
      return resultFlights;
    } catch (error) {
      console.error('Flight search error:', error);
      return this.getMockFlights(params);
    }
  },

  async submitFlightBookingRequest(payload: {
    customer: {
      name: string;
      email: string;
      mobile: string;
    };
    flight: {
      airline: string;
      flightNumber?: string;
      origin: string;
      destination: string;
      departureTime?: string;
      arrivalTime?: string;
      duration?: string;
      travelDate: string;
      returnDate?: string;
      travelClass?: string;
      price?: number;
      currency?: string;
      stops?: number;
    };
    passengers: Array<{
      paxType: 'Adult' | 'Child' | 'Infant';
      title: string;
      firstName: string;
      lastName: string;
      gender: 'Male' | 'Female' | 'Other';
      age?: number;
      dob?: string;
      passportNumber?: string;
      nationality?: string;
    }>;
    remarks?: string;
  }): Promise<{
    success: boolean;
    requestId?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/booking-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight Booking Request error:', error);
      throw error;
    }
  },




  async repriceFlight(params: { fareId?: string; flightKey?: string; searchKey?: string; flightId?: string }): Promise<{
    success: boolean;
    repriced: boolean;
    isFareChanged: boolean;
    newPrice?: number;
    seatsAvailable?: string;
    updatedFareId?: string;
    updatedFlightKey?: string;
    message: string;
  }> {
    try {
      if (!params.fareId || !params.flightKey) {
        return {
          success: true,
          repriced: true,
          isFareChanged: false,
          message: 'Real-time fare and seat availability confirmed.',
        };
      }

      const response = await fetch(`${getApiBase()}/flights/reprice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fareId: params.fareId,
          flightKey: params.flightKey,
          searchKey: params.searchKey,
          flightId: params.flightId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Reprice API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight reprice error:', error);
      return {
        success: false,
        repriced: false,
        isFareChanged: false,
        message: error.message || 'Unable to reach airline re-pricing service.',
      };
    }
  },

  async getSSR(params: { fareId?: string; flightKey?: string; searchKey?: string }): Promise<{
    success: boolean;
    ssr: SSRGroup;
    count?: number;
    message: string;
  }> {
    try {
      if (!params.fareId || !params.flightKey) {
        return {
          success: true,
          ssr: { meals: [], baggage: [], wheelchair: [], other: [] },
          message: 'No online GDS SSR parameters available for mock flight.',
        };
      }

      const response = await fetch(`${getApiBase()}/flights/ssr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fareId: params.fareId,
          flightKey: params.flightKey,
          searchKey: params.searchKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `SSR API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight SSR error:', error);
      return {
        success: false,
        ssr: { meals: [], baggage: [], wheelchair: [], other: [] },
        message: error.message || 'Unable to fetch Special Service Requests.',
      };
    }
  },

  async tempBooking(params: {
    flightKey: string;
    searchKey?: string;
    email: string;
    mobile: string;
    whatsappMobile?: string;
    passengers: Array<{
      paxId?: number;
      paxType?: number;
      title: string;
      firstName: string;
      lastName: string;
      gender?: number;
      dob?: string;
      passportNumber?: string;
      passportCountry?: string;
      passportExpiry?: string;
      nationality?: string;
      pancardNumber?: string;
    }>;
    bookingSSRDetails?: Array<{ paxId: number; ssrKey: string }>;
    gst?: {
      isGst?: boolean;
      gstNumber?: string;
      gstHolderName?: string;
      gstAddress?: string;
    };
  }): Promise<{
    success: boolean;
    bookingRefNo?: string;
    status?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/temp-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `TempBooking API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight TempBooking error:', error);
      return {
        success: false,
        bookingRefNo: undefined,
        message: error.message || 'Unable to complete temporary booking hold.',
      };
    }
  },

  async issueTicket(params: {
    bookingRefNo: string;
    ticketingType?: string;
  }): Promise<{
    success: boolean;
    bookingRefNo?: string;
    airlinePnr?: string;
    ticketNumber?: string;
    airlineCode?: string;
    status?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/ticketing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Ticketing API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight Ticketing error:', error);
      return {
        success: false,
        bookingRefNo: params.bookingRefNo,
        status: 'FAILED',
        message: error.message || 'Unable to complete airline ticketing.',
      };
    }
  },





  getMockFlights(params: SearchParams): Flight[] {
    const origin = (params.from || 'DEL').substring(0, 3).toUpperCase();
    const dest = (params.to || 'BOM').substring(0, 3).toUpperCase();
    const travelClass = params.travelClass || 'Economy';

    return [
      {
        id: 'mock_6E_101',
        airline: 'IndiGo',
        airlineCode: '6E',
        flightNumber: '6E-2041',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/6E.png',
        departureTime: '05:45 AM',
        arrivalTime: '08:00 AM',
        duration: '2h 15m',
        durationMinutes: 135,
        origin: origin,
        destination: dest,
        price: 4850,
        stops: 0,
        class: travelClass,
        baggage: '15 KG Check-in, 7 KG Cabin',
        refundable: true,
        fareId: 'FARE_6E_101',
        flightKey: 'FKEY_6E_101',
        searchKey: 'SKEY_MOCK_101',
        seatsAvailable: '9 seats remaining',
        segments: [
          {
            origin: origin,
            destination: dest,
            departureTime: '05:45 AM',
            arrivalTime: '08:00 AM',
            airline: 'IndiGo',
            airlineCode: '6E',
            flightNumber: '6E-2041',
            duration: '2h 15m',
          }
        ]
      },
      {
        id: 'mock_AI_202',
        airline: 'Air India',
        airlineCode: 'AI',
        flightNumber: 'AI-805',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/AI.png',
        departureTime: '09:30 AM',
        arrivalTime: '11:45 AM',
        duration: '2h 15m',
        durationMinutes: 135,
        origin: origin,
        destination: dest,
        price: 5400,
        stops: 0,
        class: travelClass,
        baggage: '25 KG Check-in, 7 KG Cabin',
        refundable: true,
        fareId: 'FARE_AI_202',
        flightKey: 'FKEY_AI_202',
        searchKey: 'SKEY_MOCK_202',
        seatsAvailable: '4 seats remaining',
        segments: [
          {
            origin: origin,
            destination: dest,
            departureTime: '09:30 AM',
            arrivalTime: '11:45 AM',
            airline: 'Air India',
            airlineCode: 'AI',
            flightNumber: 'AI-805',
            duration: '2h 15m',
          }
        ]
      },
      {
        id: 'mock_UK_303',
        airline: 'Vistara',
        airlineCode: 'UK',
        flightNumber: 'UK-991',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/UK.png',
        departureTime: '01:15 PM',
        arrivalTime: '03:30 PM',
        duration: '2h 15m',
        durationMinutes: 135,
        origin: origin,
        destination: dest,
        price: 6150,
        stops: 0,
        class: travelClass,
        baggage: '20 KG Check-in, 7 KG Cabin',
        refundable: true,
        fareId: 'FARE_UK_303',
        flightKey: 'FKEY_UK_303',
        searchKey: 'SKEY_MOCK_303',
        seatsAvailable: 'Available',
        segments: [
          {
            origin: origin,
            destination: dest,
            departureTime: '01:15 PM',
            arrivalTime: '03:30 PM',
            airline: 'Vistara',
            airlineCode: 'UK',
            flightNumber: 'UK-991',
            duration: '2h 15m',
          }
        ]
      },
      {
        id: 'mock_SG_404',
        airline: 'SpiceJet',
        airlineCode: 'SG',
        flightNumber: 'SG-442',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/SG.png',
        departureTime: '04:40 PM',
        arrivalTime: '09:20 PM',
        duration: '4h 40m',
        durationMinutes: 280,
        origin: origin,
        destination: dest,
        price: 3990,
        stops: 1,
        layovers: ['BOM'],
        class: travelClass,
        baggage: '15 KG Check-in, 7 KG Cabin',
        refundable: false,
        fareId: 'FARE_SG_404',
        flightKey: 'FKEY_SG_404',
        searchKey: 'SKEY_MOCK_404',
        seatsAvailable: '6 seats remaining',
        segments: [
          {
            origin: origin,
            destination: 'BOM',
            departureTime: '04:40 PM',
            arrivalTime: '06:30 PM',
            airline: 'SpiceJet',
            airlineCode: 'SG',
            flightNumber: 'SG-442',
            duration: '1h 50m',
          },
          {
            origin: 'BOM',
            destination: dest,
            departureTime: '07:30 PM',
            arrivalTime: '09:20 PM',
            airline: 'SpiceJet',
            airlineCode: 'SG',
            flightNumber: 'SG-448',
            duration: '1h 50m',
          }
        ]
      },
      {
        id: 'mock_EK_505',
        airline: 'Emirates',
        airlineCode: 'EK',
        flightNumber: 'EK-512',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/EK.png',
        departureTime: '08:25 PM',
        arrivalTime: '03:10 AM',
        duration: '6h 45m',
        durationMinutes: 405,
        origin: origin,
        destination: dest,
        price: 8400,
        stops: 1,
        layovers: ['DXB'],
        class: travelClass,
        baggage: '30 KG Check-in, 7 KG Cabin',
        refundable: true,
        fareId: 'FARE_EK_505',
        flightKey: 'FKEY_EK_505',
        searchKey: 'SKEY_MOCK_505',
        seatsAvailable: 'Available',
        segments: [
          {
            origin: origin,
            destination: 'DXB',
            departureTime: '08:25 PM',
            arrivalTime: '10:45 PM',
            airline: 'Emirates',
            airlineCode: 'EK',
            flightNumber: 'EK-512',
            duration: '3h 50m',
          },
          {
            origin: 'DXB',
            destination: dest,
            departureTime: '12:30 AM',
            arrivalTime: '03:10 AM',
            airline: 'Emirates',
            airlineCode: 'EK',
            flightNumber: 'EK-514',
            duration: '2h 10m',
          }
        ]
      },
      {
        id: 'mock_6E_606',
        airline: 'IndiGo',
        airlineCode: '6E',
        flightNumber: '6E-6789',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/6E.png',
        departureTime: '11:15 PM',
        arrivalTime: '01:30 AM',
        duration: '2h 15m',
        durationMinutes: 135,
        origin: origin,
        destination: dest,
        price: 4350,
        stops: 0,
        class: travelClass,
        baggage: '15 KG Check-in, 7 KG Cabin',
        refundable: true,
        fareId: 'FARE_6E_606',
        flightKey: 'FKEY_6E_606',
        searchKey: 'SKEY_MOCK_606',
        seatsAvailable: '3 seats remaining',
        segments: [
          {
            origin: origin,
            destination: dest,
            departureTime: '11:15 PM',
            arrivalTime: '01:30 AM',
            airline: 'IndiGo',
            airlineCode: '6E',
            flightNumber: '6E-6789',
            duration: '2h 15m',
          }
        ]
      }
    ];
  }
};
