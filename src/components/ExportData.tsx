import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Timeframe } from '../types/binance';
import { captureTimeframes } from '../utils/export/screenshot';
import { TimeframeSelector } from './export/TimeframeSelector';

interface ExportDataProps {
  symbol: string;
  timeframe: Timeframe;
  indicators: any;
}

export const ExportData: React.FC<ExportDataProps> = ({
  symbol,
  timeframe,
  indicators,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTimeframes, setSelectedTimeframes] = useState<Timeframe[]>([timeframe]);

  const handleExport = async () => {
    if (selectedTimeframes.length === 0) {
      alert('Please select at least one timeframe');
      return;
    }

    setIsExporting(true);
    try {
      await captureTimeframes(symbol, selectedTimeframes);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export screenshots. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Export Technical Indicators</h3>
      
      <TimeframeSelector
        selectedTimeframes={selectedTimeframes}
        onChange={setSelectedTimeframes}
        currentTimeframe={timeframe}
      />

      <button
        onClick={handleExport}
        disabled={isExporting || selectedTimeframes.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors mt-4
          ${isExporting || selectedTimeframes.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        <Camera size={16} />
        {isExporting ? 'Capturing...' : 'Export Screenshots'}
      </button>
    </div>
  );
};