import React, { useState } from 'react';
import { ArrowUpDown, Star } from 'lucide-react';
import { TokenRow } from './TokenRow';
import type { Token } from '../types/token';

interface TokensTableProps {
  tokens: Token[];
  loading: boolean;
  onTokenSelect: (token: Token) => void;
  toggleFavorite: (tokenId: string) => void;
  isFavorite: (tokenId: string) => boolean;
}

type SortField = 'rank' | 'marketCap' | 'volume24h' | 'trustlines' | 'priceUSD' | 'change24h' | 'change7d' | 'exchanges24h';
type SortDirection = 'asc' | 'desc';

export const TokensTable: React.FC<TokensTableProps> = ({ 
  tokens, 
  loading, 
  onTokenSelect,
  toggleFavorite,
  isFavorite
}) => {
  const [sortField, setSortField] = useState<SortField>('volume24h');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    // First sort by favorites
    if (isFavorite(a.id) && !isFavorite(b.id)) return -1;
    if (!isFavorite(a.id) && isFavorite(b.id)) return 1;

    // Then sort by the selected field
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * multiplier;
    }
    return 0;
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`group inline-flex items-center space-x-1 ${
        sortField === field ? 'text-blue-500 dark:text-blue-400' : ''
      }`}
    >
      <span>{label}</span>
      <ArrowUpDown className={`h-4 w-4 transition-opacity ${
        sortField === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
      }`} />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Star className="h-4 w-4 inline-block" />
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="rank" label="#" />
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div>
                <SortButton field="priceUSD" label="Price" />
              </div>
              <div className="text-[10px] font-normal opacity-75">USD / XRP</div>
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div>
                <SortButton field="change24h" label="24h Change" />
              </div>
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div>
                <SortButton field="change7d" label="7d Change" />
              </div>
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="marketCap" label="Market Cap" />
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="volume24h" label="Volume (24h)" />
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="exchanges24h" label="Trades (24h)" />
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="trustlines" label="Trustlines" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTokens.map((token, index) => (
            <TokenRow 
              key={token.id} 
              token={token} 
              rank={index + 1}
              isFavorite={isFavorite(token.id)}
              onFavoriteClick={() => toggleFavorite(token.id)}
              onClick={() => onTokenSelect(token)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};