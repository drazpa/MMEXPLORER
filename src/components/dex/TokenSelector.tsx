import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: any) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Mock popular tokens
  const popularTokens = [
    { symbol: 'XRP', name: 'XRP', issuer: '' },
    { symbol: 'SOLO', name: 'Sologenic', issuer: 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz' },
    { symbol: 'CSC', name: 'CasinoCoin', issuer: 'rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr' },
    { symbol: 'CORE', name: 'Coreum', issuer: 'rH438jEAzTs5PYtV6CHZqpDpwyCjJ2Uhhh' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Select Token
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by token name or paste address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Tokens
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {popularTokens.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => onSelect(token)}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {token.symbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {popularTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => onSelect(token)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {token.symbol}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {token.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};