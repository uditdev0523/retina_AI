import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  ShieldCheck, 
  Cpu, 
  UserCheck, 
  Radio, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Activity,
  PlayCircle
} from 'lucide-react';

interface LandingPageProps {
  onOpenDemoModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDemoModal }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-medical-500 selection:text-white">
      
      {/* Landing Navbar */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-medical-400 flex items-center justify-center text-white shadow-lg shadow-medical-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-xl">RetinaAI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:scale-105"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Judge Demo</span>
          </button>
          <Link
            to="/login"
            className="px-4 py-2 bg-medical-600 hover:bg-medical-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 max-w-6xl mx-auto text-center space-y-8 flex-1 flex flex-col justify-center">
        
        {/* Subheader pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-950/80 border border-medical-700/60 text-xs font-semibold text-medical-300 mx-auto">
          <Sparkles className="w-4 h-4 text-medical-400" />
          <span>AI-Assisted Diabetic Retinopathy Screening</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Powered Diabetic Retinopathy Screening
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Fast, explainable retinal screening designed for scalable healthcare delivery in resource-constrained environments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/screening"
            className="flex items-center gap-2 px-6 py-3.5 bg-medical-600 hover:bg-medical-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-medical-900/50 hover:scale-105 transition-all"
          >
            <span>Start Screening</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-2xl text-base border border-slate-700 transition-all hover:text-white"
          >
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Retinal Illustration Preview Canvas Card */}
        <div className="pt-10 max-w-3xl mx-auto">
          <div className="p-2 bg-slate-800/80 rounded-3xl border border-slate-700 shadow-2xl relative group overflow-hidden">
            <div className="relative aspect-video rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
              <img 
                src={`${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`}
                alt="Retinal Fundus Preview" 
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
              
              {/* Overlay Badges */}
              <div className="absolute bottom-6 left-6 text-left space-y-1">
                <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
                  Level 2 — Moderate NPDR Detected
                </span>
                <p className="text-xs text-slate-300">Grad-CAM Spatial Heatmap & Biomarker Evidence</p>
              </div>

              <div className="absolute top-6 right-6">
                <span className="text-xs font-bold text-emerald-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Quality Passed (92%)
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 4 Value Propositions Section */}
      <section className="bg-slate-950 py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Designed for Scalable Clinical Telemedicine
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Built around four foundational pillars to empower primary healthcare workers across rural PHC centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Reliable */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold border border-emerald-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">1. Reliable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated image-quality assessment before diagnosis prevents false predictions on blurry images.
              </p>
            </div>

            {/* 2. Explainable */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-medical-950 text-medical-400 flex items-center justify-center font-bold border border-medical-800">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">2. Explainable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI decisions supported by Grad-CAM attention heatmaps and quantified lesion biomarker evidence.
              </p>
            </div>

            {/* 3. Clinician-Centered */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold border border-purple-800">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">3. Clinician-Centered</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Human-in-the-loop workflow keeps doctors in control with one-click verification and sign-off.
              </p>
            </div>

            {/* 4. Scalable */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold border border-amber-800">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">4. Scalable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed around rural telemedicine capacity to handle 100,000+ patient screenings annually.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        AI-Based Diabetic Retinopathy Screening Prototype
      </footer>

    </div>
  );
};
