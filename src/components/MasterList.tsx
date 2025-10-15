import { Server } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface MasterListProps {
  servers: Server[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MasterList({ servers, onEdit, onDelete }: MasterListProps) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Master Server</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Group</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Uptime</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Response</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Last Checked</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{server.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{typeof server.groupId === 'object' && server.groupId ? server.groupId.name : '-'}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                  server.status === 'operational' ? 'bg-green-100 text-green-800 border-green-200' :
                  server.status === 'performaissue' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  server.status === 'down' ? 'bg-red-100 text-red-800 border-red-200' :
                  server.status === 'maintenance' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {server.status === 'operational' ? 'Operational' :
                   server.status === 'performaissue' ? 'Performa Issue' :
                   server.status === 'down' ? 'Down' :
                   server.status === 'maintenance' ? 'Maintenance' : server.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{server.uptime ?? '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{server.responseTime ?? '-'} ms</td>
              <td className="px-4 py-2 text-sm text-gray-700">{
                server.lastChecked ? (() => {
                  const seconds = Math.floor((Date.now() - new Date(server.lastChecked).getTime()) / 1000);
                  if (seconds < 60) return `${seconds}s ago`;
                  const minutes = Math.floor(seconds / 60);
                  if (minutes < 60) return `${minutes}m ago`;
                  const hours = Math.floor(minutes / 60);
                  return `${hours}h ago`;
                })() : '-'
              }</td>
              <td className="px-4 py-2 flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit Server" onClick={() => onEdit?.(server._id)}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete Server" onClick={() => onDelete?.(server._id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
