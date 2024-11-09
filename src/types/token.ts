export interface RawToken {
  id: string;
  currency: string;
  issuer: string;
  name?: string;
  meta?: {
    token?: {
      icon?: string;
    };
  };
  metrics?: {
    price?: { value: string | number };
    price_xrp?: { value: string | number };
    volume_24h?: { value: string | number };
    volume_7d?: { value: string | number };
    marketcap?: { value: string | number };
    supply?: { value: string | number };
    holders?: { value: string | number };
    trustlines?: { value: string | number };
    exchanges_24h?: { value: string | number };
    exchanges_7d?: { value: string | number };
    takers_24h?: { value: string | number };
    takers_7d?: { value: string | number };
    changes?: {
      '24h'?: {
        price?: {
          percent?: number;
        };
      };
      '7d'?: {
        price?: {
          percent?: number;
        };
      };
      '1h'?: {
        price?: {
          percent?: number;
        };
      };
    };
  };
}

export interface Token {
  id: string;
  currency: string;
  symbol: string;
  issuer: string;
  name: string;
  icon?: string;
  priceUSD: number;
  priceXRP: number;
  volume24h: number;
  volume7d: number;
  marketCap: number;
  supply: number;
  holders: number;
  trustlines: number;
  exchanges24h: number;
  exchanges7d: number;
  takers24h: number;
  takers7d: number;
  change24h: number;
  change7d: number;
  change1h: number;
  dexOffers: number;
}

export interface FeaturedToken {
  tokenName: string;
  issuer: string;
  socialLink: string;
  featuredAt: string;
  txHash: string;
}