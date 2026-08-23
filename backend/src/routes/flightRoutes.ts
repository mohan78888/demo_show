import { Router } from 'express';
import { searchFlights /*, repriceFlight, getSSR, tempBooking, issueTicket, getFlightDetails */ } from '../controllers/flightController.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { flightSearchSchema /*, flightRepriceSchema, flightSsrSchema, flightTempBookingSchema, flightTicketingSchema */ } from '../validators/flight.validator.js';

const router = Router();

// Active Flight Search Endpoint
router.post('/search', validateBody(flightSearchSchema), searchFlights);

// Disabled / Commented out Endpoints:
// router.post('/reprice', validateBody(flightRepriceSchema), repriceFlight);
// router.post('/ssr', validateBody(flightSsrSchema), getSSR);
// router.post('/temp-booking', validateBody(flightTempBookingSchema), tempBooking);
// router.post('/ticketing', validateBody(flightTicketingSchema), issueTicket);
// router.get('/:id', getFlightDetails);

export default router;




