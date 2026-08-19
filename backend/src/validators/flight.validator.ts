import { z } from 'zod';

export const flightSearchSchema = z.object({
  from: z.string().min(1, 'Origin is required'),
  to: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().optional().nullable(),
  passengers: z.union([z.string(), z.number()]).optional().default(1),
  travelClass: z.string().optional().default('Economy'),
});

export const flightRepriceSchema = z.object({
  fareId: z.string().min(1, 'Fare Id is required'),
  flightKey: z.string().min(1, 'Flight Key is required'),
  searchKey: z.string().optional().nullable(),
  flightId: z.string().optional(),
});


export const flightSsrSchema = z.object({
  fareId: z.string().min(1, 'Fare Id is required'),
  flightKey: z.string().min(1, 'Flight Key is required'),
});

export const flightTempBookingSchema = z.object({
  flightKey: z.string().min(1, 'Flight Key is required'),
  searchKey: z.string().optional().nullable(),
  email: z.string().email('Valid email is required'),
  mobile: z.string().min(8, 'Valid mobile number is required'),
  whatsappMobile: z.string().optional().nullable(),
  passengers: z.array(z.object({
    paxId: z.number().default(1),
    paxType: z.number().default(0),
    title: z.string().min(1, 'Title is required'),
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    gender: z.number().default(0),
    dob: z.string().optional().nullable(),
    passportNumber: z.string().optional().nullable(),
    passportCountry: z.string().optional().nullable(),
    passportExpiry: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    pancardNumber: z.string().optional().nullable(),
  })).min(1, 'At least one passenger is required'),
  bookingSSRDetails: z.array(z.object({
    paxId: z.number(),
    ssrKey: z.string(),
  })).optional().default([]),
  gst: z.object({
    isGst: z.boolean().default(false),
    gstNumber: z.string().optional().nullable(),
    gstHolderName: z.string().optional().nullable(),
  }).optional(),
});

export const flightTicketingSchema = z.object({
  bookingRefNo: z.string().min(1, 'Booking Reference Number (Booking_RefNo) is required'),
  ticketingType: z.string().optional().default('1'),
});





