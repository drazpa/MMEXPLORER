import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, ArrowDownRight, Star, Users, Activity, Wallet, Globe } from 'lucide-react';
import { Token } from '../types/token';
import { TokenPriceChart } from './TokenPriceChart';
import { TokenModal } from './TokenModal';
import { formatUSDPrice, formatNumber, formatPercentage } from '../utils/formatters';

interface FeaturedTokenCardProps {
  token: Token;
  rank: number;
  isPremium?: boolean;
  onTradeClick?: () => void;
  onSocialClick?: () => void;
}

export const FeaturedTokenCard: React.FC<FeaturedTokenCardProps> = ({
  token,
  rank,
  isPremium = false,
  onTradeClick,
  onSocialClick,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getTrustlineUrl = (token: Token) => {
    const hexCode = token.currency.length === 40 ? token.currency : '';
    return `https://xrpl.services/?issuer=${token.issuer}&currency=${hexCode || token.currency}&limit=1000000000`;
  };

  const handleTrustlineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getTrustlineUrl(token), '_blank');
  };

  const handleTradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTradeClick) {
      onTradeClick();
    } else {
      window.open(`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, '_blank');
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSocialClick) {
      onSocialClick();
    } else if (token.websiteUrl) {
      window.open(token.websiteUrl, '_blank');
    }
  };

  const getRankGlow = () => {
    if (rank === 0) return 'shadow-[0_0_50px_rgba(234,179,8,0.8)]';
    switch (rank) {
      case 1:
        return 'shadow-[0_0_50px_rgba(234,179,8,0.6)]';
      case 2:
        return 'shadow-[0_0_50px_rgba(226,232,240,0.6)]';
      case 3:
        return 'shadow-[0_0_50px_rgba(180,83,9,0.6)]';
      default:
        return 'shadow-[0_0_30px_rgba(59,130,246,0.3)]';
    }
  };

  const getRankBadgeStyle = () => {
    if (rank === 0) {
      return 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 scale-125';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300';
      case 2:
        return 'bg-gradient-to-br from-gray-200 to-gray-400 border-gray-300';
      case 3:
        return 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-400';
      default:
        return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300';
    }
  };

  const ActionButtons = ({ isPremium = false }) => (
    <div className={`flex ${isPremium ? 'space-x-3' : 'space-x-2'} p-4`} onClick={e => e.stopPropagation()}>
      <button
        onClick={handleTradeClick}
        className={`flex-1 px-3 py-2 ${isPremium ? 'text-sm' : 'text-xs'} font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-200`}
      >
        Trade Now
      </button>
      <button
        onClick={handleTrustlineClick}
        className={`flex-1 px-3 py-2 ${isPremium ? 'text-sm' : 'text-xs'} font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors duration-200`}
      >
        Trustline
      </button>
      {isPremium && (
        <button
          onClick={handleWebsiteClick}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700/70 transition-colors duration-200 flex items-center justify-center"
        >
          <Globe className="h-4 w-4 mr-2" />
          Website
        </button>
      )}
    </div>
  );

  return (
    <>
      <div 
        className={`
          h-full flex flex-col cursor-pointer
          relative overflow-hidden rounded-2xl transition-all duration-300
          bg-white/5 dark:bg-gray-800/5 backdrop-blur-md
          ${getRankGlow()}
          hover:transform hover:scale-[1.02]
          border border-blue-500/20 dark:border-blue-400/20
        `}
        onClick={() => setShowModal(true)}
      >
        {/* Rank Badge */}
        <div className={`
          absolute top-3 left-3 flex items-center justify-center w-6 h-6 
          rounded-full shadow-lg border text-white z-10 transition-transform duration-300
          ${getRankBadgeStyle()}
        `}>
          <span className="font-bold text-xs">#{rank}</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col h-full">
          {/* Header with Price */}
          <div className="p-4 sm:p-5">
            <div className="flex justify-between items-start space-x-3 sm:space-x-4">
              <div className="ml-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {token.currency}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[140px] sm:max-w-[160px]">
                  {token.issuer}
                </p>
              </div>
              <div className="text-right">
                <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatUSDPrice(token.priceUSD)}
                </div>
                <div className={`flex items-center justify-end mt-1 ${
                  token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.change24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {formatPercentage(token.change24h)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-5 mb-4 ml-8">
            <div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Activity className="h-4 w-4 mr-1" />
                <p className="text-xs">Volume 24h</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                ${formatNumber(token.volume24h)}
              </p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Wallet className="h-4 w-4 mr-1" />
                <p className="text-xs">Market Cap</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                ${formatNumber(token.marketCap)}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-[140px]">
            <TokenPriceChart 
              token={token} 
              height="100%"
              showVolume={false}
              isPremium={false}
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons />
        </div>
      </div>

      {/* Token Modal */}
      {showModal && (
        <TokenModal 
          token={token} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};