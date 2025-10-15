import {Server as ServerIcon, Folder, FolderOpen, LayoutDashboard, Users, ListOrdered, History, ChevronLeft } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: () => void;
  onAddServer: () => void;
  activeMenu: 'dashboard' | 'group' | 'server' | 'history' | 'report';
  setActiveMenu: Dispatch<SetStateAction<'dashboard' | 'group' | 'server' | 'history' | 'report'>>;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onAddGroup, 
  onAddServer, 
  activeMenu, 
  setActiveMenu 
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-80 bg-[#0a1f60] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex flex-col rounded-tr-[48px] rounded-br-[48px]`}
      >
        {/* Logo/Title */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-900">
          <div className="bg-white rounded-full p-2">
            <LayoutDashboard size={32} className="text-[#0a1f60]" />
          </div>
          <span className="text-white text-2xl font-bold tracking-wide">Monitoring</span>
        </div>

        {/* Menu Utama */}
        <div className="flex flex-col gap-2 px-4 py-6">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg text-left font-semibold transition-colors text-base sm:text-lg ${activeMenu === 'dashboard' ? 'bg-white text-[#0a1f60] shadow border border-blue-200' : 'text-white hover:bg-blue-900'}`}
          >
            <LayoutDashboard size={20} className="flex-shrink-0" /> <span className="truncate">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveMenu('group')}
            className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg text-left font-semibold transition-colors text-base sm:text-lg ${activeMenu === 'group' ? 'bg-white text-[#0a1f60] shadow border border-green-200' : 'text-white hover:bg-blue-900'}`}
          >
            <Users size={20} className="flex-shrink-0" /> <span className="truncate">Master Group</span>
          </button>
          <button
            onClick={() => setActiveMenu('server')}
            className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg text-left font-semibold transition-colors text-base sm:text-lg ${activeMenu === 'server' ? 'bg-white text-[#0a1f60] shadow border border-blue-200' : 'text-white hover:bg-blue-900'}`}
          >
            <ListOrdered size={20} className="flex-shrink-0" /> <span className="truncate">Master Server</span>
          </button>
          <button
            onClick={() => setActiveMenu('history')}
            className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg text-left font-semibold transition-colors text-base sm:text-lg ${activeMenu === 'history' ? 'bg-white text-[#0a1f60] shadow border border-gray-300' : 'text-white hover:bg-blue-900'}`}
          >
            <History size={20} className="flex-shrink-0" /> <span className="truncate">History</span>
          </button>
            <button
              onClick={() => setActiveMenu('report')}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg text-left font-semibold transition-colors text-base sm:text-lg ${activeMenu === 'report' ? 'bg-white text-[#0a1f60] shadow border border-blue-200' : 'text-white hover:bg-blue-900'}`}
            >
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="truncate">Report</span>
            </button>
        </div>

        {/* Footer (optional) */}
        <div className="mt-auto px-6 py-6 border-t border-blue-900 relative">
          {/* Close button for mobile - positioned at bottom right */}
          <div className="lg:hidden absolute bottom-2 right-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 text-white hover:bg-blue-900 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="text-white text-sm opacity-70">&copy; {new Date().getFullYear()} Monitoring App</div>
        </div>
      </aside>
    </>
  );
}
