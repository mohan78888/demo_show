import express, { Request, Response } from 'express';
import compression from 'compression';
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import { configureSecurityMiddleware } from './middleware/security.js';
import errorHandler from './middleware/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// 1. Compression & HTTP Request Logger
app.use(compression());
app.use(pinoHttp({ logger }));

// 2. Static Cache Control Headers
app.use((req: Request, res: Response, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/auth') && !req.path.startsWith('/api/user')) {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  next();
});

// 3. Security & Body Parsing Middleware
configureSecurityMiddleware(app);

// 4. API Routes Registration
app.use('/', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/ai', aiRoutes);

// Protected legacy profile alias endpoint
app.get('/api/user/profile', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Secure Profile Data' });
});

// 5. 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// 6. Centralized Global Error Handler
app.use(errorHandler);

export default app;
