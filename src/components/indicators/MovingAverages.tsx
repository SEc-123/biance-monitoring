import React from 'react';

interface MovingAveragesProps {
  ma: {
    ma5?: number;
    ma10?: number;
    ma20?: number;
    ma30?: number;
    ma50?: number;
    ma100?: number;
    ma200?: number;
  };
}

export const MovingAverages: React.FC<MovingAveragesProps> = ({ ma }) => {
  const formatMA = (value?: number) => {
    return typeof value === 'number' ? `$${value.toFixed(2)}` : 'N/A';
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Moving Averages</h3>
      <div className="space-y-1 text-sm">
        <p>MA5: <span className="font-mono">{formatMA(ma.ma5)}</span></p>
        <p>MA10: <span className="font-mono">{formatMA(ma.ma10)}</span></p>
        <p>MA20: <span className="font-mono">{formatMA(ma.ma20)}</span></p>
        <p>MA50: <span className="font-mono">{formatMA(ma.ma50)}</span></p>
        <p>MA100: <span className="font-mono">{formatMA(ma.ma100)}</span></p>
        <p>MA200: <span className="font-mono">{formatMA(ma.ma200)}</span></p>
      </div>
    </div>
  );
};