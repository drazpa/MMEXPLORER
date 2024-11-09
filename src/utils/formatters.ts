export const formatUSDPrice = (price: number): string => {
  if (!price || isNaN(price)) return '$0.00';
  
  // Handle very small numbers with scientific notation
  if (price < 0.000001) return '$' + price.toExponential(4);
  if (price < 0.001) return '$' + price.toFixed(6);
  if (price < 1) return '$' + price.toFixed(4);
  if (price < 10) return '$' + price.toFixed(3);
  if (price < 100) return '$' + price.toFixed(2);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(price);
};

export const formatXRPPrice = (price: number): string => {
  if (!price || isNaN(price)) return '0.00';
  
  if (price < 0.000001) return price.toExponential(4);
  if (price < 0.001) return price.toFixed(6);
  if (price < 0.01) return price.toFixed(5);
  if (price < 0.1) return price.toFixed(4);
  if (price < 1) return price.toFixed(4);
  if (price < 10) return price.toFixed(3);
  
  return price.toFixed(2);
};

export const formatNumber = (value: number, decimals = 2): string => {
  if (!value || isNaN(value)) return '0';

  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  if (value >= trillion) {
    return (value / trillion).toFixed(decimals) + 'T';
  }
  if (value >= billion) {
    return (value / billion).toFixed(decimals) + 'B';
  }
  if (value >= million) {
    return (value / million).toFixed(decimals) + 'M';
  }
  if (value >= thousand) {
    return (value / thousand).toFixed(decimals) + 'K';
  }

  return value.toFixed(decimals);
};

export const formatPercentage = (value: number): string => {
  if (!value || isNaN(value)) return '0.00%';
  const formattedValue = value.toFixed(2);
  return `${value >= 0 ? '+' : ''}${formattedValue}%`;
};