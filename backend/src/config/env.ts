import { z } from 'zod';

/**
 * Production-grade environment variable schema using Zod as the single source of truth.
 * Validates required environment variables and enforces types at startup.
 */
const envSchema = z.object({
  // Server Configuration
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Authentication & Secrets (Required - No Fallbacks)
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required in environment variables'),
  JWT_EXPIRE: z.string().default('7d'),

  // Database (Required - No Fallbacks)
  MONGO_URI: z.string().min(1, 'MONGO_URI is required in environment variables'),
  DB_MAX_POOL_SIZE: z
    .string()
    .default('30')
    .transform((val) => parseInt(val, 10)),

  // Resend Email Service (Optional - No Hardcoded Fallback)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Tour Help Desk <noreply@tourhelpdesk.com>'),

  // AI Service (Optional - No Hardcoded Fallback)
  GEMINI_API_KEY: z.string().optional(),

  // Flyshop External GDS Services (UAT Fallbacks for development)
  FLYSHOP_BASE_URL: z
    .string()
    .default('http://uat.flyshop.in/AirlineHost/AirAPIService.svc/JSONService'),
  FLYSHOP_HOTEL_URL: z
    .string()
    .default('http://uat.flyshop.in/HotelHost/HotelNewAPIService.svc/JSONService'),
  FLYSHOP_TRADE_URL: z
    .string()
    .default('http://uat.flyshop.in/tradehost/TradeAPIService.svc/JSONService'),
  // Flyshop External GDS Credentials (Required - Loaded only from .env)
  FLYSHOP_USER_ID: z.string().min(1, 'FLYSHOP_USER_ID is required in environment variables'),
  FLYSHOP_PASSWORD: z.string().min(1, 'FLYSHOP_PASSWORD is required in environment variables'),

  // Frontend & Security
  FRONTEND_URL: z.string().optional(),
});

/**
 * Validates process.env against envSchema.
 * Throws a formatted error and halts startup if validation fails, removing duplicate parsing logic.
 */
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment configuration error:');
    result.error.issues.forEach((issue) => {
      // Log only field paths and validation messages to avoid leaking secret values in logs
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error(
      'Invalid or missing environment variables. Please check your .env / .env.local file.'
    );
  }

  return result.data;
};

// Export validated and strongly typed environment configuration object
export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
export default env;

