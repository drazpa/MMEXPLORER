import React, { useState } from 'react';
import { 
  ArrowDownUp, Search, Settings, Info, 
  ChevronDown, ArrowRight, RefreshCw
} from 'lucide-react';
import { TokenSelector } from '../components/dex/TokenSelector';
import { PriceChart } from '../components/dex/PriceChart';
import { OrderBook } from '../components/dex/OrderBook';
import { TradeHistory } from '../components/dex/TradeHistory';
import { useTheme } from '../context/ThemeContext';

export const Dex: React.FC = () => {
  const { theme } = useTheme();
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [showBaseSelector, setShowBaseSelector] = useState(false);
  const [showQuoteSelector, setShowQuoteSelector] = useState(false);

  // Mock data for demonstration
  const baseToken = {
    symbol: 'SOLO',
    name: 'Sologenic',
    issuer: 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
  };

  const quoteToken = {
    symbol: 'XRP',
    name: 'XRP',
    issuer: ''
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Interface */}
        <div className="lg:col-span-1 space-y-6">
          {/* Swap Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Trade
              </h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Base Token Input */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-2">
              <div className="flex justify-between mb-2">
                <input
                  type="text"
                  className="bg-transparent text-2xl outline-none w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.0"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                />
                <button
                  onClick={() => setShowBaseSelector(true)}
                  className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 rounded-lg px-3 py-1 text-blue-600 dark:text-blue-400"
                >
                  <span>{baseToken.symbol}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Balance: 0.00
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <ArrowDownUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Quote Token Input */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mt-2">
              <div className="flex justify-between mb-2">
                <input
                  type="text"
                  className="bg-transparent text-2xl outline-none w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.0"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                />
                <button
                  onClick={() => setShowQuoteSelector(true)}
                  className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-1"
                >
                  <span>{quoteToken.symbol}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Balance: 0.00
              </div>
            </div>

            {/* Price Info */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Price</span>
                <span className="text-gray-900 dark:text-gray-100">
                  1 {baseToken.symbol} = 0.4123 {quoteToken.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
                <span className="text-gray-900 dark:text-gray-100">0.000012 XRP</span>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg">
              Connect Wallet
            </button>
          </div>
        </div>

        {/* Chart and Orderbook */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <PriceChart theme={theme} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <OrderBook />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <TradeHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Token Selectors */}
      <TokenSelector
        isOpen={showBaseSelector}
        onClose={() => setShowBaseSelector(false)}
        onSelect={(token) => {
          console.log('Selected token:', token);
          setShowBaseSelector(false);
        }}
      />
      <TokenSelector
        isOpen={showQuoteSelector}
        onClose={() => setShowQuoteSelector(false)}
        onSelect={(token) => {
          console.log('Selected token:', token);
          setShowQuoteSelector(false);
        }}
      />
    </div>
  );
};