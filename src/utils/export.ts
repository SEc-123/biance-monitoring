import { KlineData } from '../types/binance';
import { formatDate } from './date';

export const generateCSV = (klineData: KlineData[], indicators: any): string => {
  // Prepare CSV headers
  const headers = [
    'Date',
    'Open',
    'High',
    'Low',
    'Close',
    'Volume',
    'RSI',
    'Stoch RSI K',
    'Stoch RSI D',
    'KDJ K',
    'KDJ D',
    'KDJ J',
    'MACD',
    'Signal',
    'Histogram',
    'OBV',
    'MA5',
    'MA10',
    'MA20',
    'MA50',
    'MA100',
    'MA200'
  ];

  // Prepare CSV rows
  const rows = klineData.map((kline, index) => {
    const date = formatDate(new Date(kline.openTime));
    return [
      date,
      kline.open,
      kline.high,
      kline.low,
      kline.close,
      kline.volume,
      indicators.rsi?.values?.[index] || '',
      indicators.stochRSI?.k?.values?.[index] || '',
      indicators.stochRSI?.d?.values?.[index] || '',
      indicators.kdj?.k?.values?.[index] || '',
      indicators.kdj?.d?.values?.[index] || '',
      indicators.kdj?.j?.values?.[index] || '',
      indicators.macd?.macd?.values?.[index] || '',
      indicators.macd?.signal?.values?.[index] || '',
      indicators.macd?.histogram?.values?.[index] || '',
      indicators.obv?.values?.[index] || '',
      indicators.ma?.ma5?.[index] || '',
      indicators.ma?.ma10?.[index] || '',
      indicators.ma?.ma20?.[index] || '',
      indicators.ma?.ma50?.[index] || '',
      indicators.ma?.ma100?.[index] || '',
      indicators.ma?.ma200?.[index] || ''
    ].join(',');
  });

  // Create and return CSV content
  return [headers.join(','), ...rows].join('\n');
};