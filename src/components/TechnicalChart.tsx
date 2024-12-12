import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { KlineData } from '../types/binance';
import type { Timeframe } from '../types/binance';

interface TechnicalChartProps {
  data: KlineData[];
  symbol: string;
  timeframe: Timeframe;
}

export const TechnicalChart: React.FC<TechnicalChartProps> = ({ data, symbol, timeframe }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 600, // Increased height for better visibility
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const chartData = data.map((item) => ({
        time: item.openTime / 1000,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      }));

      candlestickSeries.setData(chartData);
      chartRef.current = chart;

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [data]);

  const timeframeLabels: { [key in Timeframe]: string } = {
    '30m': '30 Minutes',
    '1h': '1 Hour',
    '2h': '2 Hours',
    '4h': '4 Hours',
    '8h': '8 Hours',
    '12h': '12 Hours',
    '1d': 'Daily',
    '1w': 'Weekly',
    '1M': 'Monthly'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        {symbol} Chart ({timeframeLabels[timeframe]})
      </h2>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};