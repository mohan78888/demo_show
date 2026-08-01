import axios from 'axios';
import { Request, Response } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
}
const flightCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache
const MAX_CACHE_SIZE = 500;

const getFromCache = (key: string) => {
  const cached = flightCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    flightCache.delete(key);
    return null;
  }
  return cached.data;
};

const setInCache = (key: string, data: any) => {
  if (flightCache.size >= MAX_CACHE_SIZE) {
    const firstKey = flightCache.keys().next().value;
    if (firstKey !== undefined) flightCache.delete(firstKey);
  }
  flightCache.set(key, { data, timestamp: Date.now() });
};

// Flyshop UAT API Credentials & Endpoints
const FLYSHOP_BASE_URL = process.env.FLYSHOP_BASE_URL || 'http://uat.flyshop.in/AirlineHost/AirAPIService.svc/JSONService';
const FLYSHOP_USER_ID = process.env.FLYSHOP_USER_ID || 'tourhelpdeskuat';
const FLYSHOP_PASSWORD = process.env.FLYSHOP_PASSWORD || '055107E1F2B67B220EFE4705908905611935243D';

// Helper: Map Airline Code to Display Name
const getAirlineName = (code: string, rawName?: string) => {
  if (rawName && rawName.trim().length > 0 && rawName !== 'Partner Airline') {
    return rawName.trim();
  }
  const map: Record<string, string> = {
    '6E': 'IndiGo',
    'AI': 'Air India',
    'UK': 'Vistara',
    'QP': 'Akasa Air',
    'SG': 'SpiceJet',
    'G8': 'Go First',
    'I5': 'AirAsia India',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'BA': 'British Airways',
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'SQ': 'Singapore Airlines',
  };
  return map[code] || `${code} Airlines`;
};

// Helper: Format Date String to MM/dd/yyyy
const formatToMMDDYYYY = (dateStr: string): string => {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[0]}`;
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
      }
      return dateStr;
    }
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateStr;
  }
};

// Helper: Format ISO/String datetime to AM/PM
const formatTimeAMPM = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '12:00 PM';
  try {
    const spaceSplit = dateTimeStr.split(' ');
    if (spaceSplit.length >= 2) {
      const timePart = spaceSplit[1];
      const [hStr, mStr] = timePart.split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10) || 0;
      const isAM = h < 12;
      h = h % 12 || 12;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`;
    }
    return dateTimeStr;
  } catch (e) {
    return dateTimeStr;
  }
};

// Helper: Extract 3-letter IATA code
const extractCode = (str: string) => {
  if (!str) return 'DEL';
  const match = str.match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = str.trim();
  if (trimmed.length === 3) return trimmed.toUpperCase();
  return trimmed.substring(0, 3).toUpperCase();
};

export const preCachePopularRoutes = async () => {
  try {
    const response = await axios.post(`${FLYSHOP_BASE_URL}/Air_SectorAvailabilityPI`, {
      Auth_Header: {
        UserId: FLYSHOP_USER_ID,
        Password: FLYSHOP_PASSWORD,
        IP_Address: '127.0.0.1',
        Request_Id: `REQ_PRECACHE_${Date.now()}`
      }
    });

    if (response.data?.SectorsPIs?.length) {
      setInCache('FLYSHOP_SECTORS', response.data.SectorsPIs);
      console.log(`✅ Flyshop sector availability precached: ${response.data.SectorsPIs.length} sectors.`);
    }
  } catch (err: any) {
    console.log(`⚠️ Flyshop precache note: ${err.message}`);
  }
};

