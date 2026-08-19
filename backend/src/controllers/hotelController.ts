import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as hotelService from '../services/hotelService.js';

export const searchHotelByName = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const destinations = await hotelService.searchHotelsByNameService(req.body.query, req.ip);
  res.status(200).json({
    success: true,
    destinations,
  });
});

export const searchHotels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await hotelService.searchHotelsService({
    ...req.body,
    clientIp: req.ip,
  });
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getHotelDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { hotelKey, searchKey } = req.body;
  const details = await hotelService.getHotelDetailsService(hotelKey, searchKey, req.ip);
  res.status(200).json({
    success: true,
    details,
  });
});

export const getCancellationPolicy = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const policy = await hotelService.getCancellationPolicyService();
  res.status(200).json({
    success: true,
    policy,
  });
});

export const createTempBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await hotelService.createTempBookingService(req.body.customerName);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const issueHotelTicket = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await hotelService.issueHotelTicketService(req.body.bookingRefNo);
  res.status(200).json({
    success: true,
    ...result,
  });
});
