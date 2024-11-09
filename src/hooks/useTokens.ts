import { useState, useEffect, useCallback } from 'react';
import { Token } from '../types/token';
import { fetchTokens } from '../services/api';

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('tokenFavorites');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const handleTokensUpdate = useCallback((newTokens: Token[]) => {
    // Sort by volume and limit to top 100
    const sortedTokens = [...newTokens]
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 100);
    setTokens(sortedTokens);
    setLoading(false);
    setIsRefreshing(false);
  }, []);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (!isManualRefresh) {
        setLoading(true);
      }
      setError(null);
      const data = await fetchTokens();
      handleTokensUpdate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tokens');
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [handleTokensUpdate]);

  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout;

    const initializeData = async () => {
      await fetchData();
      
      // Poll for updates every 30 seconds
      pollInterval = setInterval(() => {
        if (mounted) {
          fetchData(true);
        }
      }, 30000);
    };

    initializeData();

    return () => {
      mounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fetchData]);

  const toggleFavorite = useCallback((tokenId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenId)) {
        newFavorites.delete(tokenId);
      } else {
        newFavorites.add(tokenId);
      }
      localStorage.setItem('tokenFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((tokenId: string) => {
    return favorites.has(tokenId);
  }, [favorites]);

  return {
    tokens,
    loading,
    error,
    refetch: () => {
      setIsRefreshing(true);
      return fetchData(true);
    },
    isRefreshing,
    toggleFavorite,
    isFavorite,
    searchTerm,
    setSearchTerm
  };
}