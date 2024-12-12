export const formatValue = (value: number): string => {
  if (!Number.isFinite(value)) return 'N/A';
  
  const abs = Math.abs(value);
  if (abs >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (abs >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  if (abs < 0.000001) {
    return value.toExponential(2);
  }
  return value.toFixed(abs < 0.01 ? 6 : abs < 1 ? 4 : 2);
};