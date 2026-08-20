import { NextResponse } from 'next/server';

let cachedRates: Record<string, number> | null = null;
let cacheExpiry = 0;

export async function GET() {
  const now = Date.now();
  if (cachedRates && now < cacheExpiry) {
    return NextResponse.json({ success: true, base: 'USD', rates: cachedRates, source: 'cache' });
  }

  const apiKey = process.env.CURRENCYFREAKS_API_KEY;

  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      const response = await fetch(
        `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=USD,INR,EUR,GBP,AED`,
        { next: { revalidate: 21600 } } // 6 hours
      );

      if (response.ok) {
        const data = (await response.json()) as { rates?: Record<string, string> };
        if (data?.rates) {
          const rates: Record<string, number> = {
            USD: 1,
            INR: parseFloat(data.rates.INR) || 87.5,
            EUR: parseFloat(data.rates.EUR) || 0.92,
            GBP: parseFloat(data.rates.GBP) || 0.79,
            AED: parseFloat(data.rates.AED) || 3.67,
          };
          cachedRates = rates;
          cacheExpiry = now + 6 * 60 * 60 * 1000;
          return NextResponse.json({ success: true, base: 'USD', rates, source: 'currencyfreaks' });
        }
      }
    } catch {
      // Fallback
    }
  }

  const fallbackRates: Record<string, number> = {
    USD: 1,
    INR: 87.5,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
  };

  return NextResponse.json({ success: true, base: 'USD', rates: fallbackRates, source: 'fallback' });
}
