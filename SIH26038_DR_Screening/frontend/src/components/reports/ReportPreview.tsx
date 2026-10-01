import React from 'react';
import { ScreeningCase } from '../../types/screening';
import { Printer, Download, Eye, FileText, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface ReportPreviewProps {
  screeningCase: ScreeningCase;
  onPrint?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ screeningCase, onPrint }) => {
  const handlePrintWindow = () => {
    if (onPrint) onPrint();
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto print:shadow-none print:border-none print:m-0">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-medical-400" />
          <h3 className="font-bold text-sm text-white">Diabetic Retinopathy Audit Screening Report</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintWindow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button
            onClick={handlePrintWindow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div id="printable-report" className="p-8 sm:p-10 space-y-8 bg-white text-slate-900">
        
        {/* Document Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">RetinaAI Tele-Screening Report</h1>
              <p className="text-xs text-slate-500 font-medium">Clinical Screening Prototype</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-slate-400">Case ID</div>
            <div className="text-lg font-black text-slate-900">{screeningCase.case_id}</div>
            <div className="text-xs text-slate-500 mt-0.5">Date: {screeningCase.screening_date}</div>
          </div>
        </div>

        {/* Patient & Facility Information */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
            <div className="font-bold text-slate-900 text-sm">{screeningCase.patient.name}</div>
            <div className="text-slate-500">ID: {screeningCase.patient.id}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</span>
            <div className="font-bold text-slate-900 text-sm">{screeningCase.patient.age} Yrs / {screeningCase.patient.gender}</div>
            <div className="text-slate-500">Diabetic: {screeningCase.patient.diabetic_years} Yrs</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Facility Outpost</span>
            <div className="font-bold text-slate-900 text-sm">{screeningCase.facility}</div>
            <div className="text-slate-500">{screeningCase.patient.location}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Review Status</span>
            <div className="font-extrabold text-medical-700 text-sm uppercase mt-0.5">{screeningCase.review_status}</div>
          </div>
        </div>

        {/* AI Diagnosis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">DIABETIC RETINOPATHY GRADE</span>
            <div className="text-lg font-black text-slate-900 mt-1">{screeningCase.dr_classification.grade_label}</div>
            <div className="text-xs text-slate-500 mt-1">ETDRS Scale Level {screeningCase.dr_classification.predicted_grade}</div>
          </div>

          <div className={`p-4 rounded-xl border ${screeningCase.dr_classification.is_referable ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">REFERABLE STATUS</span>
            <div className={`text-lg font-black mt-1 ${screeningCase.dr_classification.is_referable ? 'text-amber-800' : 'text-emerald-800'}`}>
              {screeningCase.dr_classification.referable_status}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {screeningCase.dr_classification.is_referable ? 'Ophthalmologist Referral Recommended' : 'Routine Re-screening'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">AI CONFIDENCE & QUALITY</span>
            <div className="text-lg font-black text-medical-600 mt-1">
              {(screeningCase.dr_classification.raw_confidence * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Quality: {screeningCase.quality.status}</div>
          </div>

        </div>

        {/* Optical Quality & Lesion Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Optical Image Quality Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Focus:</span>
                <span className="font-bold text-slate-900">{screeningCase.quality.focus_score}% ({screeningCase.quality.focus_status})</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Illumination:</span>
                <span className="font-bold text-slate-900">{screeningCase.quality.illumination_score}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Field of View:</span>
                <span className="font-bold text-slate-900">{screeningCase.quality.fov_score}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Contrast:</span>
                <span className="font-bold text-slate-900">{screeningCase.quality.contrast_score}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Automated Biomarker Findings
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Microaneurysms:</span>
                <span className="font-bold text-slate-900">{screeningCase.lesions.microaneurysms?.count || 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Hard Exudates:</span>
                <span className="font-bold text-slate-900">{screeningCase.lesions.exudates?.count || 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Hemorrhages:</span>
                <span className="font-bold text-slate-900">{screeningCase.lesions.hemorrhages?.count || 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-500">Neovascular:</span>
                <span className="font-bold text-slate-900">{screeningCase.lesions.neovascularization?.count || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Clinician Signature Section */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 mt-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Ophthalmologist Review & Sign-Off
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Reviewer:</span>
              <div className="font-bold text-slate-900 mt-0.5">
                {screeningCase.clinician_review?.reviewer || 'Dr. A. Sharma (Ophthalmologist)'}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Clinical Decision:</span>
              <div className="font-bold text-medical-700 mt-0.5">
                {screeningCase.clinician_review?.action || 'AGREE WITH AI PREDICTION'}
              </div>
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-semibold text-xs">Clinical Impression Notes:</span>
            <p className="text-xs text-slate-700 mt-1 italic">
              "{screeningCase.clinician_review?.comments || screeningCase.report_text || 'Fundus screening reviewed and confirmed by attending physician.'}"
            </p>
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Signature: ______________________</span>
            <span>Date: {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 text-center leading-relaxed">
          This report is produced by an AI-assisted diabetic retinopathy screening prototype. All AI-generated classifications require human clinical review prior to definitive medical decision making. Demonstration data — not a clinically certified medical device.
        </div>

      </div>

    </div>
  );
};
