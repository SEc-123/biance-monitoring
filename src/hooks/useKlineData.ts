import { useState, useEffect } from 'react';
import { getKlines } from '../api/binanceApi';
import { TimeframeData, KlineData, Timeframe } from '../types/binance';

export const useKlineData = (selectedSymbol: string, selectedTimeframe: Timeframe) => {
  const [timeframeData, setTimeframeData] = useState<{ [symbol: string]: TimeframeData }>({});
  const [klineData, setKlineData] = useState<{ [timeframe: string]: KlineData[] }>({});

  useEffect(() => {
    const fetchKlineData = async () => {
      if (!selectedSymbol) return;

      try {
        const { klines, indicators } = await getKlines(selectedSymbol, selectedTimeframe);
        
        setKlineData(prev => ({
          ...prev,
          [selectedTimeframe]: klines
        }));

        setTimeframeData(prev => ({
          ...prev,
          [selectedSymbol]: {
            ...prev[selectedSymbol],
            [selectedTimeframe]: indicators
          }
        }));
      } catch (error) {
        console.error('Error fetching kline data:', error);
      }
    };

    fetchKlineData();
    const interval = setInterval(fetchKlineData, 5000);

    return () => clearInterval(interval);
  }, [selectedSymbol, selectedTimeframe]);

  return { timeframeData, klineData };
};