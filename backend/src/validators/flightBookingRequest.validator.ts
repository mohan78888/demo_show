import { z } from 'zod';

export const passengerInputSchema = z.object({
  paxType: z.enum(['Adult', 'Child', 'Infant']).default('Adult'),
  title: z.string().min(1, 'Title is required').max(10),
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.coerce.number().min(0).max(120).optional(),
  dob: z.string().optional().nullable(),
  passportNumber: z.string().max(30).optional().nullable(),
  nationality: z.string().max(50).optional().nullable(),
});

export const flightSummaryInputSchema = z.object({
  airline: z.string().min(1, 'Airline is required'),
  flightNumber: z.string().optional().default(''),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureTime: z.string().optional().default(''),
  arrivalTime: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  travelDate: z.string().min(1, 'Travel date is required'),
  returnDate: z.string().optional().nullable(),
  travelClass: z.string().optional().default('Economy'),
  price: z.coerce.number().optional().default(0),
  currency: z.string().optional().default('INR'),
  stops: z.coerce.number().optional().default(0),
});

export const flightBookingRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Customer name must be at least 2 characters').max(100).trim(),
    email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
    mobile: z.string().min(7, 'Please provide a valid mobile number').max(20).trim(),
  }),
  flight: flightSummaryInputSchema,
  passengers: z
    .array(passengerInputSchema)
    .min(1, 'At least one passenger must be provided')
    .max(15, 'Maximum 15 passengers per request'),
  remarks: z.string().max(1000, 'Remarks cannot exceed 1000 characters').optional().default(''),
});

export type FlightBookingRequestInput = z.infer<typeof flightBookingRequestSchema>;
