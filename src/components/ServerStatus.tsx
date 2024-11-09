import React from 'react';
import { useServerInfo } from '../hooks/useServerInfo';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ServerStatus: React.FC = () => {
  const { serverInfo, loading, error } = useServerInfo();

  if (loading) {
    return (
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end space-x-2 text-sm">
            <span>Loading server status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !serverInfo) {
    return (
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end space-x-2 text-sm">
            <XCircle className="h-4 w-4 text-red-400 mr-1" />
            <span className="text-red-400">Server Error</span>
          </div>
        </div>
      </div>
    );
  }

  const isOnline = serverInfo.status === 'online';
  const ledgerIndex = serverInfo.ledgerIndex?.toLocaleString() ?? 'Unknown';

  return (
    <div className="bg-gray-800 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end space-x-2 text-sm">
          <span>Server Status:</span>
          <div className="flex items-center">
            {isOnline ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400">Online</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-red-400">Offline</span>
              </>
            )}
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">
            Ledger: {ledgerIndex}
          </span>
        </div>
      </div>
    </div>
  );
};