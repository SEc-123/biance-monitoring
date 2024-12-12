import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';

export const calculateRSI = (data: KlineData[], periods: number = 14) => {
  const closes = data.map(d => parseFloat(d.close));
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < closes.length; i++) {
    const difference = closes[i] - closes[i - 1];
    gains.push(Math.max(difference, 0));
    losses.push(Math.max(-difference, 0));
  }
  
  const rsiValues: number[] = [];
  let avgGain = gains.slice(0, periods).reduce((a, b) => a + b, 0) / periods;
  let avgLoss = losses.slice(0, periods).reduce((a, b) => a + b, 0) / periods;
  
  for (let i = periods; i < closes.length; i++) {
    const rs = avgGain / avgLoss;
    rsiValues.push(100 - (100 / (1 + rs)));
    
    avgGain = ((avgGain * (periods - 1)) + gains[i]) / periods;
    avgLoss = ((avgLoss * (periods - 1)) + losses[i]) / periods;
  }
  
  const range = calculateRange(rsiValues);
  return {
    current: rsiValues[rsiValues.length - 1] || 0,
    ...range
  };
};