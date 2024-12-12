import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';

export const calculateStochRSI = (data: KlineData[], period: number = 14) => {
  if (data.length < period * 2) {
    return {
      k: { current: 0, min: 0, max: 0, average: 0 },
      d: { current: 0, min: 0, max: 0, average: 0 }
    };
  }

  // Calculate RSI first
  const closes = data.map(d => parseFloat(d.close));
  const changes = closes.slice(1).map((price, i) => price - closes[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  // Calculate RSI values
  const rsiPeriod = 14;
  const rsiValues: number[] = [];
  let avgGain = gains.slice(0, rsiPeriod).reduce((a, b) => a + b, 0) / rsiPeriod;
  let avgLoss = losses.slice(0, rsiPeriod).reduce((a, b) => a + b, 0) / rsiPeriod;

  // First RSI value
  rsiValues.push(100 - (100 / (1 + avgGain / (avgLoss || 1))));

  // Calculate subsequent RSI values
  for (let i = rsiPeriod; i < changes.length; i++) {
    avgGain = ((avgGain * (rsiPeriod - 1)) + gains[i]) / rsiPeriod;
    avgLoss = ((avgLoss * (rsiPeriod - 1)) + losses[i]) / rsiPeriod;
    const rsi = 100 - (100 / (1 + avgGain / (avgLoss || 1)));
    rsiValues.push(rsi);
  }

  // Calculate Stochastic RSI
  const stochK: number[] = [];
  const stochD: number[] = [];

  for (let i = period - 1; i < rsiValues.length; i++) {
    const windowRSI = rsiValues.slice(i - period + 1, i + 1);
    const highestRSI = Math.max(...windowRSI);
    const lowestRSI = Math.min(...windowRSI);
    const stoch = ((rsiValues[i] - lowestRSI) / ((highestRSI - lowestRSI) || 1)) * 100;
    stochK.push(stoch);

    // Calculate %D (3-period SMA of %K)
    if (stochK.length >= 3) {
      const d = stochK.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
      stochD.push(d);
    }
  }

  // Calculate ranges for valid values only
  const validK = stochK.filter(k => !isNaN(k) && isFinite(k));
  const validD = stochD.filter(d => !isNaN(d) && isFinite(d));

  const kRange = calculateRange(validK);
  const dRange = calculateRange(validD);

  return {
    k: {
      current: validK[validK.length - 1] || 0,
      min: kRange.min,
      max: kRange.max,
      average: kRange.average
    },
    d: {
      current: validD[validD.length - 1] || 0,
      min: dRange.min,
      max: dRange.max,
      average: dRange.average
    }
  };
};