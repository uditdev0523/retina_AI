import React from 'react';
import { Eye, ShieldCheck, Cpu, UserCheck, Radio, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-200">
          <Sparkles className="w-4 h-4 text-medical-600" />
          <span>Diabetic Retinopathy Screening Platform</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          AI-Based Diabetic Retinopathy Screening for Rural India
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          An end-to-end, clinician-centered tele-ophthalmology platform for early DR detection in resource-constrained primary healthcare centers (PHC).
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problem */}
        <div className="p-6 bg-red-50/60 rounded-2xl border border-red-200 space-y-3">
          <h3 className="font-bold text-lg text-red-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red-600" />
            The Rural Challenge
          </h3>
          <p className="text-xs text-red-900 leading-relaxed">
            Over 77 million adults in India live with diabetes, making Diabetic Retinopathy (DR) a leading cause of preventable blindness. Rural areas face a severe deficit of trained ophthalmologists (ratio &lt;1 per 250,000 residents), leading to late-stage presentation when vision loss is irreversible.
          </p>
        </div>

        {/* Solution */}
        <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
          <h3 className="font-bold text-lg text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            The AI-Assisted Solution
          </h3>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Our platform equips frontline health workers (ASHA / PHC nurses) with non-mydriatic fundus cameras linked to an intelligent AI triage system. It filters bad images, predicts ETDRS DR severity levels 0–4, overlays Grad-CAM explainability heatmaps, and routes referable cases to specialists.
          </p>
        </div>

      </div>

      {/* Architecture Highlights */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-900">7-Layer Core System Architecture</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">1. Optical Quality Filter</div>
            <div className="text-slate-500">Focus, illumination, and contrast assessment before grading.</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">2. Preprocessing & CLAHE</div>
            <div className="text-slate-500">Adaptive contrast equalization & green channel vessel enhancement.</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">3. Multi-Class Classifier</div>
            <div className="text-slate-500">Deep neural network grading fundus image across ETDRS Levels 0–4.</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">4. Biomarker Quantification</div>
            <div className="text-slate-500">Detection of microaneurysms, hard exudates, hemorrhages.</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">5. Grad-CAM Explainability</div>
            <div className="text-slate-500">Visual attention heatmaps showing spatial features guiding AI.</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">6. Clinician Review</div>
            <div className="text-slate-500">Human-in-the-loop sign-off with agree/modify/escalate choices.</div>
          </div>
        </div>
      </div>

    </div>
  );
};
