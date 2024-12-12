import { KlineData } from '../types/binance';

const calculateRange = (data: number[]): { min: number; max: number; average: number } => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const average = data.reduce((a, b) => a + b, 0) / data.length;
  return { min, max, average };
};

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
    current: rsiValues[rsiValues.length - 1],
    min: range.min,
    max: range.max,
    average: range.average
  };
};

export const calculateStochRSI = (data: KlineData[], period: number = 14) => {
  const rsiValues = calculateRSI(data, period);
  const stochK: number[] = [];
  const stochD: number[] = [];

  const periodRSI = Array.isArray(rsiValues) ? rsiValues : [rsiValues.current];
  
  for (let i = period; i < periodRSI.length; i++) {
    const periodSlice = periodRSI.slice(i - period, i);
    const highRSI = Math.max(...periodSlice);
    const lowRSI = Math.min(...periodSlice);
    const k = ((periodRSI[i] - lowRSI) / (highRSI - lowRSI)) * 100;
    stochK.push(k);
  }

  // Calculate %D (3-period SMA of %K)
  for (let i = 2; i < stochK.length; i++) {
    const d = (stochK[i] + stochK[i - 1] + stochK[i - 2]) / 3;
    stochD.push(d);
  }

  const kRange = calculateRange(stochK);
  const dRange = calculateRange(stochD);

  return {
    k: {
      current: stochK[stochK.length - 1],
      ...kRange
    },
    d: {
      current: stochD[stochD.length - 1],
      ...dRange
    }
  };
};

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
    k: {
      current: k[k.length - 1],
      ...kRange
    },
    d: {
      current: d[d.length - 1],
      ...dRange
    },
    j: {
      current: j[j.length - 1],
      ...jRange
    }
  };
};

export const calculateMACD = (data: KlineData[]) => {
  const closes = data.map(d => parseFloat(d.close));
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);
  
  const macdRange = calculateRange(macdLine);
  const signalRange = calculateRange(signalLine);
  const histogramRange = calculateRange(histogram);

  return {
    macd: {
      current: macdLine[macdLine.length - 1],
      ...macdRange
    },
    signal: {
      current: signalLine[signalLine.length - 1],
      ...signalRange
    },
    histogram: {
      current: histogram[histogram.length - 1],
      ...histogramRange
    }
  };
};

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
    current: obvValues[obvValues.length - 1],
    ...range
  };
};

export const calculateVolume = (data: KlineData[], period: number = 20) => {
  const volumes = data.map(d => parseFloat(d.volume));
  const closes = data.map(d => parseFloat(d.close));
  const average = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  
  const trend = closes[closes.length - 1] > closes[closes.length - 2] ? 'up' : 'down';
  
  const range = calculateRange(volumes);
  
  return {
    current: volumes[volumes.length - 1],
    average,
    trend,
    range: {
      current: volumes[volumes.length - 1],
      ...range
    }
  };
};

export const calculateMA = (data: KlineData[], period: number): number[] => {
  const closes = data.map(d => parseFloat(d.close));
  const ma: number[] = [];
  
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  
  return ma;
};

const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const ema = [data[0]];
  
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  
  return ema;
};