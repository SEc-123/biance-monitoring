// Add to existing types
export interface IndicatorRange {
  current: number;
  min: number;
  max: number;
  average: number;
}

export interface SavedSymbol {
  symbol: string;
  favorite: boolean;
  order: number;
}

export interface SymbolSettings {
  symbols: SavedSymbol[];
  lastUpdated: number;
}

export interface SearchResult {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
}