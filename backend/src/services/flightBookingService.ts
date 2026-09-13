import crypto from 'crypto';
import FlightBookingRequest, { IFlightBookingRequest } from '../models/FlightBookingRequest.js';
import { FlightBookingRequestInput } from '../validators/flightBookingRequest.validator.js';
import {
  sendFlightBookingCustomerEmail,
  sendFlightBookingAdminEmail,
} from './emailService.js';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

export const generateBookingRequestId = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BR-FL-${dateStr}-${randomHex}`;
};

export const createFlightBookingRequestService = async (
  input: FlightBookingRequestInput,
  clientIp?: string
): Promise<{
  success: boolean;
  requestId: string;
  message: string;
  booking: Partial<IFlightBookingRequest>;
}> => {
  if (!input.passengers || input.passengers.length === 0) {
    throw new AppError('At least one passenger is required for flight booking request.', 400);
  }

  const requestId = generateBookingRequestId();

  // 1. SAVE TO DATABASE FIRST (Source of truth)
  const bookingRecord = new FlightBookingRequest({
    requestId,
    customer: {
      name: input.customer.name.trim(),
      email: input.customer.email.trim().toLowerCase(),
      mobile: input.customer.mobile.trim(),
    },
    flight: {
      airline: input.flight.airline,
      flightNumber: input.flight.flightNumber || '',
      origin: input.flight.origin,
      destination: input.flight.destination,
      departureTime: input.flight.departureTime || '',
      arrivalTime: input.flight.arrivalTime || '',
      duration: input.flight.duration || '',
      travelDate: input.flight.travelDate,
      returnDate: input.flight.returnDate || '',
      travelClass: input.flight.travelClass || 'Economy',
      price: input.flight.price || 0,
      currency: input.flight.currency || 'INR',
      stops: input.flight.stops || 0,
    },
    passengers: input.passengers.map((p) => ({
      paxType: p.paxType || 'Adult',
      title: p.title,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      gender: p.gender,
      age: p.age,
      dob: p.dob || '',
      passportNumber: p.passportNumber || '',
      nationality: p.nationality || '',
    })),
    passengerCount: input.passengers.length,
    remarks: input.remarks ? input.remarks.trim() : '',
    status: 'PENDING',
    ipAddress: clientIp || '',
  });

  await bookingRecord.save();
  logger.info(`✅ Flight booking request persisted in DB: [${requestId}] by ${input.customer.email}`);

  // 2. DISPATCH ASYNC EMAILS (Failures will NOT lose or corrupt saved booking)
  const emailPayload = {
    requestId,
    customer: bookingRecord.customer,
    flight: bookingRecord.flight,
    passengers: bookingRecord.passengers,
    remarks: bookingRecord.remarks,
    createdAt: bookingRecord.createdAt,
  };

  sendFlightBookingCustomerEmail(emailPayload).catch((err) => {
    logger.error(`[Async Customer Email Error] Request: ${requestId} - ${err?.message || err}`);
  });

  sendFlightBookingAdminEmail(emailPayload).catch((err) => {
    logger.error(`[Async Admin Email Error] Request: ${requestId} - ${err?.message || err}`);
  });

  return {
    success: true,
    requestId,
    message: 'Your flight booking request has been received successfully. Our travel concierge will contact you shortly.',
    booking: {
      requestId,
      customer: bookingRecord.customer,
      flight: bookingRecord.flight,
      passengerCount: bookingRecord.passengerCount,
      status: bookingRecord.status,
      createdAt: bookingRecord.createdAt,
    },
  };
};
