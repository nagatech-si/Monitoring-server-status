import { useState, useEffect } from 'react';
import { Menu, RefreshCw, Edit, Trash2 } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ServerModal from './components/ServerModal';
import GroupModal from './components/GroupModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SuccessToast from './components/SuccessToast';
import StatusOverview from './components/StatusOverview';
import HistoryContent from './components/HistoryContent';
import StatusPage from './components/StatusPage';
import { Server, ServerFormData, Group, GroupFormData } from './types';
import { api } from './services/api';
import ReportPage from './pages/ReportPage';

// Admin layout for all admin routes
function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'group' | 'server' | 'history' | 'report'>('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [serversData, groupsData] = await Promise.all([
        api.getAllServers(),
        api.getAllGroups()
      ]);
      setServers(serversData);
      setGroups(groupsData);
    } catch (err) {
      setError('Failed to load servers');
      console.error('Error loading servers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: servers.length,
    operational: servers.filter((s) => s.status === 'operational').length,
    performaissue: servers.filter((s) => s.status === 'performaissue').length,
    down: servers.filter((s) => s.status === 'down').length,
    maintenance: servers.filter((s) => s.status === 'maintenance').length,
  };

  const handleAddGroup = async (data: GroupFormData & { _id?: string }) => {
    try {
      if (data._id) {
        // Edit existing group
        await api.updateGroup(data._id, { name: data.name, description: data.description });
        setSuccessMessage('Group berhasil diperbarui!');
        await loadData();
      } else {
        // Add new group
        const newGroup = await api.createGroup(data);
        setGroups([newGroup, ...groups]);
        setSuccessMessage('Group berhasil ditambahkan!');
      }
      setIsGroupModalOpen(false);
      setEditingGroup(null);
    } catch (err) {
      setError(`Failed to ${data._id ? 'update' : 'add'} group`);
      console.error(`Error ${data._id ? 'updating' : 'adding'} group:`, err);
    }
  };

  const handleAddServer = async (data: ServerFormData & { _id?: string }) => {
    try {
      if (data._id) {
        // Edit existing server
        await api.updateServer(data._id, data);
        setSuccessMessage('Server updated successfully');
      } else {
        // Add new server
        await api.createServer(data);
        setSuccessMessage('Server added successfully');
      }
      await loadData(); // re-fetch data
      setEditingServer(null);
    } catch (err) {
      setError(`Failed to ${data._id ? 'update' : 'add'} server`);
      console.error(`Error ${data._id ? 'updating' : 'adding'} server:`, err);
    }
  };

  const handleEditServer = (server: Server) => {
    setEditingServer(server);
    setIsServerModalOpen(true);
  };

  const handleDeleteServer = (id: string) => {
    setServerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteServer = async () => {
    if (!serverToDelete) return;

    try {
      await api.deleteServer(serverToDelete);
      setServers(servers.filter(s => s._id !== serverToDelete));
      setSuccessMessage('Server deleted successfully');
    } catch (err) {
      setError('Failed to delete server');
      console.error('Error deleting server:', err);
    } finally {
      setIsDeleteModalOpen(false);
      setServerToDelete(null);
    }
  };

  const handleCheckStatus = async (id: string) => {
    try {
      setIsRefreshing(true);
      const updatedServer = await api.checkServerStatus(id);
      setServers(prevServers =>
        prevServers.map(server =>
          server._id === id ? updatedServer : server
        )
      );
    } catch (err) {
      setError('Failed to check server status');
      console.error('Error checking server status:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    setGroupToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await api.deleteGroup(groupToDelete);
      setSuccessMessage('Group berhasil dihapus!');
      await loadData();
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    } catch (error) {
      console.error('Failed to delete group:', error);
      setError('Gagal menghapus group. Silakan coba lagi.');
    }
  };

  const handleRefreshAll = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const promises = servers.map(server => api.checkServerStatus(server._id));
      const updatedServers = await Promise.all(promises);
      setServers(updatedServers);
    } catch (err) {
      setError('Failed to refresh servers');
      console.error('Error refreshing servers:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center px-4">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg sm:text-xl text-gray-600">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAddGroup={() => setIsGroupModalOpen(true)}
        onAddServer={() => setIsServerModalOpen(true)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-16 lg:pt-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-900 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Konten sesuai menu */}
          {activeMenu === 'dashboard' && (
            <>
              <StatusOverview
                totalServers={stats.total}
                operationalServers={stats.operational}
                performaissueServers={stats.performaissue}
                downServers={stats.down}
                maintenanceServers={stats.maintenance}
              />
              <div className="bg-white rounded-xl shadow border border-gray-200 mt-6">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-bold text-gray-800">All Servers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Group</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Uptime</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Response</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Last Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((server) => (
                        <tr key={server._id} className="hover:bg-blue-50 transition cursor-pointer">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{server.name}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{typeof server.groupId === 'object' && server.groupId ? server.groupId.name : '-'}</td>
                          <td className="px-4 sm:px-6 py-3">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
                              server.status === 'operational'
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : server.status === 'performaissue'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : server.status === 'down'
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}>
                              {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{server.uptime}%</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{server.responseTime} ms</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{new Date(server.lastChecked).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {servers.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">No servers found</div>
                  )}
                </div>
              </div>
            </>
          )}
            {activeMenu === 'report' && (
              <ReportPage showAddButton={true} />
            )}

          {activeMenu === 'group' && (
            <>
              <div className="bg-white rounded-xl shadow border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Master Group</h2>
                  <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Add Group
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group._id} className="hover:bg-blue-50 transition">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{group.name}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{group.description}</td>
                          <td className="px-4 sm:px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditGroup(group)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Group"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Group"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {groups.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No groups found</div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMenu === 'server' && (
            <>
              <div className="bg-white rounded-xl shadow border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Master Server</h2>
                  <button
                    onClick={() => {
                      setEditingServer(null);
                      setIsServerModalOpen(true);
                    }}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Add Server
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Group</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">URL</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Uptime</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Response</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Last Checked</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((server) => (
                        <tr key={server._id} className="hover:bg-blue-50 transition cursor-pointer">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{server.name}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{typeof server.groupId === 'object' && server.groupId ? server.groupId.name : '-'}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{server.url}</td>
                          <td className="px-4 sm:px-6 py-3">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
                              server.status === 'operational'
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : server.status === 'performaissue'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : server.status === 'down'
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}>
                              {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{server.uptime}%</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{server.responseTime} ms</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{new Date(server.lastChecked).toLocaleString()}</td>
                          <td className="px-4 sm:px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditServer(server)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Server"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteServer(server._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Server"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {servers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No servers found</div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMenu === 'history' && (
            <HistoryContent servers={servers} />
          )}
        </div>
      </main>

      {/* Success Toast */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <ServerModal
        isOpen={isServerModalOpen}
        onClose={() => {
          setIsServerModalOpen(false);
          setEditingServer(null);
        }}
        onSubmit={handleAddServer}
        groups={groups}
        initialData={editingServer || undefined}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        onSubmit={handleAddGroup}
        initialData={editingGroup || undefined}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setServerToDelete(null);
          setGroupToDelete(null);
        }}
        onConfirm={serverToDelete ? confirmDeleteServer : confirmDeleteGroup}
        title={serverToDelete ? "Delete Server" : "Delete Group"}
        message={
          serverToDelete
            ? "Are you sure you want to delete this server? This action cannot be undone and will permanently remove the server from the system."
            : "Are you sure you want to delete this group? This action cannot be undone and will permanently remove the group from the system."
        }
        confirmText={serverToDelete ? "Delete Server" : "Delete Group"}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/status" element={<StatusPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;

