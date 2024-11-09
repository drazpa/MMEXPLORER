import React from 'react';

export const OrderBook: React.FC = () => {
  // Mock data
  const asks = Array.from({ length: 8 }, (_, i) => ({
    price: (0.4123 + i * 0.0001).toFixed(4),
    size: Math.random() * 1000,
    total: Math.random() * 5000
  }));

  const bids = Array.from({ length: 8 }, (_, i) => ({
    price: (0.4123 - i * 0.0001).toFixed(4),
    size: Math.random() * 1000,
    total: Math.random() * 5000
  }));

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Order Book
      </h3>
      
      <div className="text-xs">
        <div className="grid grid-cols-3 text-gray-500 dark:text-gray-400 mb-2">
          <div>Price (XRP)</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks */}
        <div className="space-y-1">
          {asks.reverse().map((ask, i) => (
            <div key={i} className="grid grid-cols-3 text-red-500">
              <div>{ask.price}</div>
              <div className="text-right">{ask.size.toFixed(2)}</div>
              <div className="text-right">{ask.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="my-2 py-2 border-y border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
          <div className="grid grid-cols-3">
            <div>Spread</div>
            <div className="text-right">0.0002</div>
            <div className="text-right">0.05%</div>
          </div>
        </div>

        {/* Bids */}
        <div className="space-y-1">
          {bids.map((bid, i) => (
            <div key={i} className="grid grid-cols-3 text-green-500">
              <div>{bid.price}</div>
              <div className="text-right">{bid.size.toFixed(2)}</div>
              <div className="text-right">{bid.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};