import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_CASES, getFullDemoCaseData } from '../data/demoCasesData';
import { analyzeFundusImage } from '../services/api';
import { ScreeningCase } from '../types/screening';

import { ProcessingPipeline } from '../components/screening/ProcessingPipeline';
import { QualityAssessmentCard } from '../components/screening/QualityAssessmentCard';
import { RetinaViewer } from '../components/screening/RetinaViewer';
import { DRClassificationCard } from '../components/screening/DRClassificationCard';
import { ReferableCard } from '../components/screening/ReferableCard';
import { LesionAnalysisCard } from '../components/screening/LesionAnalysisCard';
import { ExplainableAICard } from '../components/screening/ExplainableAICard';
import { ConfidenceCard } from '../components/screening/ConfidenceCard';
import { ClinicianReviewCard } from '../components/screening/ClinicianReviewCard';
import { ReportPreview } from '../components/reports/ReportPreview';

import { 
  Upload, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  RotateCcw, 
  ShieldAlert,
  Printer
} from 'lucide-react';

export const ScreeningPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const demoParam = searchParams.get('demo');

  const [activeCase, setActiveCase] = useState<ScreeningCase | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto load demo case if query param specified
  useEffect(() => {
    if (demoParam) {
      handleSelectDemo(demoParam);
    } else {
      // Default to DEMO-003 Moderate NPDR on fresh page visit for rich visual demo
      handleSelectDemo('DEMO-003');
    }
  }, [demoParam]);

  const handleSelectDemo = async (demoId: string) => {
    setIsProcessing(true);
    setSearchParams({ demo: demoId });
    try {
      const caseData = await analyzeFundusImage(undefined, demoId);
      setActiveCase(caseData);
    } catch (err) {
      console.error(err);
      setActiveCase(getFullDemoCaseData(demoId));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const caseData = await analyzeFundusImage(file);
      setActiveCase(caseData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const isUngradable = activeCase?.quality.status === 'UNGRADABLE';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Retinal Screening</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload fundus photographs or select judge demonstration cases for AI-assisted DR grading
          </p>
        </div>

        {activeCase && (
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
          >
            <FileText className="w-4 h-4 text-medical-400" />
            <span>View Screening Report</span>
          </button>
        )}
      </div>

      {/* Upload Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all bg-white shadow-sm ${
          dragActive 
            ? 'border-medical-500 bg-medical-50/50 scale-[1.01]' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center mx-auto border border-medical-100">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900">Upload Retinal Fundus Image</h3>
            <p className="text-xs text-slate-500 mt-1">
              Drag & drop non-mydriatic fundus photo (PNG, JPG, JPEG) or click to browse
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105">
              <span>Upload Image File</span>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleFileInputChange}
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>

      {/* Demo Cases Selector Row */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Pre-Loaded SIH Demo Test Cases
            </h3>
            <p className="text-xs text-slate-500">Select any case below to demonstrate end-to-end AI assessment workflow</p>
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">6 Test Cases</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEMO_CASES.map((d) => {
            const isSelected = activeCase?.case_id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleSelectDemo(d.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-medical-600 text-white border-medical-600 shadow-md ring-2 ring-medical-300 font-semibold' 
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold truncate">{d.id}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-medical-100' : 'text-slate-500'}`}>
                  {d.grade_name}
                </div>
                <div className="mt-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : d.quality_status === 'UNGRADABLE' 
                        ? 'bg-red-100 text-red-700' 
                        : d.is_referable 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {d.quality_status === 'UNGRADABLE' ? 'UNGRADABLE' : d.is_referable ? 'REFERABLE' : 'NON-REF'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Processing Workflow Pipeline */}
      <ProcessingPipeline 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
      />

      {/* Main Analysis Panels (visible when activeCase exists and processing done/progressing) */}
      {activeCase && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Active Case Banner Header */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-sm">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white">{activeCase.case_id}</span>
                  <span className="text-xs text-slate-400 font-mono">({activeCase.patient.name} — {activeCase.patient.id})</span>
                </div>
                <div className="text-xs text-slate-400">Facility: {activeCase.facility} | Date: {activeCase.screening_date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectDemo(activeCase.case_id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-Analyze
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-1.5 bg-medical-600 hover:bg-medical-500 text-white rounded-lg text-xs font-bold shadow-md"
              >
                Generate Report
              </button>
            </div>
          </div>

          {/* 1. Image Quality Assessment Card */}
          <QualityAssessmentCard quality={activeCase.quality} />

          {/* If UNGRADABLE: Block diagnosis panels to obey strict safety protocol */}
          {isUngradable ? (
            <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-bold text-red-900">Automated DR Assessment Suspended</h3>
                <p className="text-xs text-red-700 leading-relaxed">
                  Image quality failed optical thresholds (Defocus / Blur). To prevent misdiagnosis, AI grading is halted until fundus recapture is completed.
                </p>
              </div>
              <button 
                onClick={() => handleSelectDemo('DEMO-003')}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Try Gradable Demo Case (DEMO-003)
              </button>
            </div>
          ) : (
            <>
              {/* 2. Retinal Viewer (Original, Enhanced, Grad-CAM, Lesions, Vessels) */}
              <RetinaViewer 
                originalUrl={activeCase.images.original}
                drLevel={activeCase.dr_classification.predicted_grade}
                qualityStatus={activeCase.quality.status}
              />

              {/* 3. Classification & Referable Status Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DRClassificationCard classification={activeCase.dr_classification} />
                </div>
                <div>
                  <ReferableCard classification={activeCase.dr_classification} />
                </div>
              </div>

              {/* 4. Lesion Analysis & Explainable AI Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LesionAnalysisCard lesions={activeCase.lesions} />
                <ExplainableAICard 
                  gradcamUrl={activeCase.images.gradcam} 
                  drLevel={activeCase.dr_classification.predicted_grade} 
                />
              </div>

              {/* 5. Confidence System & Clinician Review Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <ConfidenceCard calibration={activeCase.calibration} />
                </div>
                <div className="lg:col-span-2">
                  <ClinicianReviewCard 
                    screeningCase={activeCase}
                    onReviewSaved={(updated) => setActiveCase(updated)}
                  />
                </div>
              </div>
            </>
          )}

        </div>
      )}

      {/* Report Modal */}
      {showReportModal && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute -top-4 -right-4 z-10 p-2 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800"
            >
              ✕
            </button>
            <ReportPreview screeningCase={activeCase} />
          </div>
        </div>
      )}

    </div>
  );
};
