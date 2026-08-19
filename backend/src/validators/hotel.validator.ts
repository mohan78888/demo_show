import { z } from 'zod';

export const hotelAutocompleteSchema = z.object({
  query: z.string().optional(),
});

export const hotelSearchSchema = z.object({
  destinationName: z.string().optional(),
  cityId: z.string().optional(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  adults: z.union([z.string(), z.number()]).optional(),
  children: z.union([z.string(), z.number()]).optional(),
  childAges: z.array(z.number()).optional(),
  rooms: z.union([z.string(), z.number()]).optional(),
});

export const hotelDetailsSchema = z.object({
  hotelKey: z.string().min(1, 'hotelKey is required'),
  searchKey: z.string().min(1, 'searchKey is required'),
});
