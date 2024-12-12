import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface PriceDisplayProps {
  symbol: string;
  spotPrice: string;
  futuresPrice: string;
  previousSpotPrice: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  symbol,
  spotPrice,
  futuresPrice,
  previousSpotPrice,
}) => {
  const priceChange = parseFloat(spotPrice) - parseFloat(previousSpotPrice);
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{symbol}</h2>
        {isPositive ? (
          <ArrowUpCircle className="w-6 h-6 text-green-500" />
        ) : (
          <ArrowDownCircle className="w-6 h-6 text-red-500" />
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Spot Price</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ${parseFloat(spotPrice).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Futures Price</p>
          <p className="text-2xl font-bold">${parseFloat(futuresPrice).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};