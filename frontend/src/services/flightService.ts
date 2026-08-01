// Flight API Service
import { Flight, SearchParams } from '../types';

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

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const flights = data.flights || [];
      
      // Store in cache
      setCachedSearchResult(cacheKey, flights);
      
      return flights;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  getMockFlights(params: SearchParams): Flight[] {
    return [
      {
        id: '1',
        airline: 'Hawk Air',
        airlineLogo: 'https://picsum.photos/seed/sky/100/100',
        departureTime: '06:00 AM',
        arrivalTime: '08:30 AM',
        duration: '2h 30m',
        durationMinutes: 150,
        origin: params.from.substring(0, 3).toUpperCase(),
        destination: params.to.substring(0, 3).toUpperCase(),
        price: 4500 + Math.floor(Math.random() * 2000),
        stops: 0,
        class: params.travelClass
      },
      {
        id: '2',
        airline: 'BlueJet',
        airlineLogo: 'https://picsum.photos/seed/blue/100/100',
        departureTime: '10:15 AM',
        arrivalTime: '12:45 PM',
        duration: '2h 30m',
        durationMinutes: 150,
        origin: params.from.substring(0, 3).toUpperCase(),
        destination: params.to.substring(0, 3).toUpperCase(),
        price: 5200 + Math.floor(Math.random() * 2000),
        stops: 0,
        class: params.travelClass
      },
      {
        id: '3',
        airline: 'Global Wings',
        airlineLogo: 'https://picsum.photos/seed/global/100/100',
        departureTime: '02:00 PM',
        arrivalTime: '05:30 PM',
        duration: '3h 30m',
        durationMinutes: 210,
        origin: params.from.substring(0, 3).toUpperCase(),
        destination: params.to.substring(0, 3).toUpperCase(),
        price: 3800 + Math.floor(Math.random() * 2000),
        stops: 1,
        class: params.travelClass
      },
      {
        id: '4',
        airline: 'Hawk Air',
        airlineLogo: 'https://picsum.photos/seed/sky/100/100',
        departureTime: '08:00 PM',
        arrivalTime: '10:15 PM',
        duration: '2h 15m',
        durationMinutes: 135,
        origin: params.from.substring(0, 3).toUpperCase(),
        destination: params.to.substring(0, 3).toUpperCase(),
        price: 6100 + Math.floor(Math.random() * 2000),
        stops: 0,
        class: params.travelClass
      }
    ];
  }
};
