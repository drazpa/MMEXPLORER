import { Token } from '../types/token';
import { fetchTokens, fetchXRPPrice } from './api';

export class XRPLMetaWebSocket {
  private updateInterval: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = 0;
  private updateThrottle: number = 10000; // 10 seconds
  private onTokensUpdate: (tokens: Token[]) => void;
  private previousPrices: Record<string, number> = {};
  private isInitialized: boolean = false;

  constructor(onTokensUpdate: (tokens: Token[]) => void) {
    this.onTokensUpdate = onTokensUpdate;
    this.initialize().catch(error => {
      console.error('Failed to initialize token updates:', error);
    });
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.isInitialized = true;
      await this.fetchLatestData();
      this.startPolling();
    } catch (error) {
      this.isInitialized = false;
      console.error('Error during initialization:', error);
      // Retry initialization after 5 seconds
      setTimeout(() => this.initialize(), 5000);
    }
  }

  private async fetchLatestData(): Promise<void> {
    try {
      const [tokens, xrpPrice] = await Promise.all([
        fetchTokens(),
        fetchXRPPrice()
      ]);

      if (!Array.isArray(tokens)) {
        throw new Error('Invalid tokens data received');
      }

      const updatedTokens = tokens.map(token => {
        const tokenId = `${token.currency}-${token.issuer}`;
        const currentPrice = token.priceUSD;
        const previousPrice = this.previousPrices[tokenId] || currentPrice;

        // Update previous price
        this.previousPrices[tokenId] = currentPrice;

        return {
          ...token,
          priceIncreased: currentPrice > previousPrice,
          priceDecreased: currentPrice < previousPrice
        };
      });

      // Sort by volume and take top 100
      const sortedTokens = updatedTokens
        .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
        .slice(0, 100);

      this.onTokensUpdate(sortedTokens);
      this.lastUpdateTime = Date.now();
    } catch (error) {
      console.error('Error fetching token data:', error);
      throw error;
    }
  }

  private startPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      const now = Date.now();
      if (now - this.lastUpdateTime >= this.updateThrottle) {
        try {
          await this.fetchLatestData();
        } catch (error) {
          console.error('Error during polling update:', error);
        }
      }
    }, this.updateThrottle);
  }

  public disconnect(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isInitialized = false;
  }
}