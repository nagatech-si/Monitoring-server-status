import { useEffect, useState } from 'react';
import { StatusHistory, Server, Group } from '../types';
import { api } from '../services/api';

interface HistoryContentProps {
  servers: Server[];
  showTitle?: boolean;
}

export default function HistoryContent({ servers, showTitle = true }: HistoryContentProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [serverHistories, setServerHistories] = useState<Record<string, StatusHistory[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayOffset, setDayOffset] = useState(0); // 0 = today, 1 = kemarin, dst.

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        const groupData = await api.getAllGroups();
        setGroups(groupData);
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  const handleExpandGroup = async (groupId: string, groupServers: Server[]) => {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
      return;
    }
    setExpandedGroup(groupId);
    // Fetch history for all servers in this group if not already loaded
    setLoading(true);
    try {
      const histories: Record<string, StatusHistory[]> = { ...serverHistories };
      for (const server of groupServers) {
        if (!histories[server._id]) {
          const history = await api.getServerHistory(server._id, 90);
          histories[server._id] = history;
        }
      }
      setServerHistories(histories);
    } catch (err) {
      setError('Failed to load server history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        {showTitle && <h1 className="text-2xl font-bold text-gray-900">History Status Server</h1>}
        {/* Status legend for user */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white rounded-xl shadow p-3 mt-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-xs sm:text-sm text-gray-700">Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
            <span className="text-xs sm:text-sm text-gray-700">Performa Issue</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            <span className="text-xs sm:text-sm text-gray-700">Down</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
            <span className="text-xs sm:text-sm text-gray-700">Maintenance</span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const groupServers = servers.filter(
              (s) => s.groupId === group._id || (typeof s.groupId === 'object' && s.groupId?._id === group._id)
            );
            return (
              <div key={group._id}>
                <button
                  className={`w-full max-w-none flex items-center justify-between bg-blue-100 rounded-xl px-5 py-3 min-h-[38px] shadow-md hover:shadow-lg transition-all duration-200 text-left focus:outline-none mb-4 border border-blue-200 ${expandedGroup === group._id ? 'ring-2 ring-blue-300' : ''}`}
                  onClick={() => handleExpandGroup(group._id, groupServers)}
                >
                  <span className="font-bold text-base text-gray-900 tracking-wide flex-1 flex items-center">{group.name}</span>
                  <span className="text-gray-500 font-normal text-sm flex items-center justify-end w-32">{groupServers.length} server</span>
                  <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-blue-200 shadow-sm">
                    {expandedGroup === group._id ? (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
                    )}
                  </span>
                </button>
                {expandedGroup === group._id && (
                  <div className="mt-2 animate-fade-in">
                    {/* Date navigation: always starts from today, only goes backward */}
                    <div className="flex items-center justify-between mb-2 px-2 sm:px-0">
                      <button
                        className="px-2 py-1 rounded hover:bg-gray-100 text-sm sm:text-base"
                        disabled={dayOffset === 0}
                        onClick={() => setDayOffset(Math.max(dayOffset - 1, 0))}
                      >&lt;</button>
                      <div className="flex-1 mx-2 sm:mx-4">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-0 text-center">
                          <div className="hidden sm:block" />
                          {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (dayOffset + i));
                            return (
                              <div key={i} className="flex flex-col items-center">
                                <span className="text-xs text-gray-700 font-semibold">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className="text-xs text-gray-500 mt-1 hidden sm:block">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        className="px-2 py-1 rounded hover:bg-gray-100 text-sm sm:text-base"
                        disabled={dayOffset + 7 >= 90}
                        onClick={() => setDayOffset(dayOffset + 1)}
                      >&gt;</button>
                    </div>
                    {/* Matrix table: server x 7 days, only server rows shown when group expanded */}
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-2 sm:p-4 overflow-x-auto">
                      {/* Only show the matrix header once above the table, not duplicated here */}
                      {groupServers.map((server) => {
                        const historyArr = serverHistories[server._id] || [];
                        return (
                          <div key={server._id} className="grid grid-cols-4 sm:grid-cols-8 gap-0 items-center py-2 sm:py-3 border-b border-gray-50 min-w-max sm:min-w-0">
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm text-left pr-2 truncate max-w-20 sm:max-w-none">{server.name}</div>
                            {Array.from({ length: 7 }).map((_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() - (dayOffset + i));
                              const dayStr = date.toISOString().slice(0, 10);
                              const dayHistory = historyArr.find(h => h.timestamp && new Date(h.timestamp).toISOString().slice(0, 10) === dayStr);
                              let icon = null;
                              if (dayHistory) {
                                switch (dayHistory.status) {
                                  case 'operational':
                                    icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
                                    break;
                                  case 'performaissue':
                                    icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>;
                                    break;
                                  case 'down':
                                    icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
                                    break;
                                  case 'maintenance':
                                    icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>;
                                    break;
                                  default:
                                    icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>;
                                }
                              } else {
                                icon = <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>;
                              }
                              return (
                                <div key={i} className="flex justify-center items-center" title={dayHistory ? dayHistory.status : 'No data'}>
                                  {icon}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    {/* 90-day history bar removed as requested */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

