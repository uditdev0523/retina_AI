import os
import datetime

class ReportGenerator:
    def __init__(self, output_dir=None):
        self.output_dir = output_dir or os.path.join(os.path.dirname(__file__), "..", "data", "processed")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_report(self, case_id, quality_res, dr_res, lesion_res, struct_res, calib_res, review_data=None):
        """
        Generates structured clinical diabetic retinopathy screening report.
        """
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        report_md = f"""================================================================================
          SMART INDIA HACKATHON 2026 — CLINICAL SCREENING REPORT
           SIH26038: EXPLAINABLE AI DIABETIC RETINOPATHY SYSTEM
================================================================================

Case ID:               {case_id}
Date & Time:           {now}
Facility / Telecenter: Rural Health Clinic Tele-node #402

--------------------------------------------------------------------------------
1. IMAGE QUALITY ASSESSMENT
--------------------------------------------------------------------------------
Focus Sharpness:       {quality_res.get('focus_status', 'N/A')} ({quality_res.get('focus_score', 0)}/100)
Illumination:          {quality_res.get('illumination_status', 'N/A')} ({quality_res.get('illumination_score', 0)}/100)
Field of View:         {quality_res.get('fov_status', 'N/A')} ({quality_res.get('fov_score', 0)}/100)
Contrast:              {quality_res.get('contrast_status', 'N/A')} ({quality_res.get('contrast_score', 0)}/100)
Overall Score:         {quality_res.get('overall_score', 0)} / 100
Quality Status:        {quality_res.get('status', 'GRADABLE')}

Recommendation:        {quality_res.get('recommendation', 'Proceed with screening')}

--------------------------------------------------------------------------------
2. AI DIABETIC RETINOPATHY ASSESSMENT
--------------------------------------------------------------------------------
Predicted DR Grade:    {dr_res.get('grade_label', 'N/A')}
Referable DR Decision: {dr_res.get('referable_status', 'N/A')}
Raw Model Confidence:  {dr_res.get('raw_confidence', 0)}%
Calibrated Confidence: {calib_res.get('calibrated_confidence', 0)}% ({calib_res.get('category', 'HIGH')} RELIABILITY)

Grade Probabilities:
- Level 0 (No DR):           {dr_res.get('probabilities', {}).get('Level 0 (No DR)', 0)}%
- Level 1 (Mild NPDR):       {dr_res.get('probabilities', {}).get('Level 1 (Mild NPDR)', 0)}%
- Level 2 (Moderate NPDR):   {dr_res.get('probabilities', {}).get('Level 2 (Moderate NPDR)', 0)}%
- Level 3 (Severe NPDR):     {dr_res.get('probabilities', {}).get('Level 3 (Severe NPDR)', 0)}%
- Level 4 (Proliferative):   {dr_res.get('probabilities', {}).get('Level 4 (Proliferative DR)', 0)}%

--------------------------------------------------------------------------------
3. CLINICAL LESION EVIDENCE FINDINGS
--------------------------------------------------------------------------------
Microaneurysms:        {lesion_res.get('microaneurysms', {}).get('status', 'NOT DETECTED')} (Count: {lesion_res.get('microaneurysms', {}).get('count', 0)})
Hard Exudates:         {lesion_res.get('exudates', {}).get('status', 'NOT DETECTED')} (Estimated Regions: {lesion_res.get('exudates', {}).get('count', 0)})
Hemorrhages:           {lesion_res.get('hemorrhages', {}).get('status', 'NOT DETECTED')} (Count: {lesion_res.get('hemorrhages', {}).get('count', 0)})
Neovascularization:    {lesion_res.get('neovascularization', {}).get('status', 'NOT DETECTED')}

--------------------------------------------------------------------------------
4. STRUCTURAL RETINAL FINDINGS
--------------------------------------------------------------------------------
Optic Disc:            {'Detected at x=' + str(struct_res.get('optic_disc', {}).get('location', (0,0))[0]) + ', y=' + str(struct_res.get('optic_disc', {}).get('location', (0,0))[1]) if struct_res.get('optic_disc', {}).get('detected') else 'Not Detected'}
Fovea Center:          {struct_res.get('fovea', {}).get('status', 'Estimated')}
Vessel Density:        {struct_res.get('vessels', {}).get('vessel_density', 0)}% of retinal FOV

--------------------------------------------------------------------------------
5. EXPLAINABLE AI (Grad-CAM)
--------------------------------------------------------------------------------
Grad-CAM Map:          AVAILABLE & GENERATED
Visual Overlay:        Original Retina + Jet Heatmap + Lesion Annotations

--------------------------------------------------------------------------------
6. CLINICIAN HUMAN-IN-THE-LOOP REVIEW
--------------------------------------------------------------------------------
Status:                {review_data.get('status', 'PENDING REVIEW') if review_data else 'PENDING REVIEW'}
Reviewer Name:         {review_data.get('reviewer', 'Dr. Ophthalmologist (Tele-Reviewer)') if review_data else 'Unassigned'}
Clinician Action:      {review_data.get('action', 'Pending') if review_data else 'Awaiting Specialist Sign-Off'}
Clinician Comments:    {review_data.get('comments', 'None') if review_data else 'N/A'}

================================================================================
IMPORTANT CLINICAL SAFETY NOTICE:
This screening report is generated by an AI decision-support prototype system.
It is intended solely to assist clinical triage and telemedicine prioritization.
It does NOT constitute an autonomous medical diagnosis. All referable cases 
must be confirmed by a certified ophthalmologist.
================================================================================
"""
        filename = f"Screening_Report_{case_id}.txt"
        file_path = os.path.join(self.output_dir, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(report_md)

        return {
            'file_path': file_path,
            'report_text': report_md
        }

if __name__ == "__main__":
    generator = ReportGenerator()
    rep = generator.generate_report(
        "DEMO-001",
        {'focus_status': 'GOOD', 'focus_score': 85, 'illumination_status': 'GOOD', 'illumination_score': 82, 'fov_status': 'ADEQUATE', 'fov_score': 90, 'contrast_status': 'GOOD', 'contrast_score': 80, 'overall_score': 84.5, 'status': 'GRADABLE', 'recommendation': 'Proceed'},
        {'grade_label': 'Level 2 — Moderate NPDR', 'referable_status': 'REFERABLE DR', 'raw_confidence': 94.2, 'probabilities': {'Level 0 (No DR)': 2.1, 'Level 1 (Mild NPDR)': 4.7, 'Level 2 (Moderate NPDR)': 83.2, 'Level 3 (Severe NPDR)': 8.1, 'Level 4 (Proliferative DR)': 1.9}},
        {'microaneurysms': {'status': 'DETECTED', 'count': 14}, 'exudates': {'status': 'DETECTED', 'count': 8}, 'hemorrhages': {'status': 'DETECTED', 'count': 6}, 'neovascularization': {'status': 'NOT DETECTED'}},
        {'optic_disc': {'detected': True, 'location': (120, 250)}, 'fovea': {'status': 'Anatomically Estimated'}, 'vessels': {'vessel_density': 12.4}},
        {'calibrated_confidence': 91.8, 'category': 'HIGH'}
    )
    print("Report Generated:", rep['file_path'])
