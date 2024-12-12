import React from 'react';
import { IndicatorRange } from '../../types/binance';

interface RangeDisplayProps {
  label: string;
  range?: IndicatorRange;
  unit?: string;
}

export const RangeDisplay: React.FC<RangeDisplayProps> = ({
  label,
  range,
  unit = ''
}) => {
  if (!range || !Number.isFinite(range.current)) {
    return (
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        <p className="text-sm text-gray-400">Calculating...</p>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (!Number.isFinite(value)) return 'N/A';
    return value.toFixed(2);
  };

  return (
    <div className="mb-2">
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Current:</span>
          <span className="ml-2 font-mono">{formatValue(range.current)}{unit}</span>
        </div>
        <div>
          <span className="text-gray-600">Avg:</span>
          <span className="ml-2 font-mono">{formatValue(range.average)}{unit}</span>
        </div>
        <div>
          <span className="text-gray-600">Min:</span>
          <span className="ml-2 font-mono">{formatValue(range.min)}{unit}</span>
        </div>
        <div>
          <span className="text-gray-600">Max:</span>
          <span className="ml-2 font-mono">{formatValue(range.max)}{unit}</span>
        </div>
      </div>
    </div>
  );
};