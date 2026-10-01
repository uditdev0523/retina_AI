import React from 'react';
import { LesionFindings } from '../../types/screening';
import { Eye, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface LesionAnalysisCardProps {
  lesions: LesionFindings;
}

export const LesionAnalysisCard: React.FC<LesionAnalysisCardProps> = ({ lesions }) => {
  const items = [
    {
      title: 'Microaneurysms',
      data: lesions.microaneurysms,
      desc: 'Small red sac-like vascular dilations.',
      color: 'border-red-200 bg-red-50/40 text-red-900',
    },
    {
      title: 'Hard Exudates',
      data: lesions.exudates,
      desc: 'Lipid deposits from leaky microvessels.',
      color: 'border-amber-200 bg-amber-50/40 text-amber-900',
    },
    {
      title: 'Intraretinal Hemorrhages',
      data: lesions.hemorrhages,
      desc: 'Blot / flame hemorrhages in deep layers.',
      color: 'border-orange-200 bg-orange-50/40 text-orange-900',
    },
    {
      title: 'Neovascularization',
      data: lesions.neovascularization,
      desc: 'Fragile new vessel growth (PDR signal).',
      color: 'border-rose-200 bg-rose-50/40 text-rose-900',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-medical-600" />
            Automated Lesion & Biomarker Quantification
          </h3>
          <p className="text-xs text-slate-500">Instance detection & spatial localization</p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Biomarker AI
        </span>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const isDetected = item.data?.detected;
          return (
            <div key={idx} className={`p-4 rounded-xl border ${item.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{item.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isDetected ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isDetected ? `${item.data.count} DETECTED` : 'NOT DETECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-600">{item.desc}</p>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                <span className="text-slate-500">Detection Confidence:</span>
                <span className="font-mono font-bold text-slate-800">
                  {Math.round((item.data.confidence || 0.90) * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
        <Info className="w-4 h-4 shrink-0 text-amber-600" />
        <span>
          <strong>Demo visualization:</strong> Lesion overlays are computer-assisted representations and require clinician confirmation.
        </span>
      </div>

    </div>
  );
};
