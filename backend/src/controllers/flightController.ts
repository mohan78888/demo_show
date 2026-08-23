import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as flightService from '../services/flightService.js';

// export const preCachePopularRoutes = flightService.preCachePopularRoutes;

// Active Flight Search Controller
export const searchFlights = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.searchLiveFlights({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

/*
export const repriceFlight = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.repriceLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const getSSR = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.getLiveSSR({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const tempBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.tempBookingLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const issueTicket = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.issueTicketLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const getFlightDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Flight details endpoint ready for live PNR repricing',
  });
});
*/




