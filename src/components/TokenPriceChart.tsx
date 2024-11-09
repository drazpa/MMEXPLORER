import React, { useEffect, useRef, memo } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { Token } from '../types/token';
import { useTheme } from '../context/ThemeContext';

interface TokenPriceChartProps {
  token: Token;
  height?: number | string;
  showVolume?: boolean;
  isPremium?: boolean;
}

export const TokenPriceChart = memo<TokenPriceChartProps>(({ 
  token, 
  height = 200,
  showVolume = false,
  isPremium = false
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { priceHistory, loading } = usePriceHistory(token);

  useEffect(() => {
    if (!chartContainerRef.current || loading || !priceHistory.length) return;

    const isDarkTheme = theme === 'dark';
    const chartOptions = {
      layout: {
        background: { 
          type: ColorType.Solid, 
          color: isDarkTheme 
            ? isPremium ? '#1e293b80' : '#1F293720'
            : isPremium ? '#f8fafc80' : '#F8FAFC20'
        },
        textColor: isDarkTheme ? '#D1D5DB' : '#4B5563',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { 
          color: isDarkTheme 
            ? isPremium ? '#374151' : '#37415120'
            : isPremium ? '#E5E7EB' : '#E5E7EB20', 
          style: 1 
        },
        horzLines: { 
          color: isDarkTheme 
            ? isPremium ? '#374151' : '#37415120'
            : isPremium ? '#E5E7EB' : '#E5E7EB20', 
          style: 1 
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: typeof height === 'string' ? chartContainerRef.current.clientHeight : height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.2 : 0.1,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: isDarkTheme ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDarkTheme ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);

    const areaSeries = chart.addAreaSeries({
      lineColor: isPremium 
        ? '#3B82F6'
        : token.change24h >= 0 ? '#10B981' : '#EF4444',
      topColor: isPremium 
        ? '#3B82F640'
        : token.change24h >= 0 ? '#10B98140' : '#EF444440',
      bottomColor: isPremium 
        ? '#3B82F600'
        : token.change24h >= 0 ? '#10B98100' : '#EF444400',
      lineWidth: isPremium ? 2 : 1.5,
      priceFormat: {
        type: 'price',
        precision: token.priceUSD < 1 ? 6 : 2,
        minMove: token.priceUSD < 1 ? 0.000001 : 0.01,
      },
    });

    areaSeries.setData(priceHistory);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: typeof height === 'string' ? chartContainerRef.current.clientHeight : height
        });
        chart.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [theme, token, priceHistory, loading, height, showVolume, isPremium]);

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center rounded-lg animate-pulse ${
          isPremium 
            ? 'bg-gray-50/50 dark:bg-gray-900/50'
            : 'bg-gray-50/30 dark:bg-gray-900/30'
        }`}
        style={{ height: typeof height === 'string' ? '100%' : `${height}px` }}
      >
        <div className="text-gray-400 dark:text-gray-600">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${
        isPremium
          ? 'from-white/20 to-transparent dark:from-gray-800/20'
          : 'from-white/10 to-transparent dark:from-gray-800/10'
      }`} />
    </div>
  );
});