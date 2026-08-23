import { Router, Request, Response } from 'express';
import env from '../config/env.js';

const router = Router();

// In-memory cache for exchange rates
let cachedRates: Record<string, number> | null = null;
let cacheExpiry = 0;
let cacheSource: 'currencyfreaks' | 'fallback' = 'fallback';

const LIVE_TTL = 6 * 60 * 60 * 1000;      // 6 hours for successful live rates
const FALLBACK_TTL = 10 * 60 * 1000;      // 10 minutes for fallback (retry sooner)
const FETCH_TIMEOUT = 5000;               // 5 seconds

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 87.5,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
};

/**
 * GET /api/currency/rates
 * Returns real-time exchange rates (base USD) from CurrencyFreaks API
 */
router.get('/rates', async (_req: Request, res: Response) => {
  const now = Date.now();
  if (cachedRates && now < cacheExpiry) {
    return res.json({ success: true, base: 'USD', rates: cachedRates, source: cacheSource });
  }

  const apiKey = env.CURRENCYFREAKS_API_KEY;

  if (apiKey && apiKey !== 'your_api_key_here') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(
        `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=USD,INR,EUR,GBP,AED`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as { rates?: Record<string, string> };
        if (data?.rates) {
          const rates: Record<string, number> = {
            USD: 1,
            INR: parseFloat(data.rates.INR) || FALLBACK_RATES.INR,
            EUR: parseFloat(data.rates.EUR) || FALLBACK_RATES.EUR,
            GBP: parseFloat(data.rates.GBP) || FALLBACK_RATES.GBP,
            AED: parseFloat(data.rates.AED) || FALLBACK_RATES.AED,
          };
          cachedRates = rates;
          cacheExpiry = now + LIVE_TTL;
          cacheSource = 'currencyfreaks';
          return res.json({ success: true, base: 'USD', rates, source: 'currencyfreaks' });
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const reason = err instanceof Error && err.name === 'AbortError' ? 'timeout' : err;
      console.warn('CurrencyFreaks API fetch error, using fallback rates:', reason);
    }
  }

  // Cache the fallback too, with a shorter TTL, so we don't retry on every request
  cachedRates = FALLBACK_RATES;
  cacheExpiry = now + FALLBACK_TTL;
  cacheSource = 'fallback';
  return res.json({ success: true, base: 'USD', rates: FALLBACK_RATES, source: 'fallback' });
});

export default router;