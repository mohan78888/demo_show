import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    logger.error({ err }, `[GlobalServerError] ${message}`);
  } else {
    logger.warn(`[ClientError] ${statusCode} - ${message}`);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: messages.join(', ') || 'Validation error',
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(400).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  // Handle JWT Error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
    return;
  }

  const isDev = env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
