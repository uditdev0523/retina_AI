import { DemoCaseConfig, ScreeningCase } from '../types/screening';

export const DEMO_CASES: DemoCaseConfig[] = [
  {
    id: "DEMO-001",
    name: "DEMO-001 — No DR",
    description: "Healthy fundus image showing clear optic disc, fovea, and healthy retinal microvasculature with no lesions.",
    expected_grade: 0,
    grade_name: "No Diabetic Retinopathy",
    is_referable: false,
    quality_status: "GRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`
  },
  {
    id: "DEMO-002",
    name: "DEMO-002 — Mild NPDR",
    description: "Earliest stage of diabetic retinopathy featuring isolated microaneurysms near macular region.",
    expected_grade: 1,
    grade_name: "Mild NPDR",
    is_referable: false,
    quality_status: "GRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`
  },
  {
    id: "DEMO-003",
    name: "DEMO-003 — Moderate NPDR",
    description: "Multiple microaneurysms, hard exudates, and intraretinal hemorrhages present in 2-3 quadrants.",
    expected_grade: 2,
    grade_name: "Moderate NPDR",
    is_referable: true,
    quality_status: "GRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`
  },
  {
    id: "DEMO-004",
    name: "DEMO-004 — Severe NPDR",
    description: "Extensive intraretinal hemorrhages (>20 in 4 quadrants), venous beading, and prominent cotton wool spots.",
    expected_grade: 3,
    grade_name: "Severe NPDR",
    is_referable: true,
    quality_status: "GRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`
  },
  {
    id: "DEMO-005",
    name: "DEMO-005 — Proliferative DR",
    description: "Advanced disease stage with neovascularization of the disc/retina and preretinal hemorrhage risk.",
    expected_grade: 4,
    grade_name: "Proliferative DR (PDR)",
    is_referable: true,
    quality_status: "GRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png` // using high severity image
  },
  {
    id: "DEMO-006",
    name: "DEMO-006 — Poor Quality Image",
    description: "Severe media opacity / defocus causing inadequate illumination and low contrast. Trigger recapture workflow.",
    expected_grade: 0,
    grade_name: "Ungradable / Indeterminate",
    is_referable: false,
    quality_status: "UNGRADABLE",
    image_path: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`
  }
];

export function getFullDemoCaseData(caseId: string): ScreeningCase {
  const now = new Date().toISOString().split('T')[0];
  
  switch (caseId) {
    case 'DEMO-001':
      return {
        case_id: 'DEMO-001',
        patient: {
          id: 'P-10482',
          name: 'Ramesh Kumar',
          age: 48,
          gender: 'M',
          location: 'CHCP Wardha, MH',
          diabetic_years: 4,
          hba1c: 6.8,
          last_screening_date: '2025-11-12'
        },
        image_filename: 'demo_no_dr.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Telemedicine Mobile Unit - Wardha',
        review_status: 'REVIEWED',
        quality: {
          focus_score: 95,
          focus_status: 'GOOD',
          illumination_score: 92,
          illumination_status: 'UNIFORM',
          fov_score: 98,
          fov_status: 'ADEQUATE',
          contrast_score: 91,
          contrast_status: 'GOOD',
          overall_score: 94,
          status: 'GRADABLE',
          reason: 'Clear retinal visibility with high signal-to-noise ratio.',
          recommendation: 'Proceed with AI classification.'
        },
        dr_classification: {
          predicted_grade: 0,
          grade_label: 'No Diabetic Retinopathy',
          raw_confidence: 0.984,
          is_referable: false,
          referable_status: 'NON-REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.984,
            'Level 1 (Mild NPDR)': 0.012,
            'Level 2 (Moderate NPDR)': 0.003,
            'Level 3 (Severe NPDR)': 0.001,
            'Level 4 (Proliferative DR)': 0.000
          }
        },
        lesions: {
          microaneurysms: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.98 },
          exudates: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.99 },
          hemorrhages: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.97 },
          neovascularization: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.99 }
        },
        structures: {
          optic_disc: { detected: true, location: [390, 248], radius: 46, confidence: 0.97 },
          fovea: { detected: true, location: [242, 258], radius: 25, status: 'CLEAR' },
          vessel_density: 0.142
        },
        calibration: {
          raw_confidence: 0.984,
          calibrated_confidence: 0.978,
          category: 'HIGH',
          recommendation: 'High AI certainty. Routine annual follow-up recommended.'
        },
        report_text: 'Automated screening reveals no signs of diabetic retinopathy. Optic disc and foveal architecture intact.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_no_dr.png`
        }
      };

    case 'DEMO-002':
      return {
        case_id: 'DEMO-002',
        patient: {
          id: 'P-10495',
          name: 'Sunita Sharma',
          age: 52,
          gender: 'F',
          location: 'PHC Sub-center, Nashik',
          diabetic_years: 7,
          hba1c: 7.4,
          last_screening_date: '2025-05-18'
        },
        image_filename: 'demo_mild_dr.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Rural Tele-Clinic Nashik',
        review_status: 'PENDING',
        quality: {
          focus_score: 91,
          focus_status: 'GOOD',
          illumination_score: 89,
          illumination_status: 'ADEQUATE',
          fov_score: 95,
          fov_status: 'ADEQUATE',
          contrast_score: 88,
          contrast_status: 'GOOD',
          overall_score: 91,
          status: 'GRADABLE',
          reason: 'Good overall image fidelity.',
          recommendation: 'Proceed with AI classification.'
        },
        dr_classification: {
          predicted_grade: 1,
          grade_label: 'Mild Non-Proliferative DR (NPDR)',
          raw_confidence: 0.925,
          is_referable: false,
          referable_status: 'NON-REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.052,
            'Level 1 (Mild NPDR)': 0.925,
            'Level 2 (Moderate NPDR)': 0.018,
            'Level 3 (Severe NPDR)': 0.003,
            'Level 4 (Proliferative DR)': 0.002
          }
        },
        lesions: {
          microaneurysms: { detected: true, count: 4, status: 'DETECTED', confidence: 0.91, coords: [[210, 230], [225, 270], [280, 210], [195, 290]] },
          exudates: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.94 },
          hemorrhages: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.95 },
          neovascularization: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.99 }
        },
        structures: {
          optic_disc: { detected: true, location: [390, 248], radius: 46, confidence: 0.96 },
          fovea: { detected: true, location: [242, 258], radius: 25, status: 'CLEAR' },
          vessel_density: 0.138
        },
        calibration: {
          raw_confidence: 0.925,
          calibrated_confidence: 0.915,
          category: 'HIGH',
          recommendation: 'Mild NPDR detected. Re-screen in 6-12 months. Glycemic control recommended.'
        },
        report_text: 'Early signs of DR identified with 4 microaneurysms. No macula-involving hard exudates observed.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_mild_dr.png`
        }
      };

    case 'DEMO-003':
      return {
        case_id: 'DEMO-003',
        patient: {
          id: 'P-10512',
          name: 'Anil Deshmukh',
          age: 61,
          gender: 'M',
          location: 'CHC Yavatmal',
          diabetic_years: 12,
          hba1c: 8.9,
          last_screening_date: '2024-10-02'
        },
        image_filename: 'demo_moderate_dr.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Yavatmal Tele-Eye Screening Hub',
        review_status: 'PENDING',
        quality: {
          focus_score: 89,
          focus_status: 'GOOD',
          illumination_score: 86,
          illumination_status: 'UNIFORM',
          fov_score: 92,
          fov_status: 'ADEQUATE',
          contrast_score: 87,
          contrast_status: 'GOOD',
          overall_score: 88,
          status: 'GRADABLE',
          reason: 'Fundus features clear and gradeable.',
          recommendation: 'Proceed with AI classification.'
        },
        dr_classification: {
          predicted_grade: 2,
          grade_label: 'Moderate Non-Proliferative DR (NPDR)',
          raw_confidence: 0.942,
          is_referable: true,
          referable_status: 'REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.018,
            'Level 1 (Mild NPDR)': 0.034,
            'Level 2 (Moderate NPDR)': 0.881,
            'Level 3 (Severe NPDR)': 0.051,
            'Level 4 (Proliferative DR)': 0.016
          }
        },
        lesions: {
          microaneurysms: { detected: true, count: 14, status: 'DETECTED', confidence: 0.92, coords: [[180, 210], [210, 280], [260, 310], [150, 240]] },
          exudates: { detected: true, count: 6, status: 'DETECTED', confidence: 0.88, coords: [[290, 240], [310, 270], [275, 290]] },
          hemorrhages: { detected: true, count: 3, status: 'DETECTED', confidence: 0.86, coords: [[190, 310], [320, 200]] },
          neovascularization: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.96 }
        },
        structures: {
          optic_disc: { detected: true, location: [390, 248], radius: 46, confidence: 0.95 },
          fovea: { detected: true, location: [242, 258], radius: 25, status: 'THREATENED BY EXUDATE' },
          vessel_density: 0.155
        },
        calibration: {
          raw_confidence: 0.942,
          calibrated_confidence: 0.931,
          category: 'HIGH',
          recommendation: 'REFERABLE CASE: Moderate NPDR with lipid exudates near temporal arcade. Refer to Ophthalmologist within 3-4 weeks.'
        },
        report_text: 'Screening shows Moderate NPDR with 14 microaneurysms, 6 lipid exudates, and 3 blot hemorrhages. Referable case.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`
        }
      };

    case 'DEMO-004':
      return {
        case_id: 'DEMO-004',
        patient: {
          id: 'P-10530',
          name: 'Meena Patel',
          age: 67,
          gender: 'F',
          location: 'Dist Hospital Amravati',
          diabetic_years: 18,
          hba1c: 10.2,
          last_screening_date: '2023-11-20'
        },
        image_filename: 'demo_severe_dr.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Amravati Mobile DR Screening Unit',
        review_status: 'ESCALATED',
        quality: {
          focus_score: 85,
          focus_status: 'GOOD',
          illumination_score: 84,
          illumination_status: 'ADEQUATE',
          fov_score: 90,
          fov_status: 'ADEQUATE',
          contrast_score: 83,
          contrast_status: 'GOOD',
          overall_score: 85,
          status: 'GRADABLE',
          reason: 'Acceptable image quality for grading.',
          recommendation: 'Proceed with AI classification.'
        },
        dr_classification: {
          predicted_grade: 3,
          grade_label: 'Severe Non-Proliferative DR (NPDR)',
          raw_confidence: 0.965,
          is_referable: true,
          referable_status: 'REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.001,
            'Level 1 (Mild NPDR)': 0.005,
            'Level 2 (Moderate NPDR)': 0.042,
            'Level 3 (Severe NPDR)': 0.895,
            'Level 4 (Proliferative DR)': 0.057
          }
        },
        lesions: {
          microaneurysms: { detected: true, count: 32, status: 'DETECTED', confidence: 0.96 },
          exudates: { detected: true, count: 18, status: 'DETECTED', confidence: 0.94 },
          hemorrhages: { detected: true, count: 12, status: 'DETECTED', confidence: 0.92 },
          neovascularization: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.88 }
        },
        structures: {
          optic_disc: { detected: true, location: [390, 248], radius: 46, confidence: 0.94 },
          fovea: { detected: true, location: [242, 258], radius: 25, status: 'INVOLVED' },
          vessel_density: 0.168
        },
        calibration: {
          raw_confidence: 0.965,
          calibrated_confidence: 0.952,
          category: 'HIGH',
          recommendation: 'HIGH URGENCY REFERRAL: Severe NPDR detected with widespread hemorrhages. Schedule vitreoretinal consultation within 1-2 weeks.'
        },
        report_text: 'Multi-quadrant intraretinal hemorrhages and cotton wool spots detected. Meets 4-2-1 rule criteria for Severe NPDR.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`
        }
      };

    case 'DEMO-005':
      return {
        case_id: 'DEMO-005',
        patient: {
          id: 'P-10544',
          name: 'Venkatesh Rao',
          age: 59,
          gender: 'M',
          location: 'Nanded Health Camp',
          diabetic_years: 15,
          hba1c: 9.6,
          last_screening_date: '2024-02-10'
        },
        image_filename: 'demo_severe_dr.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Nanded Telemedicine Outreach',
        review_status: 'PENDING',
        quality: {
          focus_score: 87,
          focus_status: 'GOOD',
          illumination_score: 85,
          illumination_status: 'ADEQUATE',
          fov_score: 91,
          fov_status: 'ADEQUATE',
          contrast_score: 84,
          contrast_status: 'GOOD',
          overall_score: 86,
          status: 'GRADABLE',
          reason: 'Retinal image features clear.',
          recommendation: 'Proceed with AI classification.'
        },
        dr_classification: {
          predicted_grade: 4,
          grade_label: 'Proliferative Diabetic Retinopathy (PDR)',
          raw_confidence: 0.912,
          is_referable: true,
          referable_status: 'REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.001,
            'Level 1 (Mild NPDR)': 0.003,
            'Level 2 (Moderate NPDR)': 0.014,
            'Level 3 (Severe NPDR)': 0.125,
            'Level 4 (Proliferative DR)': 0.857
          }
        },
        lesions: {
          microaneurysms: { detected: true, count: 28, status: 'DETECTED', confidence: 0.95 },
          exudates: { detected: true, count: 22, status: 'DETECTED', confidence: 0.91 },
          hemorrhages: { detected: true, count: 16, status: 'DETECTED', confidence: 0.93 },
          neovascularization: { detected: true, count: 2, status: 'DETECTED', confidence: 0.89 }
        },
        structures: {
          optic_disc: { detected: true, location: [390, 248], radius: 46, confidence: 0.93 },
          fovea: { detected: true, location: [242, 258], radius: 25, status: 'HIGH RISK' },
          vessel_density: 0.182
        },
        calibration: {
          raw_confidence: 0.912,
          calibrated_confidence: 0.898,
          category: 'HIGH',
          recommendation: 'URGENT REFERRAL: Proliferative DR with neovascularization of disc/elsewhere. Immediate anti-VEGF / PRP evaluation required.'
        },
        report_text: 'Advanced disease stage showing new vessel formation (NVD/NVE). Immediate ophthalmologist referral required to preserve vision.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_severe_dr.png`
        }
      };

    case 'DEMO-006':
    default:
      return {
        case_id: 'DEMO-006',
        patient: {
          id: 'P-10560',
          name: 'Lata Bai',
          age: 71,
          gender: 'F',
          location: 'Gadchiroli Mobile Clinic',
          diabetic_years: 9,
          hba1c: 8.1,
          last_screening_date: 'Never'
        },
        image_filename: 'demo_poor_quality.png',
        image_dims: '512x512',
        screening_date: now,
        facility: 'Gadchiroli Tribal Health Post',
        review_status: 'RECAPTURE_REQUIRED',
        quality: {
          focus_score: 38,
          focus_status: 'POOR',
          illumination_score: 42,
          illumination_status: 'NON_UNIFORM',
          fov_score: 65,
          fov_status: 'INADEQUATE',
          contrast_score: 32,
          contrast_status: 'POOR',
          overall_score: 39,
          status: 'UNGRADABLE',
          reason: 'Severe motion blur, corneal opacity / inadequate flash illumination.',
          recommendation: 'DO NOT ATTEMPT AI DIAGNOSIS. Recapture retinal image using dilated protocol.'
        },
        dr_classification: {
          predicted_grade: 0,
          grade_label: 'Ungradable / Indeterminate',
          raw_confidence: 0.35,
          is_referable: false,
          referable_status: 'NON-REFERABLE DR',
          probabilities: {
            'Level 0 (No DR)': 0.20,
            'Level 1 (Mild NPDR)': 0.20,
            'Level 2 (Moderate NPDR)': 0.20,
            'Level 3 (Severe NPDR)': 0.20,
            'Level 4 (Proliferative DR)': 0.20
          }
        },
        lesions: {
          microaneurysms: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.30 },
          exudates: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.30 },
          hemorrhages: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.30 },
          neovascularization: { detected: false, count: 0, status: 'NOT DETECTED', confidence: 0.30 }
        },
        structures: {
          optic_disc: { detected: false, location: [0, 0], radius: 0, confidence: 0.20 },
          fovea: { detected: false, location: [0, 0], radius: 0, status: 'UNGRADABLE' },
          vessel_density: 0.04
        },
        calibration: {
          raw_confidence: 0.35,
          calibrated_confidence: 0.28,
          category: 'LOW',
          recommendation: 'QUALITY WARNING: Image quality is insufficient for reliable automated analysis. Re-capture image.'
        },
        report_text: 'Image quality assessment flagged severe defocus and low illumination. Automated DR assessment aborted for patient safety.',
        images: {
          original: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`,
          enhanced: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`,
          vessels: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`,
          lesions: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`,
          structures: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`,
          gradcam: `${import.meta.env.BASE_URL}demo/demo_poor_quality.png`
        }
      };
  }
}