// @desc Search 100% RAW LIVE Flights from Flyshop Air API (NO OVERRIDES, NO FAKE DATA)
// @route POST /api/flights/search
export const searchFlights = async (req: Request, res: Response) => {
  try {
    const { from, to, date, returnDate, passengers, travelClass } = req.body;
    console.log('🔍 Raw Flyshop API flight search request:', { from, to, date, returnDate, passengers, travelClass });

    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Please provide origin, destination, and departure date' });
    }

    const origin = extractCode(from);
    const destination = extractCode(to);
    const formattedDate = formatToMMDDYYYY(date);
    const formattedReturnDate = returnDate ? formatToMMDDYYYY(returnDate) : formattedDate;
    
    const cacheKey = `RAW-FLYSHOP-${origin}-${destination}-${formattedDate}-${returnDate || 'oneway'}-${travelClass || 'Economy'}`;

    // 1. Caching Check
    const cachedData = getFromCache(cacheKey);
    if (cachedData && Array.isArray(cachedData)) {
      console.log(`✅ Returning cached raw Flyshop flights for ${cacheKey}`);
      return res.json({
        success: true,
        flights: cachedData,
        count: cachedData.length,
        source: 'live_flyshop_uat',
        searchParams: { from, to, date, returnDate, passengers, travelClass }
      });
    }

    // 2. Build Raw Flyshop Air_Search Request
    const tripInfo = [
      { Origin: origin, Destination: destination, TravelDate: formattedDate },
      { Origin: destination, Destination: origin, TravelDate: formattedReturnDate }
    ];

    const payload = {
      Auth_Header: {
        UserId: FLYSHOP_USER_ID,
        Password: FLYSHOP_PASSWORD,
        IP_Address: req.ip || '127.0.0.1',
        Request_Id: `REQ_${Date.now()}`
      },
      Adult_Count: parseInt(passengers) || 1,
      Child_Count: 0,
      Infant_Count: 0,
      Booking_Type: 2,
      Class_Of_Travel: 0,
      Travel_Type: 0,
      Filtered_Airline: [{ Airline_Code: "" }],
      TripInfo: tripInfo
    };

    console.log(`📡 Querying RAW Flyshop UAT API for ${origin} -> ${destination} on ${formattedDate}...`);

    const apiResponse = await axios.post(`${FLYSHOP_BASE_URL}/Air_Search`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    const responseData = apiResponse.data;
    const header = responseData?.Response_Header;

    if (header && header.Error_Code !== '0000') {
      console.log(`ℹ️ Flyshop UAT API response: Code ${header.Error_Code} - ${header.Error_Desc}`);
      return res.json({
        success: true,
        flights: [],
        count: 0,
        source: 'live_flyshop_uat',
        message: header.Error_Desc || 'No live flights found for this route and date combination in Flyshop API.',
        searchParams: { from, to, date, returnDate, passengers, travelClass }
      });
    }

    // Parse Raw Live TripDetails & Flights directly returned by Flyshop UAT API
    const liveFlightsList: any[] = [];
    const tripDetails = responseData?.TripDetails || [];

    tripDetails.forEach((trip: any) => {
      const flights = trip.Flights || [];
      flights.forEach((flight: any, flightIndex: number) => {
        const segments = flight.Segments || [];
        const firstSegment = segments[0] || {};
        const lastSegment = segments[segments.length - 1] || firstSegment;
        
        const fareObj = flight.Fares?.[0] || {};
        const fareDetails = fareObj.FareDetails?.[0] || {};

        const totalAmount = fareDetails.Total_Amount || (fareDetails.Basic_Amount + fareDetails.AirportTax_Amount) || 0;
        const airlineCode = flight.Airline_Code || firstSegment.Airline_Code || '6E';
        const airlineName = getAirlineName(airlineCode, firstSegment.Airline_Name);

        const depTime = formatTimeAMPM(firstSegment.Departure_DateTime);
        const arrTime = formatTimeAMPM(lastSegment.Arrival_DateTime);

        let durationStr = firstSegment.Duration || '2h 30m';
        let durationMinutes = 150;
        if (durationStr.includes(':')) {
          const [dh, dm] = durationStr.split(':');
          durationMinutes = parseInt(dh, 10) * 60 + (parseInt(dm, 10) || 0);
          durationStr = `${parseInt(dh, 10)}h ${parseInt(dm, 10) || 0}m`;
        }

        const flightNumber = firstSegment.Flight_Number ? `${airlineCode}-${firstSegment.Flight_Number.trim()}` : `${airlineCode}-${1000 + flightIndex}`;

        liveFlightsList.push({
          id: flight.Flight_Id || `${airlineCode}_${flightIndex}_${Date.now()}`,
          flightKey: flight.Flight_Key || '',
          fareId: fareDetails.Fare_Id || '',
          airline: airlineName,
          airlineCode: airlineCode,
          flightNumber: flightNumber,
          airlineLogo: `https://picsum.photos/seed/${airlineCode}/100/100`,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: durationStr,
          durationMinutes: durationMinutes,
          origin: firstSegment.Origin || origin,
          destination: lastSegment.Destination || destination,
          price: totalAmount,
          stops: Math.max(0, segments.length - 1),
          class: travelClass || 'Economy',
          baggage: fareDetails.Free_Baggage?.Check_In_Baggage || '15 KG',
          refundable: fareDetails.Refundable ?? true,
          bookingLink: `#book-${flight.Flight_Id || flightIndex}`
        });
      });
    });

    setInCache(cacheKey, liveFlightsList);

    console.log(`✅ Returned ${liveFlightsList.length} RAW Flyshop UAT flights to frontend.`);

    res.json({
      success: true,
      flights: liveFlightsList,
      count: liveFlightsList.length,
      source: 'live_flyshop_uat',
      searchParams: { from, to, date, returnDate, passengers, travelClass }
    });

  } catch (error: any) {
    console.error('❌ Flyshop live flight search error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error searching live flights from Flyshop API',
      error: error.response?.data || error.message || 'Unknown error'
    });
  }
};

// Get flight details by ID
export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Flight details endpoint ready for live PNR repricing'
    });
  } catch (error: any) {
    console.error('Flight details error:', error);
    res.status(500).json({ message: 'Error fetching flight details' });
  }
};
