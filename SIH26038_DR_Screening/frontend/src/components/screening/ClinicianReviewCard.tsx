import React, { useState } from 'react';
import { ScreeningCase, ReviewAction, DRLevel } from '../../types/screening';
import { submitClinicianReview } from '../../services/api';
import { UserCheck, CheckCircle2, Edit3, XCircle, AlertTriangle, Save, Loader2 } from 'lucide-react';

interface ClinicianReviewCardProps {
  screeningCase: ScreeningCase;
  onReviewSaved?: (updatedCase: ScreeningCase) => void;
}

export const ClinicianReviewCard: React.FC<ClinicianReviewCardProps> = ({ 
  screeningCase, 
  onReviewSaved 
}) => {
  const [selectedAction, setSelectedAction] = useState<'AGREE' | 'MODIFY' | 'INADEQUATE' | 'ESCALATE'>('AGREE');
  const [modifiedGrade, setModifiedGrade] = useState<DRLevel>(screeningCase.dr_classification.predicted_grade);
  const [reviewerName, setReviewerName] = useState('Dr. A. Sharma (Ophthalmologist)');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveReview = async () => {
    setIsSaving(true);
    try {
      const res = await submitClinicianReview({
        case_id: screeningCase.case_id,
        action: selectedAction,
        modified_grade: selectedAction === 'MODIFY' ? modifiedGrade : undefined,
        reviewer: reviewerName,
        comments: notes
      });

      if (res.success) {
        setSavedSuccess(true);
        if (onReviewSaved) {
          const updated: ScreeningCase = {
            ...screeningCase,
            review_status: selectedAction === 'ESCALATE' ? 'ESCALATED' : 'REVIEWED',
            clinician_review: res.review
          };
          onReviewSaved(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-medical-600" />
            Clinical Review — Human-in-the-Loop Verification
          </h3>
          <p className="text-xs text-slate-500">Ophthalmologist verification and final sign-off</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Physician Oversight
        </span>
      </div>

      {/* Human-in-the-Loop Workflow Flow Banner */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <span className="w-6 h-6 rounded-full bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-[10px]">1</span>
          <span>AI Assessment</span>
        </div>
        <span className="text-slate-400 font-bold">→</span>
        <div className="flex items-center gap-2 font-semibold text-medical-600">
          <span className="w-6 h-6 rounded-full bg-medical-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
          <span>Clinician Review</span>
        </div>
        <span className="text-slate-400 font-bold">→</span>
        <div className="flex items-center gap-2 font-semibold text-slate-500">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">3</span>
          <span>Final Sign-Off</span>
        </div>
      </div>

      {/* Decision Action Buttons */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Select Review Action:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            type="button"
            onClick={() => setSelectedAction('AGREE')}
            className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
              selectedAction === 'AGREE'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Agree with AI</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction('MODIFY')}
            className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
              selectedAction === 'MODIFY'
                ? 'bg-medical-600 text-white border-medical-600 shadow-md ring-2 ring-medical-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Modify Result</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction('INADEQUATE')}
            className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
              selectedAction === 'INADEQUATE'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Image Inadequate</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction('ESCALATE')}
            className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
              selectedAction === 'ESCALATE'
                ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Escalate Case</span>
          </button>

        </div>
      </div>

      {/* Modify grade select if MODIFY selected */}
      {selectedAction === 'MODIFY' && (
        <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl space-y-2">
          <label className="block text-xs font-bold text-medical-900">Select Override DR Grade:</label>
          <select
            value={modifiedGrade}
            onChange={(e) => setModifiedGrade(parseInt(e.target.value) as DRLevel)}
            className="w-full p-2 bg-white border border-medical-300 rounded-lg text-sm font-semibold text-slate-900"
          >
            <option value={0}>Level 0 — No DR</option>
            <option value={1}>Level 1 — Mild NPDR</option>
            <option value={2}>Level 2 — Moderate NPDR</option>
            <option value={3}>Level 3 — Severe NPDR</option>
            <option value={4}>Level 4 — Proliferative DR</option>
          </select>
        </div>
      )}

      {/* Reviewer name & Clinical notes textarea */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reviewing Ophthalmologist:</label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes & Impression:</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add clinical observation notes, macular involvement evaluation, or follow-up instructions..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-medical-500 outline-none"
          />
        </div>
      </div>

      {/* Save Review Footer */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess ? (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Review Saved Successfully!
          </span>
        ) : (
          <span className="text-xs text-slate-400">Review sign-off will be attached to report.</span>
        )}

        <button
          type="button"
          onClick={handleSaveReview}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Review</span>
        </button>
      </div>

    </div>
  );
};
