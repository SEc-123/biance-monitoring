import { useState, useEffect } from 'react';
import { getSpotPrice, getFuturesPrice } from '../api/binanceApi';

interface PriceState {
  [key: string]: {
    spot: string;
    futures: string;
    previous: string;
  };
}

export const usePriceUpdates = (symbols: string[]) => {
  const [prices, setPrices] = useState<PriceState>({});
  
  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices: PriceState = {};
      
      for (const symbol of symbols) {
        try {
          const [spotData, futuresData] = await Promise.all([
            getSpotPrice(symbol),
            getFuturesPrice(symbol),
          ]);
          
          newPrices[symbol] = {
            spot: spotData.price,
            futures: futuresData.price,
            previous: prices[symbol]?.spot || spotData.price,
          };
        } catch (error) {
          console.error(`Error fetching prices for ${symbol}:`, error);
        }
      }
      
      setPrices(newPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);

    return () => clearInterval(interval);
  }, [symbols]);

  return { prices };
};