import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Search, 
  Bell, 
  MapPin, 
  Activity, 
  User, 
  PlayCircle,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenDemoModal?: () => void;
  onOpenStatusModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onOpenDemoModal,
  onOpenStatusModal 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const notifications = [
    { id: 1, text: '3 cases require pending clinician review.', time: '10m ago', type: 'alert' },
    { id: 2, text: 'Case DEMO-004 flagged for severe NPDR & high risk.', time: '45m ago', type: 'warning' },
    { id: 3, text: 'Case DEMO-006 required image recapture (Ungradable).', time: '2h ago', type: 'info' },
    { id: 4, text: 'Weekly rural screening target reached (1,200/1,000).', time: '1d ago', type: 'success' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        
        {/* Left: Mobile Menu toggle + Logo Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-medical-600 to-medical-400 flex items-center justify-center text-white shadow-md shadow-medical-500/20 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">RetinaAI</span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline-block">AI Diabetic Retinopathy Screening</span>
            </div>
          </Link>
        </div>

        {/* Center: Search input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient ID, case number, or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* Right Actions: Facility, Status, Judge Demo, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Judge Demo Mode CTA */}
          <button
            onClick={onOpenDemoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
            title="Start interactive guided judge demo"
          >
            <PlayCircle className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Judge Demo Mode</span>
          </button>

          {/* Facility indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-medical-600" />
            <span className="font-medium">Wardha CHC Hub</span>
          </div>

          {/* System status button */}
          <button
            onClick={onOpenStatusModal}
            className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
            title="View system status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline font-medium">Operational</span>
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
                  <span className="text-xs text-medical-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer">
                      {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                      {n.type === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                      <div>
                        <p className="text-xs text-slate-700 font-medium leading-snug">{n.text}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown button */}
          <Link
            to="/login"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-medical-100 text-medical-700 border border-medical-200 flex items-center justify-center font-bold text-xs">
              DS
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-none">Dr. A. Sharma</div>
              <div className="text-[10px] text-slate-500 leading-tight">Ophthalmologist</div>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
};
