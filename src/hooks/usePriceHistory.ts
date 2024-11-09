import { useState, useEffect } from 'react';
import { Token } from '../types/token';

interface PricePoint {
  time: number;
  value: number;
}

export const usePriceHistory = (token: Token) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const updateInterval = 30000; // Update every 30 seconds

    const generatePriceHistory = () => {
      const now = Date.now();
      const points = 50; // Increased points for smoother line
      const basePrice = token.priceUSD;
      const change24h = token.change24h / 100; // Convert percentage to decimal
      const startPrice = basePrice / (1 + change24h);
      
      // Generate smooth price curve based on actual 24h change
      const history = Array.from({ length: points }, (_, i) => {
        const timePoint = now - (points - i) * ((24 * 3600 * 1000) / points); // Distribute points over 24h
        const progress = i / (points - 1);
        
        // Enhanced Bezier curve for more natural price movement
        const t = progress;
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        
        // Control points for the curve
        const p0 = startPrice;
        const p1 = startPrice * (1 + change24h * 0.5);
        const p2 = basePrice * 0.9;
        const p3 = basePrice;
        
        // Cubic Bezier calculation
        const price = p0 * mt3 + 3 * p1 * mt2 * t + 3 * p2 * mt * t2 + p3 * t3;
        
        // Add variable noise based on position in the curve
        const volatility = 0.002 * Math.sin(progress * Math.PI); // More volatile in the middle
        const noise = price * volatility * (Math.random() - 0.5);
        
        return {
          time: timePoint / 1000,
          value: price + noise
        };
      });

      if (mounted) {
        setPriceHistory(history);
        setLoading(false);
      }
    };

    generatePriceHistory();
    const interval = setInterval(generatePriceHistory, updateInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [token.priceUSD, token.change24h]);

  return { priceHistory, loading };
};