import React from 'react';
import { X, CheckCircle2, ShieldCheck, Server, Cpu, Database, Wifi, FileCheck } from 'lucide-react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const services = [
    { name: 'AI Inference Engine', status: 'Operational', latency: '42ms', icon: Cpu, detail: 'PyTorch / MATLAB DR Classifier Core' },
    { name: 'Image Quality Module', status: 'Operational', latency: '18ms', icon: CheckCircle2, detail: 'CLAHE & Focus Quality Filter' },
    { name: 'Grad-CAM Explainability', status: 'Operational', latency: '65ms', icon: ShieldCheck, detail: 'Spatial Attention Map Service' },
    { name: 'Telemedicine Telemetry', status: 'Operational', latency: '12ms', icon: Wifi, detail: 'Rural Clinic Capacity Engine' },
    { name: 'Report Generator PDF', status: 'Operational', latency: '85ms', icon: FileCheck, detail: 'Screening Audit Report Service' },
    { name: 'Database & Records', status: 'Operational', latency: '8ms', icon: Database, detail: 'Patient & Case Registry' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base text-white">System Status — SIH26038</h3>
              <p className="text-xs text-slate-400">Real-time status of DR Screening infrastructure</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Body */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-emerald-900">All Systems Operational</div>
              <div className="text-xs text-emerald-700">Prototype running with 99.98% uptime in local simulation mode.</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {services.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-medical-50 text-medical-600 border border-medical-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.detail}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {s.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">Latency: {s.latency}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
