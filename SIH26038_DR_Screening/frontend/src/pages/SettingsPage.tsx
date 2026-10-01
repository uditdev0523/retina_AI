import React, { useState } from 'react';
import { Settings, Shield, Sliders, Bell, Globe, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [qualityThreshold, setQualityThreshold] = useState(75);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure screening quality thresholds, notification triggers, and telemedicine facility preferences
        </p>
      </div>

      {/* 1. Screening Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-medical-600" />
          <h3 className="font-bold text-base text-slate-900">Screening & AI Thresholds</h3>
        </div>

        <div className="space-y-4 text-xs">
          
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700">Minimum AI Confidence Cutoff:</span>
              <span className="font-mono text-medical-600 font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range" min="50" max="95" step="5"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
              className="w-full accent-medical-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Cases below this confidence trigger mandatory human review.</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700">Image Quality Filter Score Cutoff:</span>
              <span className="font-mono text-medical-600 font-bold">{qualityThreshold}%</span>
            </div>
            <input
              type="range" min="50" max="90" step="5"
              value={qualityThreshold}
              onChange={(e) => setQualityThreshold(parseInt(e.target.value))}
              className="w-full accent-medical-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Images scoring below this value are marked UNGRADABLE.</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="font-bold text-slate-900">Auto-Run AI Analysis on Upload</div>
              <div className="text-[11px] text-slate-500">Automatically trigger feature extraction when image is dropped.</div>
            </div>
            <input
              type="checkbox"
              checked={autoAnalysis}
              onChange={(e) => setAutoAnalysis(e.target.checked)}
              className="w-4 h-4 accent-medical-600 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* 2. Facility & Location */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-5 h-5 text-medical-600" />
          <h3 className="font-bold text-base text-slate-900">Facility & Telemedicine Configuration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Screening Outpost:</label>
            <input
              type="text"
              defaultValue="Wardha CHC Rural Hub"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">District Telemedicine Node:</label>
            <input
              type="text"
              defaultValue="Nagpur Vitreoretinal Regional Center"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Privacy Notice Card */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
          <Shield className="w-4 h-4" />
          Privacy & Demonstration Compliance Notice
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This prototype operates locally in demonstration mode. Uploaded retinal fundus images and simulated patient records are processed entirely in-browser and are not permanently saved to external servers unless configured.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {saved ? (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        ) : <div></div>}

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
        >
          Save Settings
        </button>
      </div>

    </div>
  );
};
