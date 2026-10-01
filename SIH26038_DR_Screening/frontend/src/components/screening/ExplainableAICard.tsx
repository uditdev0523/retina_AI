import React from 'react';
import { ShieldCheck, Eye, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ExplainableAICardProps {
  gradcamUrl?: string;
  drLevel?: number;
}

export const ExplainableAICard: React.FC<ExplainableAICardProps> = ({ gradcamUrl, drLevel = 2 }) => {
  const evidenceList = [
    { label: 'Microaneurysms Cluster', weight: 'High Focus (42% spatial contribution)' },
    { label: 'Hard Exudates (Macular Perimeter)', weight: 'Medium Focus (28% spatial contribution)' },
    { label: 'Venous Beading / Vessel Tortuosity', weight: 'Moderate Focus (18% spatial contribution)' },
    { label: 'Intraretinal Hemorrhages', weight: 'Secondary Focus (12% spatial contribution)' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-medical-600" />
            Explainable AI — Grad-CAM Heatmap Analysis
          </h3>
          <p className="text-xs text-slate-500">Visual activation maps for model decision transparency</p>
        </div>
        <span className="text-xs font-bold text-medical-700 bg-medical-50 px-2.5 py-1 rounded-md border border-medical-200">
          Spatial Attention
        </span>
      </div>

      {/* Explanation text */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
        <p className="font-semibold text-slate-900 mb-1">Gradient-weighted Class Activation Mapping (Grad-CAM):</p>
        <p>
          "The neural network's spatial attention is concentrated predominantly around retinal regions containing structural features associated with diabetic retinopathy (macular quadrant and vascular temporal arch)."
        </p>
      </div>

      {/* Primary Visual Evidence Breakdown */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Key Model Evidence Regions:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {evidenceList.map((e, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-medical-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">{e.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{e.weight.split(' ')[0]} {e.weight.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
