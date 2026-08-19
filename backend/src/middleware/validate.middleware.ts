import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
        res.status(400).json({
          success: false,
          message: issues.join('; '),
        });
        return;
      }
      next(error);
    }
  };
};
