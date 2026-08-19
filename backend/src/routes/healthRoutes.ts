import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown',
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
  });
});

router.get('/status', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown',
    },
  });
});

export default router;
