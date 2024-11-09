import React, { useEffect, useState, useMemo } from 'react';
import { FeaturedTokenCard } from '../components/FeaturedTokenCard';
import { Token } from '../types/token';
import { useTokens } from '../hooks/useTokens';
import { fetchTokens } from '../services/api';

// Premium tokens configuration
const PREMIUM_TOKENS = [
  {
    id: 'LOVE-rDpdyF9LtYpwRdHZs8sghaPscE8rH9sgfs',
    currency: 'LOVE',
    symbol: 'LOVE',
    issuer: 'rDpdyF9LtYpwRdHZs8sghaPscE8rH9sgfs',
    name: 'LOVE',
    websiteUrl: 'https://www.lovecoinnetwork.com'
  },
  {
    id: 'MINT-rwCsCz93A1svS6Yv8hFqUeKLdTLhBpvqGD',
    currency: 'MINT',
    symbol: 'MINT',
    issuer: 'rwCsCz93A1svS6Yv8hFqUeKLdTLhBpvqGD',
    name: 'MINT',
    websiteUrl: 'https://mintnetwork.org'
  },
  {
    id: 'MAGIC-rwCsCz93A1svS6Yv8hFqUeKLdTLhBpvqGD',
    currency: 'MAGIC',
    symbol: 'MAGIC',
    issuer: 'rwCsCz93A1svS6Yv8hFqUeKLdTLhBpvqGD',
    name: 'MAGIC',
    websiteUrl: 'https://magicnetwork.org'
  }
] as const;

export const FeaturedCoins: React.FC = () => {
  const { tokens } = useTokens();
  const [premiumTokens, setPremiumTokens] = useState<Token[]>([]);
  const [currentPremiumIndex, setCurrentPremiumIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize filtered tokens to prevent unnecessary recalculations
  const topTokens = useMemo(() => 
    tokens
      .filter(token => !PREMIUM_TOKENS.some(pt => pt.currency === token.currency))
      .slice(0, 19), // Get 19 tokens (3 for top featured + 16 for grid)
    [tokens]
  );

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchPremiumData = async () => {
      try {
        const premiumData = await Promise.all(
          PREMIUM_TOKENS.map(async (token) => {
            const response = await fetchTokens(token.currency);
            const tokenData = response.find(
              t => t.currency === token.currency && t.issuer === token.issuer
            );
            return {
              ...token,
              ...tokenData,
              priceUSD: tokenData?.priceUSD || 0,
              priceXRP: tokenData?.priceXRP || 0,
              volume24h: tokenData?.volume24h || 0,
              volume7d: tokenData?.volume7d || 0,
              marketCap: tokenData?.marketCap || 0,
              supply: tokenData?.supply || 0,
              holders: tokenData?.holders || 0,
              trustlines: tokenData?.trustlines || 0,
              exchanges24h: tokenData?.exchanges24h || 0,
              exchanges7d: tokenData?.exchanges7d || 0,
              takers24h: tokenData?.takers24h || 0,
              takers7d: tokenData?.takers7d || 0,
              change24h: tokenData?.change24h || 0,
              change7d: tokenData?.change7d || 0,
              change1h: tokenData?.change1h || 0,
              dexOffers: tokenData?.dexOffers || 0,
            };
          })
        );

        if (mounted) {
          setPremiumTokens(premiumData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching premium token data:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPremiumData();
    
    // Rotate premium tokens every 30 seconds
    intervalId = setInterval(() => {
      if (mounted) {
        setCurrentPremiumIndex(prev => (prev + 1) % PREMIUM_TOKENS.length);
      }
    }, 30000);

    // Refresh data every 30 seconds
    const dataInterval = setInterval(fetchPremiumData, 30000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      clearInterval(dataInterval);
    };
  }, []);

  // Memoize handlers to prevent unnecessary recreations
  const handleSocialClick = useMemo(() => 
    (url: string) => window.open(url, '_blank'),
    []
  );

  const handleTradeClick = useMemo(() => 
    (token: Token) => window.open(
      `https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, 
      '_blank'
    ),
    []
  );

  const currentPremiumToken = premiumTokens[currentPremiumIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 sm:space-y-8">
        {/* Premium Featured Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Premium Featured
            </span>
            <span className="text-gray-100 dark:text-white"> Coin</span>
          </h2>

          {/* Premium Token Card with Carousel */}
          <div className="relative">
            <div className="h-[420px] sm:h-[450px] w-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl rounded-3xl overflow-hidden border-2 border-blue-500/50 dark:border-blue-400/50 shadow-[0_0_50px_rgba(59,130,246,0.5)] dark:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:shadow-[0_0_70px_rgba(59,130,246,0.7)] dark:hover:shadow-[0_0_70px_rgba(37,99,235,0.7)] transition-all duration-500">
              {currentPremiumToken && (
                <FeaturedTokenCard
                  token={currentPremiumToken}
                  rank={0}
                  isPremium={true}
                  onSocialClick={() => handleSocialClick(currentPremiumToken.websiteUrl)}
                  onTradeClick={() => handleTradeClick(currentPremiumToken)}
                />
              )}
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {PREMIUM_TOKENS.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPremiumIndex
                      ? 'bg-blue-500 w-4'
                      : 'bg-gray-400/50 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentPremiumIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Top Featured Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Top Featured
            </span>
            <span className="text-gray-100 dark:text-white"> Coins</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTokens.slice(0, 3).map((token, index) => (
              <div 
                key={token.id} 
                className={`
                  h-[420px] sm:h-[450px] bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl overflow-hidden
                  border-2 border-blue-500/30 dark:border-blue-400/30
                  ${index === 0 
                    ? 'shadow-[0_0_50px_rgba(251,191,36,0.6)] dark:shadow-[0_0_50px_rgba(251,191,36,0.4)] hover:shadow-[0_0_70px_rgba(251,191,36,0.8)]' 
                    : index === 1
                      ? 'shadow-[0_0_50px_rgba(226,232,240,0.6)] dark:shadow-[0_0_50px_rgba(226,232,240,0.4)] hover:shadow-[0_0_70px_rgba(226,232,240,0.8)]'
                      : 'shadow-[0_0_50px_rgba(180,83,9,0.6)] dark:shadow-[0_0_50px_rgba(180,83,9,0.4)] hover:shadow-[0_0_70px_rgba(180,83,9,0.8)]'
                  }
                  transform hover:scale-[1.02] transition-all duration-500
                `}
              >
                <FeaturedTokenCard
                  token={token}
                  rank={index + 1}
                  onSocialClick={() => handleSocialClick(token.websiteUrl || '')}
                  onTradeClick={() => handleTradeClick(token)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Tokens Grid */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Featured
            </span>
            <span className="text-gray-100 dark:text-white"> Coins</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topTokens.slice(3, 19).map((token, index) => (
              <div 
                key={token.id} 
                className="h-[420px] sm:h-[450px] bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-blue-500/30 dark:border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300"
              >
                <FeaturedTokenCard
                  token={token}
                  rank={index + 4}
                  onSocialClick={() => handleSocialClick(token.websiteUrl || '')}
                  onTradeClick={() => handleTradeClick(token)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};