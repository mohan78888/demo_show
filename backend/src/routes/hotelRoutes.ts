import { Router } from 'express';
import {
  searchHotelByName,
  searchHotels,
  getHotelDetails,
  getCancellationPolicy,
  createTempBooking,
  issueHotelTicket,
} from '../controllers/hotelController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  hotelAutocompleteSchema,
  hotelSearchSchema,
  hotelDetailsSchema,
  hotelTempBookingSchema,
  hotelTicketSchema,
} from '../validators/hotel.validator.js';

const router = Router();

router.post('/autocomplete', validateBody(hotelAutocompleteSchema), searchHotelByName);
router.post('/search', validateBody(hotelSearchSchema), searchHotels);
router.post('/details', validateBody(hotelDetailsSchema), getHotelDetails);
router.post('/cancellation-policy', getCancellationPolicy);
router.post('/temp-booking', authMiddleware, validateBody(hotelTempBookingSchema), createTempBooking);
router.post('/ticket', authMiddleware, validateBody(hotelTicketSchema), issueHotelTicket);

export default router;

