import React from 'react';
import { Timeframe } from '../../types/binance';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const timeframes: Timeframe[] = ['30m', '1h', '2h', '4h', '8h', '12h', '1d', '1w', '1M'];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
}) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold mb-4">Technical Indicators</h2>
    <div className="flex flex-wrap gap-2">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => onTimeframeChange(tf)}
          className={`px-3 py-1 rounded-md ${
            selectedTimeframe === tf
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  </div>
);