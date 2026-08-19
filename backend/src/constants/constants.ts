export const AIRLINE_CODE_MAP: Record<string, string> = {
  '6E': 'IndiGo',
  'AI': 'Air India',
  'UK': 'Vistara',
  'QP': 'Akasa Air',
  'SG': 'SpiceJet',
  'G8': 'Go First',
  'I5': 'AirAsia India',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'BA': 'British Airways',
  'AA': 'American Airlines',
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'SQ': 'Singapore Airlines',
};

export const getAirlineName = (code: string, rawName?: string): string => {
  if (rawName && rawName.trim().length > 0 && rawName !== 'Partner Airline') {
    return rawName.trim();
  }
  return AIRLINE_CODE_MAP[code] || `${code} Airlines`;
};
