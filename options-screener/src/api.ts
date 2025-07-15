export type OptionsFilters = {
  ticker: string;
  expiration?: string;
  minVolume?: number;
  minOpenInterest?: number;
  maxBidAskSpread?: number;
  includeGreeks?: boolean;
};

export type ScreenerFilters = {
  tickers: string[];
  minVolume?: number;
  minOpenInterest?: number;
  maxBidAskSpread?: number;
  optionType?: 'calls' | 'puts' | 'both';
};

export type OptionContract = {
  contractSymbol: string;
  strike: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility?: number;
  delta?: number;
  bidAskSpread?: number;
  bidAskSpreadPercent?: number;
  moneyness?: string;
};

export type OptionsData = {
  ticker: string;
  currentPrice: number;
  expiration: string;
  availableExpirations: string[];
  calls: OptionContract[];
  puts: OptionContract[];
  filters: {
    minVolume: number;
    minOpenInterest: number;
    maxBidAskSpread?: number;
  };
};

export type ScreenerResult = {
  ticker: string;
  type: 'Call' | 'Put';
  expiration: string;
  strike: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  currentPrice: number;
};

export type CandlestickData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export async function fetchOptionsData(filters: OptionsFilters): Promise<OptionsData> {
  const response = await fetch("http://127.0.0.1:5000/api/options", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to fetch options data";
    throw new Error(message);
  }

  return response.json();
}

export async function fetchExpirations(ticker: string): Promise<string[]> {
  const response = await fetch(`http://127.0.0.1:5000/api/expirations/${ticker}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to fetch expirations";
    throw new Error(message);
  }

  const data = await response.json();
  return data.expirations || [];
}

export async function screenOptions(filters: ScreenerFilters): Promise<ScreenerResult[]> {
  const response = await fetch("http://127.0.0.1:5000/api/screener", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to screen options";
    throw new Error(message);
  }

  const data = await response.json();
  return data.results || [];
}

export async function fetchHistoricalData(ticker: string): Promise<CandlestickData[]> {
  const response = await fetch(`http://127.0.0.1:5000/api/historical-data/${ticker}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to fetch historical data";
    throw new Error(message);
  }

  const data = await response.json();
  return data.data || [];
}
