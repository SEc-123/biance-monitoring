import { KlineData } from '../../types/binance';

export interface IndicatorValue {
  value: number;
  timestamp: number;
}

export interface IndicatorResult {
  values: IndicatorValue[];
  current: number;
  min: number;
  max: number;
  average: number;
}

export interface MAResult {
  ma5: number[];
  ma10: number[];
  ma20: number[];
  ma30: number[];
  ma50: number[];
  ma100: number[];
  ma200: number[];
}

export interface AllIndicators {
  rsi: IndicatorResult;
  kdj: {
    k: IndicatorResult;
    d: IndicatorResult;
    j: IndicatorResult;
  };
  macd: {
    macd: IndicatorResult;
    signal: IndicatorResult;
    histogram: IndicatorResult;
  };
  volume: {
    current: number;
    average: number;
    trend: 'up' | 'down';
    values: IndicatorValue[];
  };
  obv: IndicatorResult;
  ma: MAResult;
}