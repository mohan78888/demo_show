import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode = 200,
  message = 'Operation successful',
  data?: T,
  extraProps: Record<string, any> = {}
): void => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...extraProps,
  };
  res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  statusCode = 400,
  message = 'An error occurred'
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
