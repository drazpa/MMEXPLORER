import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="relative inline-block">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <div className="absolute inset-0 shimmer rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full animate-pulse"></div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 animate-pulse">
        Loading data...
      </h3>
    </div>
  );
};