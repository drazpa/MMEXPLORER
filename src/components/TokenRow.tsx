import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { Token } from '../types/token';
import { TokenIcon } from './TokenIcon';
import { formatUSDPrice, formatXRPPrice, formatNumber, formatPercentage } from '../utils/formatters';

interface TokenRowProps {
  token: Token;
  rank: number;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onClick: () => void;
}

export const TokenRow: React.FC<TokenRowProps> = ({ 
  token, 
  rank, 
  isFavorite,
  onFavoriteClick,
  onClick 
}) => {
  const [animate, setAnimate] = useState(false);
  const isXRP = token.currency === 'XRP' || token.currency === '58525000000000000000000000000000000000000000';

  useEffect(() => {
    if (token.priceIncreased || token.priceDecreased) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [token.priceIncreased, token.priceDecreased]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick();
  };

  const renderPriceChange = (value: number) => (
    <div className={`flex items-center justify-center ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {value >= 0 ? (
        <ArrowUpRight className="h-4 w-4 mr-1" />
      ) : (
        <ArrowDownRight className="h-4 w-4 mr-1" />
      )}
      <span className="text-sm font-medium">
        {formatPercentage(value)}
      </span>
    </div>
  );

  return (
    <tr 
      className="table-row-glow hover:bg-gray-50/90 dark:hover:bg-gray-700/90 transition-all cursor-pointer backdrop-blur-sm" 
      onClick={onClick}
    >
      <td className="px-2 py-4 whitespace-nowrap text-center">
        <button
          onClick={handleFavoriteClick}
          className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
            isFavorite ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Star className="h-4 w-4 fill-current" />
        </button>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {rank}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <TokenIcon currency={token.currency} size="sm" className="mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {token.currency}
            </div>
            {!isXRP && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={token.issuer}>
                {token.issuer}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {formatUSDPrice(token.priceUSD)}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          {formatXRPPrice(token.priceXRP)} XRP
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        {renderPriceChange(token.change24h)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        {renderPriceChange(token.change7d)}
      </td>
      <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
        ${formatNumber(token.marketCap, 1)}
      </td>
      <td className="px-4 py-4 text-center whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          ${formatNumber(token.volume24h, 1)}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          {formatNumber(token.volume24h / token.priceUSD * token.priceXRP, 1)} XRP
        </div>
      </td>
      <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
        {formatNumber(token.exchanges24h, 0)}
      </td>
      <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
        {formatNumber(token.trustlines, 0)}
      </td>
    </tr>
  );
};