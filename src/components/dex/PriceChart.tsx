import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface PriceChartProps {
  theme: 'light' | 'dark';
}

export const PriceChart: React.FC<PriceChartProps> = ({ theme }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { color: theme === 'dark' ? '#1F2937' : '#ffffff' },
        textColor: theme === 'dark' ? '#D1D5DB' : '#374151',
      },
      grid: {
        vertLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
        horzLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    });

    // Mock data
    const data = generateMockData();
    candlestickSeries.setData(data);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [theme]);

  return <div ref={chartContainerRef} />;
};

function generateMockData() {
  const data = [];
  const numberOfPoints = 100;
  let currentPrice = 100;
  
  for (let i = 0; i < numberOfPoints; i++) {
    const time = new Date();
    time.setDate(time.getDate() - (numberOfPoints - i));
    
    const open = currentPrice * (1 + (Math.random() - 0.5) * 0.1);
    const high = open * (1 + Math.random() * 0.05);
    const low = open * (1 - Math.random() * 0.05);
    const close = low + Math.random() * (high - low);
    
    currentPrice = close;
    
    data.push({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close,
    });
  }
  
  return data;
}