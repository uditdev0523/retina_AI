import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  Users, 
  FileText, 
  BarChart3, 
  Radio, 
  Activity, 
  Settings, 
  HelpCircle, 
  Home,
  X,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Screening', path: '/screening', icon: Scan, highlight: true },
    { label: 'Patient Registry', path: '/patients', icon: Users },
    { label: 'Screening Reports', path: '/reports', icon: FileText },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Telemedicine Sim', path: '/telemedicine', icon: Radio },
    { label: 'AI Model Performance', path: '/performance', icon: Activity },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'About Project', path: '/about', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 border-r border-slate-800`}
      >
        {/* Header Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-medical-600 text-white flex items-center justify-center font-bold text-sm">
              DR
            </div>
            <div>
              <div className="text-sm font-semibold text-white tracking-wide">DR Screening AI</div>
              <div className="text-[10px] text-slate-400">Rural Ophthalmology Workstation</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-medical-600 text-white shadow-md shadow-medical-900/50 font-semibold' 
                    : item.highlight 
                      ? 'bg-medical-950/60 text-medical-300 border border-medical-700/50 hover:bg-medical-900/80 hover:text-white' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : item.highlight ? 'text-medical-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-medical-400 animate-pulse"></span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Safety Disclaimer Box */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-850 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Prototype Notice</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            This prototype uses demonstration metrics and local AI pipeline simulation for evaluation purposes.
          </p>
        </div>
      </aside>
    </>
  );
};
