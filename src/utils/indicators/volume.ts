import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';

export const calculateVolume = (data: KlineData[], period: number = 20) => {
  const volumes = data.map(d => parseFloat(d.volume));
  const closes = data.map(d => parseFloat(d.close));
  const average = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  
  const trend = closes[closes.length - 1] > closes[closes.length - 2] ? 'up' : 'down';
  const range = calculateRange(volumes);
  
  return {
    current: volumes[volumes.length - 1] || 0,
    average,
    trend,
    range: {
      current: volumes[volumes.length - 1] || 0,
      ...range
    }
  };
};