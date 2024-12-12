import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';

export const calculateOBV = (data: KlineData[]) => {
  const obvValues: number[] = [0];
  
  for (let i = 1; i < data.length; i++) {
    const currentClose = parseFloat(data[i].close);
    const previousClose = parseFloat(data[i - 1].close);
    const currentVolume = parseFloat(data[i].volume);
    
    if (currentClose > previousClose) {
      obvValues.push(obvValues[i - 1] + currentVolume);
    } else if (currentClose < previousClose) {
      obvValues.push(obvValues[i - 1] - currentVolume);
    } else {
      obvValues.push(obvValues[i - 1]);
    }
  }
  
  const range = calculateRange(obvValues);
  return {
    current: obvValues[obvValues.length - 1] || 0,
    ...range
  };
};