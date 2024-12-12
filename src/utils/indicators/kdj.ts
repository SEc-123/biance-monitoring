import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';

export const calculateKDJ = (data: KlineData[], period: number = 9) => {
  const highs = data.map(d => parseFloat(d.high));
  const lows = data.map(d => parseFloat(d.low));
  const closes = data.map(d => parseFloat(d.close));
  
  const k: number[] = [50];
  const d: number[] = [50];
  const j: number[] = [50];

  for (let i = period - 1; i < data.length; i++) {
    const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
    const close = closes[i];
    
    const rsv = ((close - periodLow) / (periodHigh - periodLow)) * 100;
    k.push((2/3) * k[k.length - 1] + (1/3) * rsv);
    d.push((2/3) * d[d.length - 1] + (1/3) * k[k.length - 1]);
    j.push(3 * k[k.length - 1] - 2 * d[d.length - 1]);
  }

  const kRange = calculateRange(k);
  const dRange = calculateRange(d);
  const jRange = calculateRange(j);

  return {
    k: { current: k[k.length - 1] || 0, ...kRange },
    d: { current: d[d.length - 1] || 0, ...dRange },
    j: { current: j[j.length - 1] || 0, ...jRange }
  };
};