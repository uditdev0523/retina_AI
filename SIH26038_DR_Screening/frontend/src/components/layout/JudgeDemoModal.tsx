import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Radio, 
  ArrowRight 
} from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: "1. Problem & Context",
      subtitle: "Diabetic Retinopathy in Rural India",
      desc: "77+ million diabetic patients in India face a shortage of retinal specialists in rural areas. Late detection causes irreversible blindness. Our solution automates early screening at PHC sub-centers.",
      actionLabel: "View Overview",
      actionPath: "/"
    },
    {
      title: "2. Retinal Image Upload",
      subtitle: "Fundus Camera Integration & Pre-Validation",
      desc: "The system accepts non-mydriatic fundus camera photographs via drag-and-drop or batch transfer. Standard PNG, JPG, and DICOM formats are supported.",
      actionLabel: "Open Screening Page",
      actionPath: "/screening"
    },
    {
      title: "3. Image Quality Assessment",
      subtitle: "Preventing False AI Predictions",
      desc: "Before grading, an automated Quality Filter analyzes Focus (92%), Illumination (88%), Field of View (96%), and Contrast (90%). Poor images are immediately flagged as UNGRADABLE with a recapture recommendation.",
      actionLabel: "Test Demo-006 (Ungradable)",
      actionPath: "/screening?demo=DEMO-006"
    },
    {
      title: "4. Image Enhancement",
      subtitle: "CLAHE & Illumination Normalization",
      desc: "Applies Contrast-Limited Adaptive Histogram Equalization, green-channel isolation, and denoising to boost vessel & microaneurysm contrast for enhanced clinical clarity.",
      actionLabel: "Inspect Enhanced Fundus",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "5. DR Grading (Level 0–4)",
      subtitle: "Deep Multi-Class Retinal Classification",
      desc: "Classifies the fundus image into standard ETDRS scale: Level 0 (No DR), Level 1 (Mild NPDR), Level 2 (Moderate NPDR), Level 3 (Severe NPDR), and Level 4 (Proliferative DR).",
      actionLabel: "View DR Level 2 Result",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "6. Referable DR Decision",
      subtitle: "Triage & Clinical Referral Workflow",
      desc: "Levels 0-1 are classified as Non-Referable (routine annual re-screen). Levels 2-4 trigger immediate REFERABLE status for ophthalmologist follow-up.",
      actionLabel: "View Referable Triage",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "7. Lesion Evidence Detection",
      subtitle: "Automated Detection of DR Biomarkers",
      desc: "Quantifies microaneurysms (e.g. 14 detected), hard exudates (6 detected), hemorrhages (3 detected), and checks for neovascularization with confidence metrics.",
      actionLabel: "View Lesion Analytics",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "8. Explainable AI (Grad-CAM)",
      subtitle: "Spatial Attention Maps for Clinician Trust",
      desc: "Generates Grad-CAM visual heatmaps overlaying the fundus image, demonstrating exactly which retinal regions guided the neural network's diagnosis.",
      actionLabel: "View Heatmap Overlay",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "9. Confidence & Calibration",
      subtitle: "Reliability Guarantee",
      desc: "Calculates calibrated model confidence (e.g. 94.2% HIGH). Cases falling below confidence thresholds are automatically flagged for mandatory expert review.",
      actionLabel: "Check Confidence Score",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "10. Clinician Review (Human-in-the-Loop)",
      subtitle: "Ophthalmologist Verification",
      desc: "Allows doctors to Agree with AI, Modify Result, Mark Inadequate, or Escalate. Keeps the physician in full control before issuing final clinical report.",
      actionLabel: "Try Clinician Review",
      actionPath: "/screening?demo=DEMO-003"
    },
    {
      title: "11. Screening Report Generation",
      subtitle: "Audit-Ready Clinical Documentation",
      desc: "Generates a complete, print-ready PDF/HTML medical report containing patient demography, image quality, AI findings, Grad-CAM snapshot, and doctor signature.",
      actionLabel: "Generate Screening Report",
      actionPath: "/reports"
    },
    {
      title: "12. Rural Telemedicine Capacity Simulator",
      subtitle: "Scalability for 100,000+ Rural Patients/Year",
      desc: "Simulates daily camera throughput, bandwidth network limits, AI worker instances, and doctor review bottlenecks across rural healthcare networks.",
      actionLabel: "Launch Telemedicine Sim",
      actionPath: "/telemedicine"
    }
  ];

  const step = demoSteps[currentStep];

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExecuteAction = () => {
    onClose();
    navigate(step.actionPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-amber-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Guided Demonstration Mode</h3>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                  Step {currentStep + 1} of {demoSteps.length}
                </span>
              </div>
              <p className="text-xs text-amber-100">2-Minute Interactive Feature Walk-through</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {demoSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-amber-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              {step.title}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{step.subtitle}</h2>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {step.desc}
          </p>

          {/* Quick Jump Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Jump to Step:</div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-100 rounded-xl">
              {demoSteps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    idx === currentStep
                      ? 'bg-amber-500 text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleExecuteAction}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all"
          >
            <span>{step.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === demoSteps.length - 1}
            className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
