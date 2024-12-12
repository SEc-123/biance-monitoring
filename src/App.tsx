import { useState, useEffect } from 'react';
import { getSpotPrice, getFuturesPrice, getKlines } from './api/binanceApi';
import { PriceDisplay } from './components/PriceDisplay';
import { TechnicalChart } from './components/TechnicalChart';
import { IndicatorDisplay } from './components/IndicatorDisplay';
import { SymbolManager } from './components/SymbolManager';
import { ExportData } from './components/ExportData';
import { Coins, Settings } from 'lucide-react';
import { TimeframeData, Timeframe, KlineData } from './types/binance';
import { getStoredSymbols, saveSymbols } from './utils/storage';
import { usePriceUpdates } from './hooks/usePriceUpdates';
import { useKlineData } from './hooks/useKlineData';

const App = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [symbols, setSymbols] = useState<string[]>(getStoredSymbols());
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbols[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('4h');

  const { prices } = usePriceUpdates(symbols);
  const { timeframeData, klineData } = useKlineData(selectedSymbol, selectedTimeframe);

  const handleSymbolsChange = (newSymbols: string[]) => {
    setSymbols(newSymbols);
    saveSymbols(newSymbols);
    if (!newSymbols.includes(selectedSymbol)) {
      setSelectedSymbol(newSymbols[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Binance Monitor</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-blue-500"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showSettings && (
          <SymbolManager
            symbols={symbols}
            onSymbolsChange={handleSymbolsChange}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {symbols.map((symbol) => (
            prices[symbol] && (
              <div 
                key={symbol} 
                onClick={() => setSelectedSymbol(symbol)} 
                className={`cursor-pointer ${selectedSymbol === symbol ? 'ring-2 ring-blue-500' : ''}`}
              >
                <PriceDisplay
                  symbol={symbol}
                  spotPrice={prices[symbol].spot}
                  futuresPrice={prices[symbol].futures}
                  previousSpotPrice={prices[symbol].previous}
                />
              </div>
            )
          ))}
        </div>

        {selectedSymbol && timeframeData[selectedSymbol] && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Indicators */}
            <div className="lg:col-span-5 space-y-6">
              <IndicatorDisplay
                timeframeData={timeframeData[selectedSymbol]}
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
              />
              <ExportData
                symbol={selectedSymbol}
                timeframe={selectedTimeframe}
                klineData={klineData[selectedTimeframe] || []}
                indicators={timeframeData[selectedSymbol][selectedTimeframe]}
              />
            </div>
            
            {/* Right Column - Chart */}
            <div className="lg:col-span-7 lg:sticky lg:top-6">
              <TechnicalChart
                data={klineData[selectedTimeframe] || []}
                symbol={selectedSymbol}
                timeframe={selectedTimeframe}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;