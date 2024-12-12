import React from 'react';
import { IndicatorRange } from '../../types/binance';
import { formatValue } from '../../utils/formatters';

interface IndicatorSectionProps {
  title: string;
  data: any;
  type?: 'ma' | 'kdj' | 'macd' | 'volume';
  formatValue?: (value: number) => string;
  description?: string;
}

export const IndicatorSection: React.FC<IndicatorSectionProps> = ({
  title,
  data,
  type,
  formatValue: customFormat,
  description,
}) => {
  const renderValue = (value: number) => {
    if (customFormat) return customFormat(value);
    return formatValue(value);
  };

  const renderRange = (range: IndicatorRange) => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <span className="text-gray-600">Current:</span>
        <span className="ml-2 font-mono">{renderValue(range.current)}</span>
      </div>
      <div>
        <span className="text-gray-600">Avg:</span>
        <span className="ml-2 font-mono">{renderValue(range.average)}</span>
      </div>
      <div>
        <span className="text-gray-600">Min:</span>
        <span className="ml-2 font-mono">{renderValue(range.min)}</span>
      </div>
      <div>
        <span className="text-gray-600">Max:</span>
        <span className="ml-2 font-mono">{renderValue(range.max)}</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'ma':
        return (
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key.toUpperCase()}:</span>
                <span className="font-mono">{renderValue(value as number)}</span>
              </div>
            ))}
          </div>
        );

      case 'kdj':
        return (
          <div className="space-y-4">
            {['k', 'd', 'j'].map((line) => (
              <div key={line}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {line.toUpperCase()} Line
                </h4>
                {renderRange(data[line])}
              </div>
            ))}
          </div>
        );

      case 'macd':
        return (
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {key === 'macd' ? 'MACD Line' : 
                   key === 'signal' ? 'Signal Line' : 'Histogram'}
                </h4>
                {renderRange(value as IndicatorRange)}
              </div>
            ))}
          </div>
        );

      case 'volume':
        return (
          <div className="space-y-2">
            {renderRange(data.range)}
            <div className={`text-sm ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              Trend: {data.trend}
            </div>
          </div>
        );

      default:
        return renderRange(data);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      {renderContent()}
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
};