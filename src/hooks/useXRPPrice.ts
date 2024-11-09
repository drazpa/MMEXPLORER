import { useState, useEffect } from 'react';
import { fetchXRPPrice } from '../services/api';

export function useXRPPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const updatePrice = async () => {
      try {
        const newPrice = await fetchXRPPrice();
        if (mounted) {
          setPrice(newPrice);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch XRP price');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, 30000); // Update every 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { price, loading, error };
}