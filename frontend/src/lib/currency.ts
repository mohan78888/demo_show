export interface CurrencyOption {
  code: 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED';
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
];

export const DEFAULT_CURRENCY = 'USD';

// In-memory real-time rates cache
let activeRates: Record<string, number> = {
  USD: 1,
  INR: 87.5,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
};

let ratesFetchPromise: Promise<Record<string, number>> | null = null;

/**
 * Fetch real-time exchange rates from backend (which connects to CurrencyFreaks)
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  if (ratesFetchPromise) return ratesFetchPromise;

  ratesFetchPromise = (async () => {
    try {
      const res = await fetch('/api/currency/rates');
      if (res.ok) {
        const data = await res.json();
        if (data?.rates) {
          activeRates = data.rates;
          return data.rates;
        }
      }
    } catch {
      // Graceful fallback to default base rates
    }
    return activeRates;
  })();

  return ratesFetchPromise;
}

/**
 * Converts a base price in INR to the target currency using real rates.
 */
export function convertINR(amountInINR: number, targetCurrency: string = 'USD'): number {
  if (!amountInINR || isNaN(amountInINR)) return 0;
  if (targetCurrency === 'INR') return Math.round(amountInINR);

  const inrRate = activeRates['INR'] || 87.5;
  const targetRate = activeRates[targetCurrency] || (targetCurrency === 'USD' ? 1 : 1);

  // Convert INR -> USD -> Target Currency
  const priceInUSD = amountInINR / inrRate;
  const converted = priceInUSD * targetRate;
  return Math.round(converted);
}

/**
 * Get current selected currency from localStorage or default to USD
 */
export function getSavedCurrency(): CurrencyOption {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferred_currency');
    if (saved) {
      const found = CURRENCIES.find((c) => c.code === saved);
      if (found) return found;
    }
  }
  return CURRENCIES[0]; // USD
}
