import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ProcessingPipelineProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({ isProcessing, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: 'Image Upload & Decoding', detail: 'Fundus format verification' },
    { label: 'Image Quality Assessment', detail: 'Focus, illumination, contrast filter' },
    { label: 'Image Enhancement (CLAHE)', detail: 'Denoising & vessel contrast optimization' },
    { label: 'Retinal Structure Segmentation', detail: 'Optic disc & foveal localization' },
    { label: 'Lesion Detection Analysis', detail: 'Microaneurysms, exudates & hemorrhages' },
    { label: 'DR Multi-Class Classification', detail: 'Deep ETDRS severity grading Level 0-4' },
    { label: 'Explainability Map Generation', detail: 'Grad-CAM spatial attention computation' },
    { label: 'Clinical Review Ready', detail: 'Report & triage recommendations compiled' },
  ];

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStepIndex(steps.length);
      return;
    }

    setCurrentStepIndex(0);
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return steps.length;
        }
      });
    }, 400); // realistic smooth sequence (~3.2 sec total)

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing && currentStepIndex === steps.length) {
    return null; // hide or keep minimized when finished
  }

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 my-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            {currentStepIndex < steps.length ? (
              <Loader2 className="w-5 h-5 text-medical-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            AI Screening Pipeline Execution
          </h3>
          <p className="text-xs text-slate-400">Processing fundus retina through deep neural networks</p>
        </div>
        <span className="text-xs font-semibold bg-medical-950 text-medical-300 px-3 py-1 rounded-full border border-medical-700">
          {Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100))}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-gradient-to-r from-medical-500 to-emerald-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex || currentStepIndex === steps.length;
          const isCurrent = idx === currentStepIndex && currentStepIndex < steps.length;
          
          return (
            <div 
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-slate-850/80 border-emerald-500/30 text-slate-300' 
                  : isCurrent 
                    ? 'bg-medical-950 border-medical-500 text-white shadow-lg ring-1 ring-medical-500/50' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-medical-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                )}
                <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-white' : ''}`}>
                  {step.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pl-6 line-clamp-1">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
