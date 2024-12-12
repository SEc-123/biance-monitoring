import { KlineData } from '../../types/binance';

export const calculateMA = (data: KlineData[], period: number): number[] => {
  const closes = data.map(d => parseFloat(d.close));
  const ma: number[] = [];
  
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  
  return ma;
};