import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { format } from 'date-fns';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import IncidentModal from '../components/IncidentModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SuccessToast from '../components/SuccessToast';

export interface IncidentFormData {
  _id?: string;
  startTime: string;
  endTime: string;
  cause: string;
  solution: string;
  status: 'resolved' | 'ongoing';
  timelines?: { status: string; time: string; message: string }[];
}

interface IncidentHistoryProps {
  showAddButton?: boolean;
  showTitle?: boolean;
  showActionButtons?: boolean;
}

const IncidentHistory: React.FC<IncidentHistoryProps> = ({ showAddButton, showTitle = true, showActionButtons = true }) => {
  const [incidents, setIncidents] = useState<IncidentFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<IncidentFormData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const data = await api.getAllIncidents();
        setIncidents(data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Group incidents by month
  const groupIncidentsByMonth = (incidents: IncidentFormData[]) => {
    const groups: Record<string, IncidentFormData[]> = {};
    incidents.forEach(incident => {
      const date = new Date(incident.startTime);
      const key = format(date, 'MMMM yyyy');
      if (!groups[key]) groups[key] = [];
      groups[key].push(incident);
    });
    return groups;
  };

  const handleSubmitIncident = async (data: IncidentFormData) => {
    try {
      if (editingIncident) {
        // Update existing incident
        await api.updateIncident(editingIncident._id!, data);
        setSuccessMessage('Incident berhasil diperbarui!');
      } else {
        // Create new incident
        await api.createIncident(data);
        setSuccessMessage('Incident berhasil disimpan!');
      }

      // Refresh incidents list
      const updatedIncidents = await api.getAllIncidents();
      setIncidents(updatedIncidents);
      setModalOpen(false);
      setEditingIncident(null);
    } catch (error) {
      console.error('Failed to save incident:', error);
      alert('Gagal menyimpan incident. Silakan coba lagi.');
    }
  };

  const handleEditIncident = (incident: IncidentFormData) => {
    setEditingIncident(incident);
    setModalOpen(true);
  };

  const handleDeleteIncident = (incidentId: string) => {
    setIncidentToDelete(incidentId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!incidentToDelete) return;

    try {
      await api.deleteIncident(incidentToDelete);
      setSuccessMessage('Incident berhasil dihapus!');
      // Refresh incidents list
      const updatedIncidents = await api.getAllIncidents();
      setIncidents(updatedIncidents);
      setDeleteModalOpen(false);
      setIncidentToDelete(null);
    } catch (error) {
      console.error('Failed to delete incident:', error);
      alert('Gagal menghapus incident. Silakan coba lagi.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingIncident(null);
  };

  const grouped = groupIncidentsByMonth(incidents);

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        {showTitle && <h2 className="text-2xl font-bold text-gray-900">Incident History</h2>}
        {showAddButton ? (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow"
            onClick={() => setModalOpen(true)}
          >
            Input Incident Manual
          </button>
        ) : null}
      </div>
      <IncidentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitIncident}
        initialData={editingIncident || undefined}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Incident"
        message="Apakah Anda yakin ingin menghapus incident ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
      />

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="bg-[#f8fafc] rounded-xl border border-gray-200 shadow mb-4">
              <button
                className="w-full flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 font-semibold text-base sm:text-lg text-gray-900 focus:outline-none select-none"
                onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
              >
                <span>{month}</span>
                <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={expandedMonth === month ? 'M6 18L18 6M6 6l12 12' : 'M19 9l-7 7-7-7'} />
                </svg>
              </button>
              {expandedMonth === month && (
                <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-4 sm:space-y-8">
                  {items.map((incident) => {
                    const timelineCount = Array.isArray(incident.timelines) ? incident.timelines.length : 0;
                    return (
                      <div key={incident._id} className="relative flex bg-white rounded-xl border border-gray-200 shadow p-4 sm:p-6">
                        {/* Vertical green line */}
                        <div className="absolute left-0 top-4 sm:top-6 bottom-4 sm:bottom-6 w-1 sm:w-2 rounded-xl bg-green-400" style={{ minHeight: '80%' }} />
                        <div className="pl-3 sm:pl-6 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                            <span className="font-semibold text-base sm:text-lg text-gray-900">{incident.cause || 'Gangguan Layanan'}</span>
                            <span className={`flex items-center gap-1 font-semibold text-xs sm:text-sm px-2 py-1 rounded-full w-fit ${
                              incident.status === 'resolved'
                                ? 'text-green-700 bg-green-100'
                                : 'text-yellow-700 bg-yellow-100'
                            }`}>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-2">
                            <span>Started: {incident.startTime ? new Date(incident.startTime).toLocaleString() : '-'}</span>
                            <span>Resolved: {(() => {
                              if (Array.isArray(incident.timelines) && incident.timelines.length > 0) {
                                const last = incident.timelines[incident.timelines.length - 1];
                                return last.time ? new Date(last.time).toLocaleString() : '-';
                              }
                              return incident.endTime ? new Date(incident.endTime).toLocaleString() : '-';
                            })()}</span>
                            <span>Duration: {(() => {
                              let start = incident.startTime ? new Date(incident.startTime) : null;
                              let end = null;
                              if (Array.isArray(incident.timelines) && incident.timelines.length > 0) {
                                const last = incident.timelines[incident.timelines.length - 1];
                                end = last.time ? new Date(last.time) : null;
                              } else if (incident.endTime) {
                                end = new Date(incident.endTime);
                              }
                              if (start && end) {
                                const diff = Math.round((end.getTime() - start.getTime()) / 60000);
                                return diff > 0 ? diff + ' menit' : '0 menit';
                              }
                              return '-';
                            })()}</span>
                          </div>
                          <div className="mb-3 sm:mb-2 text-gray-700 text-sm sm:text-base">{incident.solution || '-'}</div>
                          {timelineCount > 0 && (
                            <button
                              className="text-blue-600 text-sm font-medium underline mb-2"
                              onClick={() => setExpandedTimeline(expandedTimeline === incident._id ? null : (incident._id || null))}
                              type="button"
                            >
                              {expandedTimeline === incident._id ? 'Hide Timeline' : `Show Timeline (${timelineCount} updates)`}
                            </button>
                          )}
                          {expandedTimeline === incident._id && (
                            <div className="space-y-4 mt-2">
                              {incident.timelines?.map((tl, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                  <div className="flex gap-2 items-center mb-1">
                                    <span className="font-semibold text-green-700 text-sm">{tl.status}</span>
                                    <span className="text-xs text-gray-500">{tl.time ? new Date(tl.time).toLocaleString() : '-'}</span>
                                  </div>
                                  <div className="text-gray-700 text-sm">{tl.message}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Action buttons */}
                          {showActionButtons && (
                            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleEditIncident(incident)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteIncident(incident._id!)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentHistory;
