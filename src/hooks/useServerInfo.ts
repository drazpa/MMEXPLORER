import { useState, useEffect, useCallback } from 'react';
import { fetchServerStatus, ServerStatus } from '../services/api';

export function useServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServerStatus();
      setServerInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching server info');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(fetchInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchInfo]);

  return {
    serverInfo,
    loading,
    error,
    refetch: fetchInfo
  };
}