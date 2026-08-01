const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DestinationSuggestion {
  id: string;
  fullName: string;
  country: string;
  state?: string | null;
  type: string;
}

export interface HotelSearchParams {
  destinationName: string;
  cityId?: string;
  countryCode?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  childAges?: number[];
  rooms: number;
  starRating?: string;
}

export interface HotelDetailInfo {
  hotelKey: string;
  searchKey: string;
  name: string;
  address: string;
  description: string;
  rating: number;
  photos: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  refundable: boolean;
  isPANMandatory: boolean;
  rooms: {
    roomId: string;
    roomName: string;
    inclusion: string;
    price: number;
    currency: string;
    ratePlanId: string;
    recommendationId: string;
    maxAdults: number;
    freeCancellation: boolean;
  }[];
}

export interface CancellationPolicyInfo {
  freeCancellationDate: string;
  cancellationCharges: string;
  refundable: boolean;
  remarks: string;
}

export const hotelService = {
  // Autocomplete City / Destination
  autocompleteDestinations: async (query: string): Promise<DestinationSuggestion[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/autocomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      return json.destinations || [];
    } catch (e) {
      console.error('Autocomplete Error:', e);
      return [];
    }
  },

  // Main Hotel Search
  searchHotels: async (params: HotelSearchParams) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error('Search Hotels Error:', e);
      return { success: false, hotels: [], count: 0, message: 'Failed to connect to hotel API' };
    }
  },

  // Get Hotel Details
  getHotelDetails: async (hotelKey: string, searchKey: string): Promise<HotelDetailInfo | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelKey, searchKey })
      });
      const json = await res.json();
      return json.details || null;
    } catch (e) {
      console.error('Get Hotel Details Error:', e);
      return null;
    }
  },

  // Get Cancellation Policy
  getCancellationPolicy: async (
    hotelKey: string, 
    searchKey: string, 
    ratePlanId: string, 
    recommendationId: string
  ): Promise<CancellationPolicyInfo | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/cancellation-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelKey, searchKey, ratePlanId, recommendationId })
      });
      const json = await res.json();
      return json.policy || null;
    } catch (e) {
      console.error('Cancellation Policy Error:', e);
      return null;
    }
  },

  // Temp Hold Booking
  createTempBooking: async (bookingData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/temp-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error('Temp Booking Error:', e);
      return { success: false, message: 'Temporary booking hold failed' };
    }
  },

  // Confirm Voucher Ticketing
  issueHotelTicket: async (bookingRefNo: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRefNo })
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error('Ticketing Error:', e);
      return { success: false, message: 'Hotel ticketing voucher issue failed' };
    }
  }
};
