import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, TimeRange } from 'lightweight-charts';
import { Token } from '../types/token';
import { Clock } from 'lucide-react';

interface TokenChartProps {
  token: Token;
  theme: 'light' | 'dark';
  chartType: 'price' | 'volume' | 'holders';
}

type TimeFrame = '1H' | '24H' | '7D' | '30D' | '1Y' | 'ALL';

export const TokenChart: React.FC<TokenChartProps> = ({ token, theme, chartType }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('7D');

  const timeFrames: TimeFrame[] = ['1H', '24H', '7D', '30D', '1Y', 'ALL'];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { color: theme === 'dark' ? '#1F2937' : '#ffffff' },
        textColor: theme === 'dark' ? '#D1D5DB' : '#374151',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB', style: 1 },
        horzLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB', style: 1 },
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString();
        },
      },
      crosshair: {
        vertLine: {
          color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
    };

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: 250, // Reduced height
    });

    const series = chart.addAreaSeries({
      lineColor: '#2563EB',
      topColor: '#3B82F680',
      bottomColor: theme === 'dark' ? '#1F293720' : '#EFF6FF20',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      },
    });

    // Generate data based on time frame
    const generateData = (timeFrame: TimeFrame) => {
      const now = Date.now();
      const points = timeFrame === '1H' ? 60 : 
                    timeFrame === '24H' ? 24 : 
                    timeFrame === '7D' ? 168 :
                    timeFrame === '30D' ? 30 :
                    timeFrame === '1Y' ? 365 : 730;

      const interval = timeFrame === '1H' ? 60 * 1000 : 
                      timeFrame === '24H' ? 3600 * 1000 :
                      timeFrame === '7D' ? 3600 * 1000 :
                      timeFrame === '30D' ? 24 * 3600 * 1000 :
                      24 * 3600 * 1000;

      return Array.from({ length: points }, (_, i) => {
        const time = new Date(now - (points - i) * interval);
        const baseValue = chartType === 'price' ? token.priceUSD :
                         chartType === 'volume' ? token.volume24h / points :
                         token.holders / points;
        const variance = baseValue * 0.1;
        const value = baseValue + (Math.random() - 0.5) * variance;
        return {
          time: time.getTime() / 1000,
          value: value
        };
      });
    };

    const data = generateData(selectedTimeFrame);
    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [theme, chartType, token, selectedTimeFrame]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Time Frame</span>
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame}
              onClick={() => setSelectedTimeFrame(timeFrame)}
              className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200 ${
                selectedTimeFrame === timeFrame
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {timeFrame}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[250px]" />
    </div>
  );
};