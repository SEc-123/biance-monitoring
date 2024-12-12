import { KlineData } from '../../types/binance';
import { AllIndicators, IndicatorValue } from './types';
import { calculateRSI } from './rsi';
import { calculateKDJ } from './kdj';
import { calculateMACD } from './macd';
import { calculateOBV } from './obv';
import { calculateVolume } from './volume';
import { calculateMA } from './ma';

export const calculateAllIndicators = (data: KlineData[]): AllIndicators => {
  const timestamps = data.map(k => k.openTime);
  
  const rsi = calculateRSI(data);
  const kdj = calculateKDJ(data);
  const macd = calculateMACD(data);
  const obv = calculateOBV(data);
  const volume = calculateVolume(data);
  const ma = calculateMA(data);

  // Add timestamps to indicator values
  const addTimestamps = (values: number[]): IndicatorValue[] => {
    return values.map((value, i) => ({
      value,
      timestamp: timestamps[i]
    }));
  };

  return {
    rsi: {
      ...rsi,
      values: addTimestamps(rsi.values)
    },
    kdj: {
      k: { ...kdj.k, values: addTimestamps(kdj.k.values) },
      d: { ...kdj.d, values: addTimestamps(kdj.d.values) },
      j: { ...kdj.j, values: addTimestamps(kdj.j.values) }
    },
    macd: {
      macd: { ...macd.macd, values: addTimestamps(macd.macd.values) },
      signal: { ...macd.signal, values: addTimestamps(macd.signal.values) },
      histogram: { ...macd.histogram, values: addTimestamps(macd.histogram.values) }
    },
    obv: {
      ...obv,
      values: addTimestamps(obv.values)
    },
    volume: {
      ...volume,
      values: addTimestamps(volume.values)
    },
    ma
  };
};