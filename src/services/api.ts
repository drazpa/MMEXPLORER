import axios from 'axios';
import { Token, RawToken } from '../types/token';

const API_BASE_URL = 'https://s2.xrplmeta.org';
const PRICE_ENDPOINTS = [
  'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd',
  'https://api.binance.com/api/v3/ticker/price?symbol=XRPUSDT',
  'https://api.kraken.com/0/public/Ticker?pair=XRPUSD'
];

let cachedXRPPrice: number | null = null;
let lastPriceUpdate = 0;
const PRICE_CACHE_DURATION = 30000; // 30 seconds

export const fetchXRPPrice = async (): Promise<number> => {
  if (cachedXRPPrice && Date.now() - lastPriceUpdate < PRICE_CACHE_DURATION) {
    return cachedXRPPrice;
  }

  const errors: Error[] = [];

  for (const endpoint of PRICE_ENDPOINTS) {
    try {
      const response = await axios.get(endpoint);
      let price = null;

      if (endpoint.includes('coingecko')) {
        price = response.data?.ripple?.usd;
      } else if (endpoint.includes('binance')) {
        price = parseFloat(response.data?.price);
      } else if (endpoint.includes('kraken')) {
        price = parseFloat(response.data?.result?.XXRPZUSD?.c?.[0]);
      }

      if (price) {
        cachedXRPPrice = price;
        lastPriceUpdate = Date.now();
        return price;
      }
    } catch (error) {
      errors.push(error as Error);
    }
  }

  if (cachedXRPPrice !== null) {
    return cachedXRPPrice;
  }

  throw new Error(`Failed to fetch XRP price from all sources: ${errors.map(e => e.message).join(', ')}`);
};

export const fetchTokens = async (searchTerm?: string): Promise<Token[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tokens`, {
      params: {
        name_like: searchTerm,
        currency_like: searchTerm,
        issuer_like: searchTerm,
        sort_by: 'volume_24h',
        limit: 100,
        include_changes: true,
        expand_meta: true
      }
    });

    if (!response.data || !Array.isArray(response.data.tokens)) {
      throw new Error('Invalid response format');
    }

    const xrpPrice = await fetchXRPPrice();
    return response.data.tokens
      .map(token => transformToken(token, xrpPrice))
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 100);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchAllTokens = async (searchTerm?: string): Promise<Token[]> => {
  try {
    const batchSize = 100;
    const maxTokens = 1000; // Changed to 1000 tokens

    let allTokens: RawToken[] = [];
    let offset = 0;

    while (offset < maxTokens) {
      const response = await axios.get(`${API_BASE_URL}/tokens`, {
        params: {
          name_like: searchTerm,
          currency_like: searchTerm,
          issuer_like: searchTerm,
          offset: offset,
          limit: batchSize,
          include_changes: true,
          expand_meta: true,
          sort_by: 'volume_24h',
          min_trustlines: 0,
          min_volume_24h: 0
        }
      });

      if (!response.data || !Array.isArray(response.data.tokens)) {
        throw new Error('Invalid response format');
      }

      const tokens = response.data.tokens;
      if (tokens.length === 0) break;

      allTokens = [...allTokens, ...tokens];
      offset += batchSize;

      if (tokens.length < batchSize || allTokens.length >= maxTokens) break;
    }

    const xrpPrice = await fetchXRPPrice();
    const transformedTokens = allTokens
      .slice(0, maxTokens)
      .map(token => transformToken(token, xrpPrice));

    return transformedTokens.sort((a, b) => b.volume24h - a.volume24h);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

const transformToken = (rawToken: RawToken, xrpPrice: number): Token => {
  const metrics = rawToken.metrics || {};
  
  let currency = rawToken.currency;
  let name = rawToken.name || '';
  
  if (typeof currency === 'string' && /^[0-9A-F]+$/i.test(currency)) {
    currency = decodeHexCurrency(currency);
  }

  if (!name || name === currency) {
    name = currency;
  }

  const priceUSD = parseMetricValue(metrics.price);
  const priceXRP = xrpPrice > 0 ? priceUSD / xrpPrice : parseMetricValue(metrics.price_xrp);

  return {
    id: `${currency}-${rawToken.issuer}`,
    currency,
    symbol: currency,
    issuer: rawToken.issuer,
    name,
    icon: rawToken.meta?.token?.icon,
    priceUSD,
    priceXRP,
    volume24h: parseMetricValue(metrics.volume_24h),
    volume7d: parseMetricValue(metrics.volume_7d),
    marketCap: parseMetricValue(metrics.marketcap),
    supply: parseMetricValue(metrics.supply),
    holders: parseMetricValue(metrics.holders),
    trustlines: parseMetricValue(metrics.trustlines),
    exchanges24h: parseMetricValue(metrics.exchanges_24h),
    exchanges7d: parseMetricValue(metrics.exchanges_7d),
    takers24h: parseMetricValue(metrics.takers_24h),
    takers7d: parseMetricValue(metrics.takers_7d),
    change24h: parseMetricValue(metrics.changes?.['24h']?.price?.percent),
    change7d: parseMetricValue(metrics.changes?.['7d']?.price?.percent),
    change1h: parseMetricValue(metrics.changes?.['1h']?.price?.percent)
  };
};

const parseMetricValue = (metric: any): number => {
  if (!metric) return 0;
  if (typeof metric === 'object' && metric.value !== undefined) {
    return typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value;
  }
  if (typeof metric === 'string') return parseFloat(metric);
  if (typeof metric === 'number') return metric;
  return 0;
};

const decodeHexCurrency = (hex: string): string => {
  try {
    if (!hex.match(/^[0-9A-F]+$/i)) return hex;
    
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const decoder = new TextDecoder('utf-8');
    const decoded = decoder.decode(bytes).replace(/\0/g, '');
    
    return decoded || hex;
  } catch {
    return hex;
  }
};