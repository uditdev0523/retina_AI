import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RECENT_CASES } from '../data/patientsData';
import { Search, Filter, ArrowUpRight, Users, ChevronRight } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [referableFilter, setReferableFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCases = RECENT_CASES.filter((c) => {
    const matchesSearch = 
      c.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.facility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = gradeFilter === 'ALL' || c.dr_classification.predicted_grade.toString() === gradeFilter;
    const matchesReferable = referableFilter === 'ALL' || (referableFilter === 'YES' ? c.dr_classification.is_referable : !c.dr_classification.is_referable);
    const matchesStatus = statusFilter === 'ALL' || c.review_status === statusFilter;

    return matchesSearch && matchesGrade && matchesReferable && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Patient & Case Registry</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage rural screening records, triage referrals, and clinical review statuses
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, ID, case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-medical-500 outline-none"
            />
          </div>

          {/* DR Grade Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
            >
              <option value="ALL">All DR Levels</option>
              <option value="0">Level 0 — No DR</option>
              <option value="1">Level 1 — Mild NPDR</option>
              <option value="2">Level 2 — Moderate NPDR</option>
              <option value="3">Level 3 — Severe NPDR</option>
              <option value="4">Level 4 — Proliferative DR</option>
            </select>
          </div>

          {/* Referable Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={referableFilter}
              onChange={(e) => setReferableFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
            >
              <option value="ALL">All Referral Statuses</option>
              <option value="YES">Referable DR</option>
              <option value="NO">Non-Referable DR</option>
            </select>
          </div>

          {/* Review Status Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RECAPTURE_REQUIRED">Recapture Required</option>
            </select>
          </div>

        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredCases.length}</strong> patient records</span>
          <span className="font-mono">Sync Status: Live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Patient Info</th>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">DR Grade</th>
                <th className="py-3.5 px-4">Referable</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Quality</th>
                <th className="py-3.5 px-4">Review Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.case_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    <div>{c.patient.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">ID: {c.patient.id} | {c.patient.age}Y, {c.patient.gender}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{c.case_id}</td>
                  <td className="py-3.5 px-4 text-slate-500">{c.screening_date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${c.dr_classification.predicted_grade >= 2 ? 'text-amber-700' : 'text-slate-700'}`}>
                      Level {c.dr_classification.predicted_grade} ({c.dr_classification.grade_label.split(' ')[0]})
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.quality.status === 'UNGRADABLE' ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {c.quality.status}
                    </span>
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
                      <span>Open Screening</span>
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
