import { Router, Request, Response } from 'express';
import env from '../config/env.js';

const router = Router();

// In-memory cache for exchange rates (6 hours TTL)
let cachedRates: Record<string, number> | null = null;
let cacheExpiry = 0;

/**
 * GET /api/currency/rates
 * Returns real-time exchange rates (base USD) from CurrencyFreaks API
 */
router.get('/rates', async (_req: Request, res: Response) => {
  const now = Date.now();
  if (cachedRates && now < cacheExpiry) {
    return res.json({ success: true, base: 'USD', rates: cachedRates, source: 'cache' });
  }

  const apiKey = env.CURRENCYFREAKS_API_KEY || process.env.CURRENCYFREAKS_API_KEY;

  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      const response = await fetch(
        `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=USD,INR,EUR,GBP,AED`
      );

      if (response.ok) {
        const data = (await response.json()) as { rates?: Record<string, string> };
        if (data && data.rates) {
          const rates: Record<string, number> = {
            USD: 1,
            INR: parseFloat(data.rates.INR) || 87.5,
            EUR: parseFloat(data.rates.EUR) || 0.92,
            GBP: parseFloat(data.rates.GBP) || 0.79,
            AED: parseFloat(data.rates.AED) || 3.67,
          };
          cachedRates = rates;
          cacheExpiry = now + 6 * 60 * 60 * 1000; // 6 hours
          return res.json({ success: true, base: 'USD', rates, source: 'currencyfreaks' });
        }
      }
    } catch (err) {
      console.warn('CurrencyFreaks API fetch error, using fallback rates:', err);
    }
  }

  // Robust fallback rates if API key is not configured or network fails
  const fallbackRates: Record<string, number> = {
    USD: 1,
    INR: 87.5,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
  };

  return res.json({ success: true, base: 'USD', rates: fallbackRates, source: 'fallback' });
});

export default router;
