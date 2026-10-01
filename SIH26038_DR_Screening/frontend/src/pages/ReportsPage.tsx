import React, { useState } from 'react';
import { RECENT_CASES } from '../data/patientsData';
import { ReportPreview } from '../components/reports/ReportPreview';
import { FileText, Printer, Download, Eye, ChevronRight } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const activeCase = RECENT_CASES[selectedCaseIndex] || RECENT_CASES[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Screening Reports Archive</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate, print, and export audit-ready clinical DR screening reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
          >
            <Printer className="w-4 h-4 text-medical-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Case Picker, Right Report Document */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Case Selector Sidebar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Select Case Report</h3>
            <span className="text-[10px] text-slate-400 font-mono">{RECENT_CASES.length} Reports</span>
          </div>

          <div className="space-y-2">
            {RECENT_CASES.map((c, idx) => {
              const isSelected = idx === selectedCaseIndex;
              return (
                <button
                  key={c.case_id}
                  onClick={() => setSelectedCaseIndex(idx)}
                  className={`w-full p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-medical-600 text-white border-medical-600 shadow-md ring-2 ring-medical-300'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{c.case_id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : c.dr_classification.is_referable 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.dr_classification.is_referable ? 'REF' : 'NON-REF'}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-medical-100' : 'text-slate-600'}`}>
                    {c.patient.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-medical-200' : 'text-slate-400'}`}>
                    Level {c.dr_classification.predicted_grade} — {c.dr_classification.grade_label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Printable Document Preview */}
        <div className="lg:col-span-3">
          <ReportPreview screeningCase={activeCase} />
        </div>

      </div>

    </div>
  );
};
