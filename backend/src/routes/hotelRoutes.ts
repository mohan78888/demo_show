import { Router } from 'express';
import {
  searchHotelByName,
  searchHotels,
  getHotelDetails,
  getCancellationPolicy,
  createTempBooking,
  issueHotelTicket,
} from '../controllers/hotelController.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { hotelAutocompleteSchema, hotelSearchSchema, hotelDetailsSchema } from '../validators/hotel.validator.js';

const router = Router();

router.post('/autocomplete', validateBody(hotelAutocompleteSchema), searchHotelByName);
router.post('/search', validateBody(hotelSearchSchema), searchHotels);
router.post('/details', validateBody(hotelDetailsSchema), getHotelDetails);
router.post('/cancellation-policy', getCancellationPolicy);
router.post('/temp-booking', createTempBooking);
router.post('/ticket', issueHotelTicket);

export default router;
