import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TradeHistory: React.FC = () => {
  // Mock data
  const trades = Array.from({ length: 20 }, () => ({
    price: (0.4123 + (Math.random() - 0.5) * 0.001).toFixed(4),
    size: (Math.random() * 1000).toFixed(2),
    time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
    type: Math.random() > 0.5 ? 'buy' : 'sell'
  }));

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Trade History
      </h3>
      
      <div className="text-xs">
        <div className="grid grid-cols-4 text-gray-500 dark:text-gray-400 mb-2">
          <div>Price (XRP)</div>
          <div className="text-right">Size</div>
          <div className="text-right">Time</div>
        </div>

        <div className="space-y-1">
          {trades.map((trade, i) => (
            <div key={i} className="grid grid-cols-4 items-center">
              <div className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                <div className="flex items-center">
                  {trade.type === 'buy' 
                    ? <ArrowUpRight className="h-3 w-3 mr-1" />
                    : <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  {trade.price}
                </div>
              </div>
              <div className="text-right text-gray-900 dark:text-gray-100">
                {trade.size}
              </div>
              <div className="text-right text-gray-500 dark:text-gray-400">
                {trade.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};