import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatusHistory } from '../types';

interface UptimeHistoryProps {
  serverId: string;
}

export default function UptimeHistory({ serverId }: UptimeHistoryProps) {
  const [history, setHistory] = useState<StatusHistory[]>([]); // Array of status history
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      // Get last 90 days history
      const data = await api.getServerHistory(serverId, 90);
      setHistory(data);
      setLoading(false);
    }
    fetchHistory();
  }, [serverId]);

  if (loading) return <div className="h-8 flex items-center"><span className="text-gray-300">Loading...</span></div>;
  if (!history.length) {
    // Chart dummy abu-abu jika tidak ada data
    return (
      <div className="w-full bg-gray-50 border rounded-lg px-4 py-3">
        <div className="flex items-center h-8 overflow-x-auto">
          {Array.from({ length: 90 }).map((_, idx) => (
            <div
              key={idx}
              className="w-1.5 h-5 mx-0.5 rounded bg-gray-200"
              style={{ opacity: 0.5 }}
            />
          ))}
        </div>
        <div className="text-center text-xs text-gray-400 mt-1">No data</div>
      </div>
    );
  }

  // Map status to color & label, support performa issue
  const statusColor = (status: string, responseTime?: number) => {
    if (status === 'operational' && responseTime && responseTime > 1000) return '#fde047'; // lambat jadi kuning
    if (status === 'operational') return '#10b981';
  if (status === 'performaissue') return '#fde047';
    if (status === 'down') return '#ef4444';
    return '#3b82f6'; // biru untuk maintanance
  };

  const statusLabel = (status: string, responseTime?: number) => {
  if ((status === 'operational' && responseTime && responseTime > 1000) || status === 'performaissue') return 'Performa Issue';
    if (status === 'maintanance') return 'Maintenance';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full bg-gray-50 border rounded-lg px-4 py-3">
      <div className="flex items-center h-8 overflow-x-auto">
        {history.map((h, idx) => {
          const color = statusColor(h.status, h.responseTime);
          const label = statusLabel(h.status, h.responseTime);
          return (
            <div
              key={h._id || idx}
              className="w-1.5 h-5 mx-0.5 rounded transition-all duration-150 hover:scale-125 hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: color, opacity: 0.9 }}
              title={`${formatDate(h.timestamp)}\n${label}`}
            />
          );
        })}
      </div>
    </div>
  );
}
