import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Token } from '../types/token';
import { TokenModal } from './TokenModal';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { TokensTable } from './TokensTable';

interface TokenListProps {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  isRefreshing: boolean;
  toggleFavorite: (tokenId: string) => void;
  isFavorite: (tokenId: string) => boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const TokenList: React.FC<TokenListProps> = ({ 
  tokens,
  loading,
  error, 
  onRefresh,
  isRefreshing,
  toggleFavorite,
  isFavorite,
  searchTerm: externalSearchTerm,
  onSearchChange
}) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  
  // Use external search term if provided, otherwise use internal
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const handleSearchChange = onSearchChange || setInternalSearchTerm;

  // Filter tokens based on search term
  const filteredTokens = searchTerm
    ? tokens.filter(token => 
        token.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tokens;

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)]"
            placeholder="Search tokens by currency or issuer..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="button-glow inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && filteredTokens.length === 0 ? (
        <LoadingState />
      ) : (
        <>
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No tokens found matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <TokensTable 
              tokens={filteredTokens}
              loading={loading}
              onTokenSelect={setSelectedToken}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}
        </>
      )}

      {selectedToken && (
        <TokenModal 
          token={selectedToken} 
          onClose={() => setSelectedToken(null)} 
        />
      )}
    </div>
  );
};