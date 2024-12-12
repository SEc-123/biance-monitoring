export const calculateRange = (data: number[]): { min: number; max: number; average: number } => {
  if (!data || data.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }
  
  const validData = data.filter(n => !isNaN(n) && n !== null && isFinite(n));
  if (validData.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }

  const min = Math.min(...validData);
  const max = Math.max(...validData);
  const average = validData.reduce((a, b) => a + b, 0) / validData.length;
  
  return {
    min: Number.isFinite(min) ? Number(min.toFixed(8)) : 0,
    max: Number.isFinite(max) ? Number(max.toFixed(8)) : 0,
    average: Number.isFinite(average) ? Number(average.toFixed(8)) : 0
  };
};