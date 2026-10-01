import React from 'react';
import { 
  MONTHLY_VOLUME_DATA, 
  SEVERITY_DISTRIBUTION_DATA, 
  QUALITY_DISTRIBUTION_DATA,
  CONFIDENCE_HISTOGRAM_DATA 
} from '../data/analyticsData';
import { BarChart3, TrendingUp, PieChart as PieIcon, ShieldAlert, Activity, Info } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Screening Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Population-level diabetic retinopathy epidemiological trends across rural clinics
          </p>
        </div>

        <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo dataset — values are illustrative</span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Daily Screenings</span>
          <div className="text-2xl font-black text-slate-900">41.6 Patients</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+8.4% capacity utilization</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Referral Conversion Rate</span>
          <div className="text-2xl font-black text-amber-600">17.5%</div>
          <span className="text-[11px] text-slate-500 font-medium">Moderate to Severe NPDR + PDR</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Ungradable Image Rate</span>
          <div className="text-2xl font-black text-slate-900">3.3%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Well below 5% target limit</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Physician Review Rate</span>
          <div className="text-2xl font-black text-medical-600">98.2%</div>
          <span className="text-[11px] text-slate-500 font-medium">Completed within 24 hours</span>
        </div>

      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Volume Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Screening Volume & Referral Trends</h3>
            <p className="text-xs text-slate-500">Monthly patient volume vs referable DR cases</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_VOLUME_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="anVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0270c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0270c7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="screened" stroke="#0270c7" fillOpacity={1} fill="url(#anVol)" name="Screened Patients" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Model Confidence Histogram */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Model Confidence Distribution</h3>
            <p className="text-xs text-slate-500">Frequency distribution of AI inference confidence scores</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONFIDENCE_HISTOGRAM_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Patient Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Quality Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Image Quality Assessment Distribution</h3>
            <p className="text-xs text-slate-500">Good, Borderline vs Ungradable fundus photo quality</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={QUALITY_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {QUALITY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Severity Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">DR Severity Stage Distribution</h3>
            <p className="text-xs text-slate-500">ETDRS scale breakdown across screening cohort</p>
          </div>

          <div className="space-y-2 pt-2">
            {SEVERITY_DISTRIBUTION_DATA.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-slate-900 font-mono">{item.percentage}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: item.percentage, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
