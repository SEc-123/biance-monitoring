import { formatDate } from '../date';
import { IndicatorValue } from '../indicators/types';

export const formatIndicatorValue = (values: IndicatorValue[] | undefined, index: number): string => {
  if (!values || !values[index]) return '';
  return values[index].value.toFixed(8);
};

export const formatMAValue = (values: number[] | undefined, index: number): string => {
  if (!values || !values[index]) return '';
  return values[index].toFixed(8);
};

export const formatTimestamp = (timestamp: number): string => {
  return formatDate(new Date(timestamp));
};