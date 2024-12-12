import { KlineData } from '../../types/binance';
import { AllIndicators } from '../indicators/types';
import { formatIndicatorValue, formatMAValue, formatTimestamp } from './formatters';

export const generateCSV = (klineData: KlineData[], indicators: AllIndicators): string => {
  const headers = [
    'Date',
    'Open',
    'High',
    'Low',
    'Close',
    'Volume',
    'RSI',
    'KDJ K',
    'KDJ D',
    'KDJ J',
    'MACD',
    'MACD Signal',
    'MACD Histogram',
    'OBV',
    'MA5',
    'MA10',
    'MA20',
    'MA30',
    'MA50',
    'MA100',
    'MA200',
    'Volume Trend'
  ];

  const rows = klineData.map((kline, index) => [
    formatTimestamp(kline.openTime),
    kline.open,
    kline.high,
    kline.low,
    kline.close,
    kline.volume,
    formatIndicatorValue(indicators.rsi.values, index),
    formatIndicatorValue(indicators.kdj.k.values, index),
    formatIndicatorValue(indicators.kdj.d.values, index),
    formatIndicatorValue(indicators.kdj.j.values, index),
    formatIndicatorValue(indicators.macd.macd.values, index),
    formatIndicatorValue(indicators.macd.signal.values, index),
    formatIndicatorValue(indicators.macd.histogram.values, index),
    formatIndicatorValue(indicators.obv.values, index),
    formatMAValue(indicators.ma.ma5, index),
    formatMAValue(indicators.ma.ma10, index),
    formatMAValue(indicators.ma.ma20, index),
    formatMAValue(indicators.ma.ma30, index),
    formatMAValue(indicators.ma.ma50, index),
    formatMAValue(indicators.ma.ma100, index),
    formatMAValue(indicators.ma.ma200, index),
    indicators.volume.trend
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
};