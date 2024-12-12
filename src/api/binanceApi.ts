import axios from 'axios';
import { PriceData, KlineData, Timeframe, SearchResult } from '../types/binance';
import { 
  calculateRSI,
  calculateStochRSI,
  calculateKDJ,
  calculateMACD,
  calculateOBV,
  calculateVolume,
  calculateMA
} from '../utils/indicators';

const SPOT_API = 'https://api.binance.com/api/v3';
const FUTURES_API = 'https://fapi.binance.com/fapi/v1';

export const getSpotPrice = async (symbol: string): Promise<PriceData> => {
  const response = await axios.get(`${SPOT_API}/ticker/price?symbol=${symbol}`);
  return response.data;
};

export const getFuturesPrice = async (symbol: string): Promise<PriceData> => {
  const response = await axios.get(`${FUTURES_API}/ticker/price?symbol=${symbol}`);
  return response.data;
};

export const getKlines = async (
  symbol: string,
  timeframe: Timeframe
): Promise<{ klines: KlineData[]; indicators: any }> => {
  const binanceIntervals: { [key in Timeframe]: string } = {
    '30m': '30m',
    '1h': '1h',
    '2h': '2h',
    '4h': '4h',
    '8h': '8h',
    '12h': '12h',
    '1d': '1d',
    '1w': '1w',
    '1M': '1M'
  };

  const limits: { [key in Timeframe]: number } = {
    '30m': 500,
    '1h': 500,
    '2h': 500,
    '4h': 500,
    '8h': 500,
    '12h': 500,
    '1d': 500,
    '1w': 200,
    '1M': 100
  };

  const response = await axios.get(
    `${SPOT_API}/klines?symbol=${symbol}&interval=${binanceIntervals[timeframe]}&limit=${limits[timeframe]}`
  );
  
  const klines = response.data.map((kline: any[]) => ({
    openTime: kline[0],
    open: kline[1],
    high: kline[2],
    low: kline[3],
    close: kline[4],
    volume: kline[5],
    closeTime: kline[6],
  }));

  // Calculate indicators
  const indicators = {
    rsi: calculateRSI(klines),
    stochRSI: calculateStochRSI(klines),
    kdj: calculateKDJ(klines),
    macd: calculateMACD(klines),
    obv: calculateOBV(klines),
    volume: calculateVolume(klines),
    ma: {
      ma5: calculateMA(klines, 5)[0],
      ma10: calculateMA(klines, 10)[0],
      ma20: calculateMA(klines, 20)[0],
      ma30: calculateMA(klines, 30)[0],
      ma50: calculateMA(klines, 50)[0],
      ma100: calculateMA(klines, 100)[0],
      ma200: calculateMA(klines, 200)[0],
    }
  };

  return { klines, indicators };
};

export const searchSymbols = async (query: string): Promise<SearchResult[]> => {
  try {
    const [exchangeInfo, prices] = await Promise.all([
      axios.get(`${SPOT_API}/exchangeInfo`),
      axios.get(`${SPOT_API}/ticker/price`)
    ]);

    const symbols = exchangeInfo.data.symbols
      .filter((s: any) => 
        s.quoteAsset === 'USDT' && 
        s.status === 'TRADING' &&
        (s.symbol.toLowerCase().includes(query.toLowerCase()) ||
         s.baseAsset.toLowerCase().includes(query.toLowerCase()))
      )
      .map((s: any) => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        price: prices.data.find((p: any) => p.symbol === s.symbol)?.price || '0'
      }))
      .sort((a: SearchResult, b: SearchResult) => 
        parseFloat(b.price) - parseFloat(a.price)
      );

    return symbols.slice(0, 10);
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
};