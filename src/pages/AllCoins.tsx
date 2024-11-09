import React from 'react';
import { TokenList } from '../components/TokenList';
import { useAllTokens } from '../hooks/useAllTokens';

export const AllCoins: React.FC = () => {
  const { 
    tokens, 
    loading, 
    error, 
    refetch,
    isRefreshing,
    toggleFavorite,
    isFavorite,
    searchTerm,
    setSearchTerm,
    totalTokens,
    searchableTokens
  } = useAllTokens();

  return (
    <div className="space-y-4">
      <TokenList 
        tokens={tokens} 
        loading={loading} 
        error={error} 
        onRefresh={refetch}
        isRefreshing={isRefreshing}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {!loading && !error && tokens.length > 0 && searchTerm === '' && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing top 50 tokens by volume out of {totalTokens.toLocaleString()} total tokens.
          <br />
          Use the search to explore the top {searchableTokens.toLocaleString()} tokens by volume.
        </div>
      )}
    </div>
  );
};