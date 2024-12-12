import { KlineData } from '../../types/binance';
import { calculateRange } from './utils';
import { calculateEMA } from './ema';

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
    macd: { current: macdLine[macdLine.length - 1] || 0, ...macdRange },
    signal: { current: signalLine[signalLine.length - 1] || 0, ...signalRange },
    histogram: { current: histogram[histogram.length - 1] || 0, ...histogramRange }
  };
};