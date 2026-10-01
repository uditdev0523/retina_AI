import React from 'react';
import { DRClassification } from '../../types/screening';
import { AlertCircle, CheckCircle, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface ReferableCardProps {
  classification: DRClassification;
}

export const ReferableCard: React.FC<ReferableCardProps> = ({ classification }) => {
  const isReferable = classification.is_referable;

  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${
      isReferable 
        ? 'bg-amber-50/70 border-amber-200 ring-1 ring-amber-300/50' 
        : 'bg-emerald-50/70 border-emerald-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-xl ${isReferable ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-500 text-white'}`}>
            {isReferable ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Triage Referral Status</span>
            <h3 className={`text-2xl font-black mt-0.5 ${isReferable ? 'text-amber-900' : 'text-emerald-900'}`}>
              {isReferable ? 'REFERABLE DR' : 'NON-REFERABLE DR'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              {isReferable
                ? 'Clinical protocol requires specialist ophthalmologist review & intervention for Levels 2, 3, or 4.'
                : 'Routine annual screening cycle recommended. Level 0 (No DR) or Level 1 (Mild NPDR).'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Referral Confidence</span>
          <div className="text-xl font-black text-slate-900">
            {(classification.raw_confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Threshold Rule Reference */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Rule Logic:</span>
          <span>Levels 0–1 → Non-Referable | Levels 2–4 → Referable</span>
        </div>
        {isReferable && (
          <span className="font-bold text-amber-700 flex items-center gap-1">
            Action: Schedule Visit <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};
