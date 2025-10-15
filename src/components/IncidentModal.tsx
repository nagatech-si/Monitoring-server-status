import React, { useState } from 'react';


interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when value changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
import { ChevronDown } from 'lucide-react';

interface TimelineItem {
  status: 'Resolved' | 'Investigating' | 'Monitoring' | 'Open';
  time: string;
  message: string;
}

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IncidentFormData) => void;
  initialData?: IncidentFormData;
}

export interface IncidentFormData {
  startTime: string;
  endTime: string;
  cause: string;
  solution: string;
  status: 'resolved' | 'ongoing';
  timelines?: TimelineItem[];
}

const IncidentModal: React.FC<IncidentModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<IncidentFormData>({
    startTime: '',
    endTime: '',
    cause: '',
    solution: '',
    status: 'ongoing',
    timelines: []
  });

  React.useEffect(() => {
    if (initialData) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Remove seconds and timezone
      };

      setForm({
        ...initialData,
        startTime: formatDateTime(initialData.startTime),
        endTime: formatDateTime(initialData.endTime),
        timelines: initialData.timelines || []
      });
    } else {
      setForm({
        startTime: '',
        endTime: '',
        cause: '',
        solution: '',
        status: 'ongoing',
        timelines: []
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (idx: number, field: keyof TimelineItem, value: string) => {
    setForm(prev => ({
      ...prev,
      timelines: prev.timelines?.map((tl, i) => i === idx ? { ...tl, [field]: value } : tl)
    }));
  };

  const addTimeline = () => {
    setForm(prev => ({
      ...prev,
      timelines: [...(prev.timelines || []), { status: 'Resolved', time: '', message: '' }]
    }));
  };

  const removeTimeline = (idx: number) => {
    setForm(prev => ({
      ...prev,
      timelines: prev.timelines?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.startTime || !form.cause || !form.solution) {
      alert('Harap isi semua field yang wajib diisi');
      return;
    }

    // Filter out incomplete timeline items
    const validTimelines = form.timelines?.filter(timeline =>
      timeline.status && timeline.time && timeline.message
    ) || [];

    const cleanedForm = {
      ...form,
      timelines: validTimelines
    };

    onSubmit(cleanedForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Input Incident Manual</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
            Waktu mulai error
            <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
            Waktu selesai error
            <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
            Penyebab
            <textarea name="cause" value={form.cause} onChange={handleChange} required rows={2} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
            Cara menanganinya
            <textarea name="solution" value={form.solution} onChange={handleChange} required rows={2} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
            Status
            <CustomSelect
              value={form.status}
              onChange={(value) => setForm(prev => ({ ...prev, status: value as 'resolved' | 'ongoing' }))}
              options={[
                { value: 'resolved', label: 'Resolved' },
                { value: 'ongoing', label: 'Ongoing' }
              ]}
            />
          </label>
          {/* Timeline input */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-sm text-gray-800 mb-1">Timeline Penyelesaian (bisa lebih dari satu)</span>
            {form.timelines?.map((tl, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-2 bg-gray-50 flex flex-col gap-2 relative">
                <div className="flex gap-2">
                  <CustomSelect
                    value={tl.status}
                    onChange={(value) => handleTimelineChange(idx, 'status', value)}
                    options={[
                      { value: 'Resolved', label: 'Resolved' },
                      { value: 'Investigating', label: 'Investigating' },
                      { value: 'Monitoring', label: 'Monitoring' },
                      { value: 'Open', label: 'Open' }
                    ]}
                    className="flex-1"
                  />
                  <input type="datetime-local" value={tl.time} onChange={e => handleTimelineChange(idx, 'time', e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 text-xs" />
                </div>
                <textarea value={tl.message} onChange={e => handleTimelineChange(idx, 'message', e.target.value)} rows={2} placeholder="Deskripsi perbaikan/tindakan" className="border border-gray-300 rounded-lg px-2 py-1 text-xs resize-none" />
                {form.timelines && form.timelines.length > 1 && (
                  <button type="button" onClick={() => removeTimeline(idx)} className="absolute top-2 right-2 text-xs text-red-500 hover:underline">Hapus</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTimeline} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">+ Tambah Timeline</button>
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default IncidentModal;
