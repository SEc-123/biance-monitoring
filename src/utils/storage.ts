const STORAGE_KEY = 'binance-monitor-settings';

export const defaultSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

export const getStoredSymbols = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSymbols;
    }
    const settings = JSON.parse(stored);
    return settings.symbols
      .sort((a, b) => a.order - b.order)
      .map(s => s.symbol);
  } catch (error) {
    console.error('Error reading stored symbols:', error);
    return defaultSymbols;
  }
};

export const saveSymbols = (symbols: string[]) => {
  try {
    const settings = {
      symbols: symbols.map((symbol, index) => ({
        symbol,
        favorite: true,
        order: index
      })),
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving symbols:', error);
  }
};