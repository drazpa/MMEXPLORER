import { useState, useEffect, useCallback } from 'react';
import { Token } from '../types/token';
import { fetchAllTokens } from '../services/api';

const ITEMS_PER_PAGE = 50;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const MAX_SEARCHABLE_TOKENS = 1000; // Changed to 1000

// Cache at module level
let cachedTokens: Token[] | null = null;
let lastFetchTime = 0;

export function useAllTokens() {
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('tokenFavorites');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const handleTokensUpdate = useCallback((newTokens: Token[]) => {
    setAllTokens(newTokens);
    // Initial display will show top 50 by volume
    if (!searchTerm) {
      setDisplayedTokens(newTokens.slice(0, ITEMS_PER_PAGE));
    }
    setLoading(false);
    setIsRefreshing(false);
  }, [searchTerm]);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (!isManualRefresh) {
        setLoading(true);
      }
      setError(null);

      // Use cached data if available and not expired
      const now = Date.now();
      if (cachedTokens && now - lastFetchTime < CACHE_DURATION && !isManualRefresh) {
        handleTokensUpdate(cachedTokens);
        return;
      }

      const data = await fetchAllTokens();
      cachedTokens = data;
      lastFetchTime = now;
      handleTokensUpdate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tokens');
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [handleTokensUpdate]);

  // Effect for search using Web Worker
  useEffect(() => {
    if (!allTokens.length) return;

    const worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url));
    
    worker.onmessage = (e) => {
      setDisplayedTokens(e.data);
      worker.terminate();
    };

    worker.postMessage({
      tokens: allTokens.slice(0, MAX_SEARCHABLE_TOKENS),
      searchTerm,
      limit: searchTerm ? undefined : ITEMS_PER_PAGE
    });

    return () => worker.terminate();
  }, [allTokens, searchTerm]);

  // Initial data fetch and polling
  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout;

    const initializeData = async () => {
      if (mounted) {
        await fetchData();
        // Poll less frequently
        pollInterval = setInterval(() => {
          if (mounted) {
            fetchData(true);
          }
        }, CACHE_DURATION);
      }
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
    tokens: displayedTokens,
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
    setSearchTerm,
    totalTokens: allTokens.length,
    searchableTokens: MAX_SEARCHABLE_TOKENS
  };
}