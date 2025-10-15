import { useEffect, useState } from 'react';
import HistoryContent from './HistoryContent';
import ReportPage from '../pages/ReportPage';
import { api } from '../services/api';
import { Server } from '../types';
import { RefreshCw } from 'lucide-react';

export default function StatusPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('just now');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const serverData = await api.getAllServers();
      setServers(serverData);
      setLastUpdated('just now');
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch only
    fetchData();
  }, []);

  // Update "just now" display every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated('just now');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 relative min-h-16 sm:min-h-24">
        <div className="px-4 sm:px-6 py-4 sm:py-8 sm:py-10">
          <div className="absolute top-4 sm:top-6 sm:top-10 left-4 sm:left-6">
            <h1 className="text-lg sm:text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                NGTC
              </span>
              <span className="text-slate-600 ml-2">| Status Server</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 sm:py-16">
        {/* System Status Overview */}
        <div className="mb-6 sm:mb-8 sm:mb-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-emerald-50/80 border border-emerald-200/60 rounded-2xl px-3 sm:px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="relative flex-shrink-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-emerald-800 font-semibold text-sm sm:text-base sm:text-lg">All Systems Operational</div>
              <div className="text-emerald-600 text-xs sm:text-sm">Last updated: just now</div>
            </div>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-1 sm:p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 sm:gap-8 sm:gap-12">
          {/* Server Status History */}
          <section>
            <div className="mb-3 sm:mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl sm:text-2xl font-bold text-slate-800 mb-2">Server Status History</h2>
              <p className="text-slate-600 text-sm sm:text-base">Monitor server performance and uptime over the past 90 days</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/40 p-3 sm:p-6 sm:p-10 hover:shadow-xl transition-all duration-500 hover:bg-white/90">
              <HistoryContent servers={servers} showTitle={false} />
            </div>
          </section>

          {/* Incident Reports */}
          <section>
            <div className="mb-3 sm:mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl sm:text-2xl font-bold text-slate-800 mb-2">Incident Reports</h2>
              <p className="text-slate-600 text-sm sm:text-base">Track and manage system incidents and maintenance activities</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/40 p-3 sm:p-6 sm:p-10 hover:shadow-xl transition-all duration-500 hover:bg-white/90">
              <ReportPage showAddButton={false} showTitle={false} showActionButtons={false} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
