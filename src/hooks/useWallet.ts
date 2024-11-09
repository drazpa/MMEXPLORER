import { useState, useCallback } from 'react';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      // Here we'll integrate with XUMM SDK
      // For now, using mock data
      setConnected(true);
      setAccount('rRandomXRPLAddress123456789');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAccount(null);
  }, []);

  return {
    connected,
    account,
    connect,
    disconnect
  };
}