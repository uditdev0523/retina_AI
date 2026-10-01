import React from 'react';
import { 
  MODEL_PERFORMANCE_METRICS, 
  CONFUSION_MATRIX_DATA, 
  ROC_CURVE_DATA 
} from '../data/analyticsData';
import { Activity, CheckCircle2, ShieldCheck, AlertCircle, Info, Target } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Model Clinical Validation & Performance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistical metrics evaluated on benchmark validation datasets (APTOS / Messidor / EyePACS)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
            VALIDATION DATASET EVALUATION
          </span>
        </div>
      </div>

      {/* Target Metric Indicators Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-medical-600" />
              Screening System Target Requirements
            </h3>
            <p className="text-xs text-slate-500">Target Sensitivity &gt; 90.0% | Target Specificity &gt; 85.0%</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            TARGET PASSED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Sensitivity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Sensitivity (TPR)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PASSED</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {MODEL_PERFORMANCE_METRICS.sensitivity.value}%
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Required Target: &gt; 90.0%</span>
              <span className="text-emerald-600 font-bold">+3.4%</span>
            </div>
          </div>

          {/* Specificity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Specificity (TNR)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PASSED</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {MODEL_PERFORMANCE_METRICS.specificity.value}%
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Required Target: &gt; 85.0%</span>
              <span className="text-emerald-600 font-bold">+4.2%</span>
            </div>
          </div>

          {/* Overall Accuracy */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Overall Accuracy</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PASSED</span>
            </div>
            <div className="text-3xl font-black text-medical-600">
              {MODEL_PERFORMANCE_METRICS.accuracy.value}%
            </div>
            <div className="text-xs text-slate-500">
              Multi-class grading score
            </div>
          </div>

          {/* ROC-AUC */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">ROC-AUC Area</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">EXCELLENT</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {MODEL_PERFORMANCE_METRICS.rocAuc.value}
            </div>
            <div className="text-xs text-slate-500">
              Area under curve
            </div>
          </div>

        </div>
      </div>

      {/* Main Charts & Matrix Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Referable DR Confusion Matrix</h3>
            <p className="text-xs text-slate-500">Triage binary classification: Non-Referable vs Referable DR</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center font-bold">
              <div></div>
              <div className="p-2 bg-slate-200 rounded-lg text-slate-700">Pred Non-Referable</div>
              <div className="p-2 bg-slate-200 rounded-lg text-slate-700">Pred Referable</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center items-center">
              <div className="p-2 bg-slate-200 rounded-lg font-bold text-slate-700 text-left">
                Actual Non-Referable (L0-1)
              </div>
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl font-black text-lg text-emerald-900">
                8,840 (TN)
              </div>
              <div className="p-4 bg-red-100 border border-red-300 rounded-xl font-black text-lg text-red-900">
                1,068 (FP)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center items-center">
              <div className="p-2 bg-slate-200 rounded-lg font-bold text-slate-700 text-left">
                Actual Referable (L2-4)
              </div>
              <div className="p-4 bg-amber-100 border border-amber-300 rounded-xl font-black text-lg text-amber-900">
                132 (FN)
              </div>
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl font-black text-lg text-emerald-900">
                1,868 (TP)
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>Referable DR Definition:</strong> Level 0 & Level 1 are Non-Referable; Level 2, Level 3, and Level 4 are Referable.
          </div>
        </div>

        {/* Receiver Operating Characteristic (ROC Curve) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">ROC Curve (Receiver Operating Characteristic)</h3>
            <p className="text-xs text-slate-500">True Positive Rate vs False Positive Rate (AUC = 0.962)</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROC_CURVE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fpr" tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'False Positive Rate', position: 'bottom', offset: 0, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'True Positive Rate', angle: -90, position: 'left', fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="tpr" stroke="#0270c7" strokeWidth={3} dot={{ r: 4 }} name="AI Model ROC" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
