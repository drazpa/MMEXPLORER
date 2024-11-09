import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Wallet, PieChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { formatUSDPrice, formatNumber, formatPercentage } from '../utils/formatters';

export const Portfolio: React.FC = () => {
  const { connected, account } = useWallet();

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Wallet className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Connect your XUMM wallet to view your portfolio, track your assets, and monitor your performance.
        </p>
      </div>
    );
  }

  // Mock portfolio data
  const portfolioValue = 15234.56;
  const portfolioChange = 5.67;
  const assets = [
    { name: 'XRP', symbol: 'XRP', balance: 1000, value: 5000, change24h: 2.5 },
    { name: 'Solo', symbol: 'SOLO', balance: 500, value: 2500, change24h: -1.2 },
    { name: 'Coreum', symbol: 'CORE', balance: 200, value: 1000, change24h: 3.7 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Portfolio Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatUSDPrice(portfolioValue)}
                </p>
                <div className={`flex items-center mt-1 ${
                  portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {portfolioChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {formatPercentage(portfolioChange)}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <PieChart className="h-16 w-16 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Asset List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Your Assets
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset) => (
                <div key={asset.symbol} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {asset.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {asset.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNumber(asset.balance)} {asset.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatUSDPrice(asset.value)}
                      </p>
                      <div className={`flex items-center justify-end mt-1 ${
                        asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {asset.change24h >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-xs font-medium">
                          {formatPercentage(asset.change24h)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {i % 2 === 0 ? 'Received XRP' : 'Sent SOLO'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${
                    i % 2 === 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {i % 2 === 0 ? '+100 XRP' : '-50 SOLO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};