import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (fn: (req: any, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
