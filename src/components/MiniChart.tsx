import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface MiniChartProps {
  data: { time: number; value: number }[];
  width?: number;
  height?: number;
  theme: 'light' | 'dark';
  increasing?: boolean;
  decreasing?: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  width = 300, 
  height = 100,
  theme,
  increasing,
  decreasing
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: theme === 'dark' ? '#9CA3AF' : '#6B7280',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false }
      },
      handleScroll: false,
      handleScale: false,
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    // Get base colors based on price movement
    const baseColor = increasing ? '#10B981' : decreasing ? '#EF4444' : '#3B82F6';
    const gradientTopColor = increasing ? '#10B981' : decreasing ? '#EF4444' : '#3B82F6';
    
    seriesRef.current = chartRef.current.addAreaSeries({
      lineColor: baseColor,
      topColor: `${gradientTopColor}40`,
      bottomColor: `${gradientTopColor}00`,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      },
    });

    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
        chartRef.current.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);

    // Animate gradient opacity
    let animationFrame: number;
    const animate = () => {
      const alpha = Math.abs(Math.sin(Date.now() / 1000)) * 0.3 + 0.2;
      if (seriesRef.current) {
        seriesRef.current.applyOptions({
          topColor: `${gradientTopColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
          lineWidth: 3 + Math.sin(Date.now() / 1000) * 0.5, // Subtle line width animation
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [theme, increasing, decreasing, height]);

  // Update data without recreating the chart
  useEffect(() => {
    if (seriesRef.current && data) {
      seriesRef.current.setData(data);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

  return (
    <div className="relative">
      <div ref={chartContainerRef} className="w-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 to-transparent dark:from-gray-800/10" />
    </div>
  );
};