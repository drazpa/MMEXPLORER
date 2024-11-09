import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, TrendingUp, TrendingDown, Users, 
  Globe, Wallet, CircleDollarSign, ArrowRightLeft,
  ChevronRight, Percent, ArrowUpRight, ArrowDownRight,
  BarChart3
} from 'lucide-react';
import { Token } from '../types/token';
import { TokenIcon } from './TokenIcon';
import { TokenChart } from './TokenChart';
import { useTheme } from '../context/ThemeContext';
import { formatUSDPrice, formatXRPPrice, formatNumber, formatPercentage } from '../utils/formatters';
import { createPortal } from 'react-dom';

interface TokenModalProps {
  token: Token;
  onClose: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({ token, onClose }) => {
  const { theme } = useTheme();
  const [selectedChart, setSelectedChart] = useState<'price' | 'volume' | 'holders'>('price');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getTrustlineUrl = (token: Token) => {
    const hexCode = token.currency.length === 40 ? token.currency : '';
    return `https://xrpl.services/?issuer=${token.issuer}&currency=${hexCode || token.currency}&limit=1000000000`;
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity" 
        aria-hidden="true" 
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TokenIcon currency={token.currency} size="lg" />
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {token.currency}
                      </h2>
                      <div className="flex items-center mt-2 space-x-4">
                        <a
                          href={`https://xrpscan.com/account/${token.issuer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Explorer
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {token.issuer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {formatUSDPrice(token.priceUSD)}
                    </div>
                    <div className={`flex items-center justify-end mt-2 ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 mr-1" />
                      )}
                      <span className="text-lg font-medium">
                        {formatPercentage(token.change24h)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                  title="Price"
                  mainValue={formatUSDPrice(token.priceUSD)}
                  subValue={`${formatXRPPrice(token.priceXRP)} XRP`}
                  icon={CircleDollarSign}
                  change={token.change24h}
                />
                <StatCard
                  title="24h Volume"
                  mainValue={`$${formatNumber(token.volume24h)}`}
                  subValue={`${formatNumber(token.volume24h / token.priceUSD * token.priceXRP)} XRP`}
                  icon={BarChart3}
                />
                <StatCard
                  title="Market Cap"
                  mainValue={`$${formatNumber(token.marketCap)}`}
                  icon={Wallet}
                />
              </div>

              {/* Chart */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-6">
                <TokenChart token={token} theme={theme} chartType={selectedChart} />
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Market Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">Holders</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.holders)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">Trustlines</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.trustlines)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">Supply</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.supply)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Trading Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">24h Trades</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.exchanges24h)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">24h Takers</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.takers24h)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500 dark:text-gray-400">7d Trades</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(token.exchanges7d)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <a
                  href={getTrustlineUrl(token)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors duration-200 flex items-center justify-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Trustline
                </a>
                <a
                  href={`https://xrpscan.com/account/${token.issuer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700/70 transition-colors duration-200 flex items-center justify-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  View on Explorer
                </a>
                <a
                  href={`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Trade Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal
  return mounted ? createPortal(modalContent, document.body) : null;
};

// Helper component for stats cards
const StatCard = ({ 
  title, 
  mainValue, 
  subValue, 
  change,
  icon: Icon,
  className = ''
}: { 
  title: string;
  mainValue: string;
  subValue?: string;
  change?: number;
  icon: any;
  className?: string;
}) => (
  <div className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-4 card-glow ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div className="space-y-2">
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        {mainValue}
      </div>
      {subValue && (
        <div className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium">
          {subValue}
        </div>
      )}
      {change !== undefined && (
        <div className={`flex items-center mt-2 ${
          change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {change >= 0 ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {formatPercentage(change)}
          </span>
        </div>
      )}
    </div>
  </div>
);