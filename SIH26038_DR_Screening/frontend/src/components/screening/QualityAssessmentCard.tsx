import React from 'react';
import { QualityMetrics } from '../../types/screening';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Info } from 'lucide-react';

interface QualityAssessmentCardProps {
  quality: QualityMetrics;
}

export const QualityAssessmentCard: React.FC<QualityAssessmentCardProps> = ({ quality }) => {
  const isUngradable = quality.status === 'UNGRADABLE';
  const isBorderline = quality.status === 'BORDERLINE';

  const getStatusBadge = () => {
    if (isUngradable) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full font-bold text-xs">
          <XCircle className="w-4 h-4 text-red-600" />
          UNGRADABLE
        </span>
      );
    }
    if (isBorderline) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          BORDERLINE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        GOOD QUALITY
      </span>
    );
  };

  const metrics = [
    { label: 'Focus Fidelity', score: quality.focus_score, status: quality.focus_status },
    { label: 'Illumination Uniformity', score: quality.illumination_score, status: quality.illumination_status },
    { label: 'Field of View (FOV)', score: quality.fov_score, status: quality.fov_status },
    { label: 'Contrast Ratio', score: quality.contrast_score, status: quality.contrast_status },
  ];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isUngradable ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900">Image Quality Assessment</h3>
          <p className="text-xs text-slate-500">Automated pre-diagnostic optical validation</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Metrics Breakdown Bar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        {metrics.map((m, idx) => {
          const isLow = m.score < 60;
          return (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">{m.label}</span>
                <span className={`text-xs font-bold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                  {m.score}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLow ? 'bg-red-500' : m.score < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-500 uppercase">
                {m.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Warning Callout for UNGRADABLE images */}
      {isUngradable && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">Image Quality Insufficient</h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                {quality.reason || 'Image quality is insufficient for reliable automated analysis. Automated DR classification is suspended to ensure patient safety.'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-red-200/60">
            <span className="text-xs font-bold text-red-800">
              Recommended Action: Recapture Image
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Recapture Fundus
            </button>
          </div>
        </div>
      )}

      {!isUngradable && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Info className="w-4 h-4 text-medical-600 shrink-0" />
          <span>{quality.reason} — {quality.recommendation}</span>
        </div>
      )}

    </div>
  );
};
