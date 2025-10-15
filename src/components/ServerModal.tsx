import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ServerFormData, Group, Server } from '../types';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServerFormData & { _id?: string }) => void;
  groups: Group[];
  initialData?: Server;
}

export default function ServerModal({ isOpen, onClose, onSubmit, groups, initialData }: ServerModalProps) {
  const [formData, setFormData] = useState<ServerFormData>({
    name: '',
    url: '',
    groupId: '',
    type: 'website',
    description: '',
  });
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        url: initialData.url,
        groupId: typeof initialData.groupId === 'object' ? initialData.groupId._id : initialData.groupId,
        type: initialData.type,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        url: '',
        groupId: '',
        type: 'website',
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId) {
      alert('Please select a group');
      return;
    }
    const submitData = initialData ? { ...formData, _id: initialData._id } : formData;
    onSubmit(submitData);
    if (!initialData) {
      setFormData({ name: '', url: '', groupId: '', type: 'website', description: '' });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Server' : 'Add New Server'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Server Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Main Website"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Masukkan endpoint server..."
            />
          </div>

          {/* Group */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group *
            </label>
            <div className="w-full">
              <div
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer flex justify-between items-center"
                onClick={() => setShowGroupDropdown((v) => !v)}
                tabIndex={0}
                onBlur={() => setTimeout(() => setShowGroupDropdown(false), 150)}
              >
                <span className={formData.groupId ? "text-gray-900" : "text-gray-400"}>
                  {formData.groupId ? (groups.find(g => g._id === formData.groupId)?.name || "Select a group") : "Select a group *"}
                </span>
                <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {showGroupDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow mt-1 max-h-56 overflow-auto">
                  {groups.map((group) => (
                    <li
                      key={group._id}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${formData.groupId === group._id ? 'bg-blue-100 font-bold text-blue-700' : ''}`}
                      onClick={() => { setFormData({ ...formData, groupId: group._id }); setShowGroupDropdown(false); }}
                    >
                      {group.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Type */}
          {/* <div className="hidden"> */}
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              Server Type *
            </label> */}
            {/* <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ServerType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="website">Website</option>
              <option value="api">API</option>
              <option value="database">Database</option>
              <option value="other">Other</option>
            </select> */}
          {/* </div> */}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Optional description..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {initialData ? 'Update Server' : 'Add Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
