import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import env from '../config/env.js';
import { apiLimiter } from './rateLimiter.js';

export const configureSecurityMiddleware = (app: Express): void => {
  // Disable x-powered-by header
  app.disable('x-powered-by');

  // Payload body parsing with secure limit (500kb) - MUST BE FIRST
  app.use(express.json({ limit: '500kb' }));
  app.use(express.urlencoded({ extended: true, limit: '500kb' }));

  // Safe Mongo Sanitization for Express 5 (sanitizes req.body and req.params without mutating req.query getter)
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
      mongoSanitize.sanitize(req.body);
    }
    if (req.params && typeof req.params === 'object') {
      mongoSanitize.sanitize(req.params);
    }
    next();
  });

  // Configure Secure HTTP Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows API usage without blocking inline scripts in frontend demos
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Configure CORS with strict origin validation
  const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ];

  if (env.FRONTEND_URL) {
    const cleanUrl = env.FRONTEND_URL.trim().replace(/\/+$/, '');
    if (cleanUrl && !allowedOrigins.includes(cleanUrl)) {
      allowedOrigins.push(cleanUrl);
    }
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Always allow explicitly whitelisted production/dev origins
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Allow localhost and local subnet development origins in development mode
        if (
          env.NODE_ENV === 'development' &&
          (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.startsWith('http://192.168.') ||
            origin.startsWith('http://10.') ||
            origin.startsWith('http://172.'))
        ) {
          return callback(null, true);
        }

        // Block all other unauthorized origins
        return callback(new Error('Blocked by CORS policy: Origin not allowed'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );

  // Rate limiting for general API requests
  app.use('/api', apiLimiter);
};

