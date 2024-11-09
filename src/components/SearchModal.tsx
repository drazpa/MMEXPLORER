import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2, Star } from 'lucide-react';
import { Token } from '../types/token';
import { formatUSDPrice, formatNumber } from '../utils/formatters';
import { fetchAllTokens } from '../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  loading: boolean;
  toggleFavorite: (tokenId: string) => void;
  isFavorite: (tokenId: string) => boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  loading: initialLoading,
  toggleFavorite,
  isFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTokens = useCallback(async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allTokens = await fetchAllTokens();
      const searchLower = term.toLowerCase();
      
      const filtered = allTokens.filter(token => 
        token.currency.toLowerCase().includes(searchLower) ||
        token.issuer.toLowerCase().includes(searchLower)
      );

      // Sort results by volume
      const sortedResults = filtered.sort((a, b) => b.volume24h - a.volume24h);
      setSearchResults(sortedResults);
    } catch (err) {
      setError('Failed to search tokens. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchTokens(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchTokens]);

  if (!isOpen) return null;

  const handleFavoriteClick = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    toggleFavorite(tokenId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="search-modal" role="dialog" aria-modal="true">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity" 
             aria-hidden="true" 
             onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full card-glow modal-animation">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Search XRPL Tokens
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                placeholder="Search by token currency or issuer address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {error}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((token) => (
                    <div
                      key={token.id}
                      onClick={() => {
                        onSelect(token);
                        onClose();
                      }}
                      className="w-full p-4 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors glow-effect cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {token.currency.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {token.currency}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                              {token.issuer}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatUSDPrice(token.priceUSD)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Vol: ${formatNumber(token.volume24h)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleFavoriteClick(e, token.id)}
                            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                              isFavorite(token.id) ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tokens found matching "{searchTerm}"
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Enter a token currency or issuer address to search
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};