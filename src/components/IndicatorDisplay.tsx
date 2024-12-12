import React from 'react';
import { TimeframeData, Timeframe } from '../types/binance';
import { TimeframeSelector } from './indicators/TimeframeSelector';
import { IndicatorSection } from './indicators/IndicatorSection';

interface IndicatorDisplayProps {
  timeframeData: TimeframeData;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

export const IndicatorDisplay: React.FC<IndicatorDisplayProps> = ({
  timeframeData,
  selectedTimeframe,
  onTimeframeChange,
}) => {
  const currentData = timeframeData[selectedTimeframe];
  
  if (!currentData) {
    return <div>Loading indicators...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={onTimeframeChange}
      />

      <div className="indicators-container space-y-6">
        {/* RSI Section */}
        <IndicatorSection
          title="RSI (14)"
          data={currentData.rsi}
          formatValue={(value) => value.toFixed(2)}
          description={
            currentData.rsi?.current >= 70 
              ? 'Overbought'
              : currentData.rsi?.current <= 30 
                ? 'Oversold' 
                : 'Neutral'
          }
        />

        {/* Moving Averages */}
        <IndicatorSection
          title="Moving Averages"
          data={currentData.ma}
          type="ma"
        />

        {/* KDJ */}
        <IndicatorSection
          title="KDJ"
          data={{
            k: currentData.kdj?.k,
            d: currentData.kdj?.d,
            j: currentData.kdj?.j
          }}
          type="kdj"
        />

        {/* MACD */}
        <IndicatorSection
          title="MACD"
          data={{
            macd: currentData.macd?.macd,
            signal: currentData.macd?.signal,
            histogram: currentData.macd?.histogram
          }}
          type="macd"
        />

        {/* Volume */}
        <IndicatorSection
          title="Volume"
          data={currentData.volume}
          type="volume"
        />

        {/* OBV */}
        <IndicatorSection
          title="On-Balance Volume"
          data={currentData.obv}
          formatValue={(value) => value.toFixed(2)}
        />
      </div>
    </div>
  );
};