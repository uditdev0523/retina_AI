import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DASHBOARD_STATS, 
  MONTHLY_VOLUME_DATA, 
  SEVERITY_DISTRIBUTION_DATA, 
  QUALITY_DISTRIBUTION_DATA 
} from '../data/analyticsData';
import { RECENT_CASES } from '../data/patientsData';
import { 
  Users, 
  ShieldAlert, 
  XCircle, 
  Clock, 
  CheckCircle2, 
  Scan, 
  ArrowUpRight,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  ChevronRight
} from 'lucide-react';
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
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Screening Overview Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry across rural tele-ophthalmology screening outposts
          </p>
        </div>

        <Link
          to="/screening"
          className="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105 shrink-0"
        >
          <Scan className="w-4 h-4" />
          <span>Start New Screening</span>
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Patients Screened */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Patients Screened</span>
            <div className="p-2 rounded-xl bg-medical-50 text-medical-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {DASHBOARD_STATS.totalScreened.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>+14.2% from last month</span>
          </div>
        </div>

        {/* 2. Referable DR */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Referable DR Cases</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {DASHBOARD_STATS.referableCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            17.5% referral rate (Level 2–4)
          </div>
        </div>

        {/* 3. Ungradable Images */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ungradable Images</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">
            {DASHBOARD_STATS.ungradableCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-red-600 font-medium">
            3.3% rate (Recapture required)
          </div>
        </div>

        {/* 4. Pending Reviews */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {DASHBOARD_STATS.pendingReviews}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Ophthalmologist queue
          </div>
        </div>

        {/* 5. Screening Accuracy */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Screening Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            94.8%
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Demo / Validation Dataset
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Screening Volume Trend Area Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Monthly Rural Screening Volume</h3>
              <p className="text-xs text-slate-500">Total screened patients vs referable cases</p>
            </div>
            <span className="text-xs text-medical-600 font-semibold bg-medical-50 px-2.5 py-1 rounded-md border border-medical-200">
              2025–2026 Volume
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_VOLUME_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScreened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0270c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0270c7" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorReferable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="screened" stroke="#0270c7" fillOpacity={1} fill="url(#colorScreened)" name="Total Screened" />
                <Area type="monotone" dataKey="referable" stroke="#f59e0b" fillOpacity={1} fill="url(#colorReferable)" name="Referable DR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">DR Severity Breakdown</h3>
            <p className="text-xs text-slate-500">Level 0 to 4 ETDRS distribution</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SEVERITY_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {SEVERITY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [val.toLocaleString(), 'Cases']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-32 overflow-y-auto">
            {SEVERITY_DISTRIBUTION_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-900 font-bold">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Screening Cases Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Screening Cases</h3>
            <p className="text-xs text-slate-500">Live patient cases processed across mobile tele-units</p>
          </div>
          <Link
            to="/patients"
            className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1"
          >
            <span>View All Patients</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Patient</th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">DR Level</th>
                <th className="py-3 px-4">Referable</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_CASES.map((c) => (
                <tr key={c.case_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    <div>{c.patient.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">ID: {c.patient.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{c.case_id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${c.dr_classification.predicted_grade >= 2 ? 'text-amber-700' : 'text-slate-700'}`}>
                      Level {c.dr_classification.predicted_grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.dr_classification.is_referable ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                        REFERABLE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        NON-REFERABLE
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {(c.dr_classification.raw_confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {c.review_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/screening?demo=${c.case_id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-800"
                    >
                      <span>Review</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
