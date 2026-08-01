import dns from 'dns';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';

// Configure DNS fallback to Google Public DNS to prevent Windows/ISP UDP SRV lookup refusal
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore fallback error if environment overrides
}
import { authMiddleware, AuthRequest } from './middleware/auth.js';
import { searchFlights, getFlightDetails, preCachePopularRoutes } from './controllers/flightController.js';
import { searchHotelByName, searchHotels, getHotelDetails, getCancellationPolicy, createTempBooking, issueHotelTicket } from './controllers/hotelController.js';
import { chatWithAgent } from './controllers/aiController.js';
import { signup, login, socialLogin, getProfile, updateProfile } from './controllers/authController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Compression & Cache Headers ───────────────────────────────────────────────
app.use(compression());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/auth') && !req.path.startsWith('/api/user')) {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  next();
});

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
  const cleanUrl = process.env.FRONTEND_URL.trim().replace(/\/+$/, '');
  if (cleanUrl) allowedOrigins.push(cleanUrl);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.startsWith('http://192.168.') || origin.startsWith('http://10.') || origin.startsWith('http://172.')) {
      return callback(null, true);
    }
    if (origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── MongoDB Connection ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://tourhelpdeskinc_db_user:UvYPGYWLS4SXDz07@tourhelpdesk.w873nv3.mongodb.net/?retryWrites=true&w=majority&appName=tourhelpdesk';

const connectDB = async () => {
  if (!MONGO_URI) return;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error?.message || error);
    console.log('⚠️  Server will continue (database endpoints will return error responses)');
  }
};

mongoose.connection.on('disconnected', () => console.log('⚠️  MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error:', err));
mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected'));

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/social', socialLogin);
app.get('/api/auth/profile', authMiddleware, getProfile as any);
app.put('/api/auth/profile', authMiddleware, updateProfile as any);

// ── Protected User Routes ─────────────────────────────────────────────────────
app.get('/api/user/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Secure Profile Data', user: req.user });
});

// ── Flight Routes ─────────────────────────────────────────────────────────────
app.post('/api/flights/search', searchFlights);
app.get('/api/flights/:id', getFlightDetails);

// ── Hotel Routes ──────────────────────────────────────────────────────────────
app.post('/api/hotels/autocomplete', searchHotelByName);
app.post('/api/hotels/search', searchHotels);
app.post('/api/hotels/details', getHotelDetails);
app.post('/api/hotels/cancellation-policy', getCancellationPolicy);
app.post('/api/hotels/temp-booking', createTempBooking);
app.post('/api/hotels/ticket', issueHotelTicket);

// ── AI Routes ─────────────────────────────────────────────────────────────────
app.post('/api/ai/chat', chatWithAgent);

// ── Health & Status ───────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown',
    }
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global server error:', err?.message || err);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);

    preCachePopularRoutes().catch(err => console.log('Pre-caching skipped:', err.message || err));
  });
};

startServer().catch(err => {
  console.error('Fatal server boot failure:', err);
});
