import React from 'react';
import { ExternalLink, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Crown, Wallet, Activity } from 'lucide-react';
import { FeaturedToken } from '../types/token';
import { useTheme } from '../context/ThemeContext';
import { formatUSDPrice, formatNumber, formatPercentage } from '../utils/formatters';

interface TopFeaturedSpotProps {
  token: FeaturedToken;
}

export const TopFeaturedSpot: React.FC<TopFeaturedSpotProps> = ({ token }) => {
  const { theme } = useTheme();

  const StatBox = ({ title, value, change, icon: Icon }: { 
    title: string; 
    value: string; 
    change?: number;
    icon: any;
  }) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-800/10 backdrop-blur-xl rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -mr-16 -mt-16 group-hover:bg-blue-400/20 transition-colors duration-300"></div>
      <div className="relative">
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
          <Icon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
          {value}
        </div>
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${
            change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-semibold">{formatPercentage(change)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-yellow-500/5 via-white to-blue-500/5 dark:from-yellow-500/10 dark:via-gray-800 dark:to-blue-500/10 rounded-3xl shadow-2xl overflow-hidden border border-yellow-200/20 dark:border-yellow-700/20 backdrop-blur-xl transform hover:scale-[1.02] transition-all duration-500">
      {/* Premium Badge */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-gradient-to-r from-yellow-400/90 to-amber-400/90 px-4 py-2 rounded-full shadow-lg z-10">
        <Crown className="h-5 w-5 text-white" />
        <span className="text-sm font-bold text-white">Premium Featured</span>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl -ml-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl -mr-48 -mb-48 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-5xl md:text-6xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
                {token.currency}
              </span>
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {token.issuer}
              </p>
              <a
                href={`https://xrpscan.com/account/${token.issuer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                View on Explorer
              </a>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a
              href={token.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <span className="mr-2">Visit Project</span>
              <ExternalLink className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatBox 
            title="Current Price" 
            value={formatUSDPrice(token.priceUSD)}
            change={token.change24h}
            icon={TrendingUp}
          />
          <StatBox 
            title="24h Volume" 
            value={`$${formatNumber(token.volume24h)}`}
            icon={Activity}
          />
          <StatBox 
            title="Market Cap" 
            value={`$${formatNumber(token.marketCap)}`}
            icon={Wallet}
          />
          <StatBox 
            title="Total Holders" 
            value={formatNumber(token.holders)}
            icon={Users}
          />
        </div>

        {/* TradingView Chart */}
        <div className="relative h-[600px] rounded-xl overflow-hidden shadow-lg border border-yellow-200/20 dark:border-yellow-700/20 backdrop-blur-xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <iframe
            key={theme}
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${token.currency}USD&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=${theme === 'dark' ? '1f2937' : 'ffffff'}&studies=[]&theme=${theme}&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&page-uri=${encodeURIComponent(window.location.href)}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowTransparency
            allowFullScreen
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
  );
};