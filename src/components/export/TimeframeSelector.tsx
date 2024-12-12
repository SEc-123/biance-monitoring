import React from 'react';
import { Timeframe } from '../../types/binance';

interface TimeframeSelectorProps {
  selectedTimeframes: Timeframe[];
  onChange: (timeframes: Timeframe[]) => void;
  currentTimeframe: Timeframe;
}

const timeframes: Timeframe[] = ['30m', '1h', '2h', '4h', '8h', '12h', '1d', '1w', '1M'];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframes,
  onChange,
  currentTimeframe,
}) => {
  const handleToggle = (tf: Timeframe) => {
    if (selectedTimeframes.includes(tf)) {
      onChange(selectedTimeframes.filter(t => t !== tf));
    } else {
      onChange([...selectedTimeframes, tf]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-2">Select timeframes to export:</p>
      <div className="flex flex-wrap gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => handleToggle(tf)}
            className={`px-3 py-1 rounded-md text-sm transition-colors
              ${selectedTimeframes.includes(tf)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
              ${tf === currentTimeframe ? 'ring-2 ring-blue-300' : ''}
            `}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};