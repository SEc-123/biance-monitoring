import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Star, StarOff } from 'lucide-react';
import { searchSymbols } from '../api/binanceApi';
import { SearchResult, SavedSymbol } from '../types/binance';
import { useDebounce } from '../hooks/useDebounce';

interface SymbolManagerProps {
  symbols: string[];
  onSymbolsChange: (symbols: string[]) => void;
}

export const SymbolManager: React.FC<SymbolManagerProps> = ({
  symbols,
  onSymbolsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchSymbols(debouncedSearch);
        setSearchResults(results);
        setError('');
      } catch (err) {
        setError('Failed to search symbols');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleAddSymbol = (symbol: string) => {
    if (symbols.includes(symbol)) {
      setError('Symbol already exists');
      return;
    }

    onSymbolsChange([...symbols, symbol]);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    onSymbolsChange(symbols.filter(s => s !== symbolToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Manage Symbols</h2>
      
      <div className="relative mb-6">
        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError('');
            }}
            placeholder="Search symbols (e.g. BTC or BTCUSDT)"
            className="flex-1 px-3 py-2 focus:outline-none"
          />
        </div>

        {loading && (
          <div className="absolute w-full bg-white rounded-md shadow-lg mt-1 p-2 text-gray-500">
            Searching...
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="absolute w-full bg-white rounded-md shadow-lg mt-1 z-10">
            {searchResults.map((result) => (
              <div
                key={result.symbol}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAddSymbol(result.symbol)}
              >
                <div>
                  <div className="font-medium">{result.symbol}</div>
                  <div className="text-sm text-gray-500">
                    {result.baseAsset}/{result.quoteAsset}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${parseFloat(result.price).toFixed(2)}</div>
                  <button className="text-blue-500 text-sm hover:text-blue-600">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => (
          <div
            key={symbol}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md"
          >
            <span>{symbol}</span>
            <button
              onClick={() => handleRemoveSymbol(symbol)}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};