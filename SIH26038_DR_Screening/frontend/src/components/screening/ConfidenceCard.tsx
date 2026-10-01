import React from 'react';
import { ConfidenceCalibration } from '../../types/screening';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ConfidenceCardProps {
  calibration: ConfidenceCalibration;
}

export const ConfidenceCard: React.FC<ConfidenceCardProps> = ({ calibration }) => {
  const { raw_confidence, calibrated_confidence, category, recommendation } = calibration;

  const isLow = category === 'LOW';
  const isMed = category === 'MEDIUM';

  const badgeColor = isLow 
    ? 'bg-red-100 text-red-800 border-red-200' 
    : isMed 
      ? 'bg-amber-100 text-amber-800 border-amber-200' 
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isLow ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'} space-y-4`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-medical-600" />
            Model Confidence & Calibration
          </h3>
          <p className="text-xs text-slate-500">Uncertainty quantification & reliability safety metric</p>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${badgeColor}`}>
          {category} CONFIDENCE
        </span>
      </div>

      {/* Confidence Score Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Raw Model Output</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {(raw_confidence * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">Softmax output vector score</span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Platt-Calibrated Confidence</span>
          <div className="text-2xl font-black text-medical-600 mt-1">
            {(calibrated_confidence * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">Temperature-scaled posterior probability</span>
        </div>
      </div>

      {/* Low confidence warning banner */}
      {isLow && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 leading-relaxed">
            <strong>Warning:</strong> AI confidence is low. Automated diagnosis uncertainty is elevated. Mandatory clinician review is recommended.
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <Info className="w-4 h-4 text-medical-600 shrink-0" />
        <span>{recommendation}</span>
      </div>

    </div>
  );
};
