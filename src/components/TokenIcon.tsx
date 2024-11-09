import React from 'react';
import { CircleDollarSign } from 'lucide-react';

interface TokenIconProps {
  currency: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const iconSizeMap = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6'
};

export const TokenIcon: React.FC<TokenIconProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClass = sizeMap[size];
  const iconSize = iconSizeMap[size];

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden token-icon-glow bg-blue-100 dark:bg-blue-900 flex items-center justify-center ${className}`}>
      <CircleDollarSign className={`${iconSize} text-blue-600 dark:text-blue-400`} />
    </div>
  );
};