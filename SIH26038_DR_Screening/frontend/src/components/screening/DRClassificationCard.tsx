import React from 'react';
import { DRClassification, DRLevel } from '../../types/screening';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DRClassificationCardProps {
  classification: DRClassification;
}

export const DRClassificationCard: React.FC<DRClassificationCardProps> = ({ classification }) => {
  const { predicted_grade, grade_label, raw_confidence, probabilities } = classification;

  const drLevels: { level: DRLevel; title: string; desc: string; color: string; bg: string }[] = [
    { level: 0, title: 'Level 0 — No DR', desc: 'Normal fundus, no microvascular lesions.', color: 'text-emerald-700', bg: 'bg-emerald-500' },
    { level: 1, title: 'Level 1 — Mild NPDR', desc: 'Microaneurysms only.', color: 'text-blue-700', bg: 'bg-blue-500' },
    { level: 2, title: 'Level 2 — Moderate NPDR', desc: 'Microaneurysms, exudates, blot hemorrhages.', color: 'text-amber-700', bg: 'bg-amber-500' },
    { level: 3, title: 'Level 3 — Severe NPDR', desc: 'Cotton wool spots, intraretinal hemorrhages in 4 quadrants.', color: 'text-orange-700', bg: 'bg-orange-500' },
    { level: 4, title: 'Level 4 — Proliferative DR', desc: 'Neovascularization, vitreous hemorrhage risk.', color: 'text-red-700', bg: 'bg-red-500' },
  ];

  const chartData = Object.entries(probabilities || {}).map(([key, val]) => ({
    name: key.replace(/ \(.*\)/, ''),
    shortName: key.split(' ')[0] + ' ' + (key.split(' ')[1] || ''),
    prob: parseFloat((val * 100).toFixed(1)),
  }));

  const currentLevelInfo = drLevels[predicted_grade] || drLevels[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-600" />
            Diabetic Retinopathy Assessment
          </h3>
          <p className="text-xs text-slate-500">Multi-class deep learning severity prediction (ETDRS standard)</p>
        </div>
        <span className="text-xs text-slate-400 font-mono">Model v2.4</span>
      </div>

      {/* Main Grade Result Display */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Predicted DR Grade</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-3">
            <span>{grade_label}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">{currentLevelInfo.desc}</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Confidence</div>
            <div className="text-2xl font-black text-medical-600">
              {(raw_confidence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Referable</div>
            <div className={`text-base font-extrabold ${classification.is_referable ? 'text-amber-600' : 'text-emerald-600'}`}>
              {classification.is_referable ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>

      {/* Severity Scale Bar */}
      <div>
        <div className="text-xs font-semibold text-slate-700 mb-2">ETDRS DR Severity Scale:</div>
        <div className="grid grid-cols-5 gap-1.5">
          {drLevels.map((lvl) => {
            const isSelected = lvl.level === predicted_grade;
            return (
              <div 
                key={lvl.level}
                className={`p-2 rounded-xl text-center border transition-all ${
                  isSelected 
                    ? 'ring-2 ring-medical-500 bg-white shadow-md border-medical-500' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${lvl.bg}`}></div>
                <div className="text-xs font-extrabold text-slate-900">L{lvl.level}</div>
                <div className="text-[10px] font-medium text-slate-500 hidden sm:block truncate">{lvl.title.split('—')[1]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Probability Distribution Chart */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">Multi-Class Class Probability Distribution:</span>
          <span className="text-[10px] text-slate-400">Demo inference softmax scores</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Probability']} />
              <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === predicted_grade ? '#0270c7' : '#cbd5e1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
