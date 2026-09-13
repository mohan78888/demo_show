import { Router } from 'express';
import {
  searchFlights,
  createFlightBookingRequest,
  repriceFlight,
  getSSR,
} from '../controllers/flightController.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  flightSearchSchema,
  flightRepriceSchema,
  flightSsrSchema,
} from '../validators/flight.validator.js';
import { flightBookingRequestSchema } from '../validators/flightBookingRequest.validator.js';

const router = Router();

// 1. Active Flight Search Endpoint
router.post('/search', validateBody(flightSearchSchema), searchFlights);

// 2. Flight Reprice Endpoint (Air_Reprice)
router.post('/reprice', validateBody(flightRepriceSchema), repriceFlight);

// 3. Flight Special Service Requests Endpoint (Air_GetSSR)
router.post('/ssr', validateBody(flightSsrSchema), getSSR);

// 4. Flight Booking Request Endpoint (Saves to DB & sends Customer + Admin confirmation emails)
router.post('/booking-request', validateBody(flightBookingRequestSchema), createFlightBookingRequest);

export default router;





