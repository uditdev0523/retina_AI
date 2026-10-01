import React, { useState, useMemo } from 'react';
import { TelemedicineSimParams } from '../types/screening';
import { calculateTelemedicineCapacity } from '../services/telemedicineSim';
import { Radio, Camera, Wifi, Cpu, UserCheck, AlertTriangle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export const TelemedicinePage: React.FC = () => {
  const [params, setParams] = useState<TelemedicineSimParams>({
    patients_year: 100000,
    cameras: 25,
    images_per_camera_day: 150,
    bandwidth_mbps: 10,
    ai_workers: 4,
    doctors: 10,
    review_time_sec: 30,
    inference_time_sec: 2
  });

  const simResults = useMemo(() => calculateTelemedicineCapacity(params), [params]);

  const handlePreset = (presetName: 'low' | 'standard' | 'high') => {
    if (presetName === 'low') {
      setParams({
        patients_year: 50000,
        cameras: 8,
        images_per_camera_day: 100,
        bandwidth_mbps: 2,
        ai_workers: 1,
        doctors: 3,
        review_time_sec: 45,
        inference_time_sec: 4
      });
    } else if (presetName === 'standard') {
      setParams({
        patients_year: 100000,
        cameras: 25,
        images_per_camera_day: 150,
        bandwidth_mbps: 10,
        ai_workers: 4,
        doctors: 10,
        review_time_sec: 30,
        inference_time_sec: 2
      });
    } else {
      setParams({
        patients_year: 250000,
        cameras: 60,
        images_per_camera_day: 200,
        bandwidth_mbps: 50,
        ai_workers: 12,
        doctors: 25,
        review_time_sec: 20,
        inference_time_sec: 1
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rural Telemedicine Capacity Simulator</h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate end-to-end rural tele-ophthalmology throughput, network bottlenecks, and resource allocation
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase px-2">Presets:</span>
          <button
            onClick={() => handlePreset('low')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Low Resource
          </button>
          <button
            onClick={() => handlePreset('standard')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-medical-600 text-white shadow-sm"
          >
            Standard PHC
          </button>
          <button
            onClick={() => handlePreset('high')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            High Capacity
          </button>
        </div>
      </div>

      {/* Visual End-to-End Pipeline Workflow */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-medical-400 animate-pulse" />
            Rural Tele-Ophthalmology Workflow Pipeline
          </h3>
          <span className="text-xs text-slate-400">Bottleneck Highlighted Below</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">1. Patient</div>
            <div className="text-xs font-bold text-white mt-1">Rural PHC</div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${simResults.bottleneck === 'CAMERA' ? 'bg-red-950 border-red-500 ring-2 ring-red-500/50' : 'bg-slate-850 border-slate-750'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase">2. Fundus Camera</div>
            <div className="text-xs font-bold text-white mt-1">{params.cameras} Cameras</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">3. Image Upload</div>
            <div className="text-xs font-bold text-white mt-1">4.5 MB / Image</div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${simResults.bottleneck === 'NETWORK' ? 'bg-red-950 border-red-500 ring-2 ring-red-500/50' : 'bg-slate-850 border-slate-750'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase">4. Network</div>
            <div className="text-xs font-bold text-white mt-1">{params.bandwidth_mbps} Mbps</div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${simResults.bottleneck === 'AI' ? 'bg-red-950 border-red-500 ring-2 ring-red-500/50' : 'bg-slate-850 border-slate-750'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase">5. AI Screening</div>
            <div className="text-xs font-bold text-white mt-1">{params.inference_time_sec}s / Image</div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${simResults.bottleneck === 'DOCTOR' ? 'bg-red-950 border-red-500 ring-2 ring-red-500/50' : 'bg-slate-850 border-slate-750'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase">6. Review</div>
            <div className="text-xs font-bold text-white mt-1">{params.doctors} Doctors</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-center">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">7. Referral</div>
            <div className="text-xs font-bold text-white mt-1">{simResults.annual_referrals_generated.toLocaleString()} / Yr</div>
          </div>

        </div>
      </div>

      {/* Main Grid: Left Interactive Sliders, Right Simulated Output Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Interactive Parameter Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Simulation Controls</h3>
            <p className="text-xs text-slate-500">Adjust parameters to model capacity</p>
          </div>

          <div className="space-y-4">
            
            {/* 1. Target Patients */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Annual Target Patients:</span>
                <span className="font-mono text-medical-600 font-bold">{params.patients_year.toLocaleString()}</span>
              </div>
              <input
                type="range" min="10000" max="500000" step="10000"
                value={params.patients_year}
                onChange={(e) => setParams({ ...params, patients_year: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

            {/* 2. Fundus Cameras */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Fundus Cameras Count:</span>
                <span className="font-mono text-medical-600 font-bold">{params.cameras}</span>
              </div>
              <input
                type="range" min="1" max="100" step="1"
                value={params.cameras}
                onChange={(e) => setParams({ ...params, cameras: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

            {/* 3. Images per camera per day */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Images / Camera / Day:</span>
                <span className="font-mono text-medical-600 font-bold">{params.images_per_camera_day}</span>
              </div>
              <input
                type="range" min="20" max="300" step="10"
                value={params.images_per_camera_day}
                onChange={(e) => setParams({ ...params, images_per_camera_day: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

            {/* 4. Network Bandwidth */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Network Bandwidth (Mbps):</span>
                <span className="font-mono text-medical-600 font-bold">{params.bandwidth_mbps} Mbps</span>
              </div>
              <input
                type="range" min="1" max="100" step="1"
                value={params.bandwidth_mbps}
                onChange={(e) => setParams({ ...params, bandwidth_mbps: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

            {/* 5. AI Workers */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">AI Inference Instances:</span>
                <span className="font-mono text-medical-600 font-bold">{params.ai_workers}</span>
              </div>
              <input
                type="range" min="1" max="20" step="1"
                value={params.ai_workers}
                onChange={(e) => setParams({ ...params, ai_workers: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

            {/* 6. Ophthalmologists */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Available Ophthalmologists:</span>
                <span className="font-mono text-medical-600 font-bold">{params.doctors}</span>
              </div>
              <input
                type="range" min="1" max="50" step="1"
                value={params.doctors}
                onChange={(e) => setParams({ ...params, doctors: parseInt(e.target.value) })}
                className="w-full accent-medical-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Right Output Results & Optimization Metrics (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Output Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Capacity</span>
              <div className="text-2xl font-black text-slate-900">
                {simResults.annual_patients_processed.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">Target: {params.patients_year.toLocaleString()}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Throughput</span>
              <div className="text-2xl font-black text-medical-600">
                {simResults.daily_capacity.toLocaleString()} / Day
              </div>
              <span className="text-[11px] text-slate-500">Across {params.cameras} Cameras</span>
            </div>

            <div className="p-5 bg-red-50 rounded-2xl border border-red-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-red-700 uppercase">System Bottleneck</span>
              <div className="text-xl font-black text-red-900">
                {simResults.bottleneck} STAGE
              </div>
              <span className="text-[11px] text-red-700 font-medium">Restricts overall capacity</span>
            </div>

          </div>

          {/* Resource Utilization Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Stage Utilization Breakdown</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Camera Utilization ({params.cameras} Cameras):</span>
                  <span className="font-mono text-slate-900 font-bold">{simResults.utilization.camera_utilization}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${simResults.utilization.camera_utilization}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Network Transmission ({params.bandwidth_mbps} Mbps):</span>
                  <span className="font-mono text-slate-900 font-bold">{simResults.utilization.network_utilization}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${simResults.utilization.network_utilization}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">AI Processing Worker ({params.ai_workers} Instances):</span>
                  <span className="font-mono text-slate-900 font-bold">{simResults.utilization.ai_utilization}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${simResults.utilization.ai_utilization}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Doctor Review Queue ({params.doctors} Ophthalmologists):</span>
                  <span className="font-mono text-slate-900 font-bold">{simResults.utilization.doctor_utilization}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${simResults.utilization.doctor_utilization}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Recommendation Box */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900">
            <div className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Resource Optimization Recommendation to Meet {params.patients_year.toLocaleString()} Patients/Year:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cameras</span>
                <div className="font-extrabold text-slate-900 text-sm">{simResults.resource_optimization.recommended_cameras}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bandwidth</span>
                <div className="font-extrabold text-slate-900 text-sm">{simResults.resource_optimization.recommended_bandwidth_mbps} Mbps</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">AI Workers</span>
                <div className="font-extrabold text-slate-900 text-sm">{simResults.resource_optimization.recommended_ai_workers}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Doctors</span>
                <div className="font-extrabold text-slate-900 text-sm">{simResults.resource_optimization.recommended_doctors}</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
