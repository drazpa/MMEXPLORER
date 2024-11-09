import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useXRPPrice } from '../hooks/useXRPPrice';
import { formatUSDPrice } from '../utils/formatters';

export const XRPPriceBanner: React.FC = () => {
  const { price, loading, error, priceIncreased, priceDecreased } = useXRPPrice();
  const [animate, setAnimate] = useState(false);

  // Trigger animation when price changes
  useEffect(() => {
    if (priceIncreased || priceDecreased) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [price, priceIncreased, priceDecreased]);

  if (error) {
    return (
      <div className="bg-red-600 dark:bg-red-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-8 text-white">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 dark:bg-blue-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-8 text-white">
          {loading && !price ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <>
              <span className="font-bold mr-2">XRP/USD:</span>
              <span className={`font-mono transition-colors duration-300 ${
                animate ? (
                  priceIncreased ? 'text-green-300' : 
                  priceDecreased ? 'text-red-300' : ''
                ) : ''
              }`}>
                {formatUSDPrice(price)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};