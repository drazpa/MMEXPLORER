import React from 'react';
import { useServerInfo } from '../hooks/useServerInfo';
import { 
  Activity, Server, Database, Clock, 
  TrendingUp, BarChart2, CircleDollarSign,
  Users, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { formatNumber, formatUSDPrice } from '../utils/formatters';

export const XRPLStats: React.FC = () => {
  const { serverInfo, loading, error } = useServerInfo();

  // Mock data (replace with real API data)
  const stats = {
    price: 0.68,
    priceChange24h: 2.5,
    marketCap: 36789543210,
    volume24h: 1234567890,
    totalAccounts: 4567890,
    totalTrustlines: 789012,
    transactionsToday: 234567,
    averageFee: 0.000012,
    tps: 12.5,
    validatorCount: 150,
    reserveBase: 10,
    reserveInc: 2
  };

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${
              change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">XRPL Network Statistics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time statistics and metrics for the XRP Ledger
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="XRP Price"
          value={formatUSDPrice(stats.price)}
          icon={CircleDollarSign}
          change={stats.priceChange24h}
        />
        <StatCard
          title="Market Cap"
          value={`$${formatNumber(stats.marketCap)}`}
          icon={TrendingUp}
        />
        <StatCard
          title="24h Volume"
          value={`$${formatNumber(stats.volume24h)}`}
          icon={BarChart2}
        />
        <StatCard
          title="Total Accounts"
          value={formatNumber(stats.totalAccounts)}
          icon={Users}
        />
        <StatCard
          title="Transactions (24h)"
          value={formatNumber(stats.transactionsToday)}
          icon={Activity}
        />
        <StatCard
          title="Average TPS"
          value={stats.tps.toFixed(1)}
          icon={Activity}
        />
        <StatCard
          title="Active Validators"
          value={stats.validatorCount}
          icon={Server}
        />
        <StatCard
          title="Total Trustlines"
          value={formatNumber(stats.totalTrustlines)}
          icon={Database}
        />
        <StatCard
          title="Average Fee"
          value={`${stats.averageFee} XRP`}
          icon={CircleDollarSign}
        />
        <StatCard
          title="Base Reserve"
          value={`${stats.reserveBase} XRP`}
          icon={Database}
        />
        <StatCard
          title="Owner Reserve"
          value={`${stats.reserveInc} XRP`}
          icon={Database}
        />
        <StatCard
          title="Current Ledger"
          value={serverInfo?.ledgerIndex?.toLocaleString() ?? 'Loading...'}
          icon={Clock}
        />
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading network stats
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};