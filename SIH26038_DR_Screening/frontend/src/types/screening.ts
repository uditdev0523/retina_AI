export type DRLevel = 0 | 1 | 2 | 3 | 4;

export interface QualityMetrics {
  focus_score: number;
  focus_status: 'GOOD' | 'BORDERLINE' | 'POOR';
  illumination_score: number;
  illumination_status: string;
  fov_score: number;
  fov_status: 'ADEQUATE' | 'INADEQUATE';
  contrast_score: number;
  contrast_status: 'GOOD' | 'POOR';
  overall_score: number;
  status: 'GRADABLE' | 'BORDERLINE' | 'UNGRADABLE';
  reason: string;
  recommendation: string;
}

export interface DRClassification {
  predicted_grade: DRLevel;
  grade_label: string;
  raw_confidence: number;
  is_referable: boolean;
  referable_status: 'REFERABLE DR' | 'NON-REFERABLE DR';
  probabilities: Record<string, number>;
}

export interface LesionDetails {
  detected: boolean;
  count: number;
  status: 'DETECTED' | 'NOT DETECTED';
  confidence: number;
  coords?: [number, number][];
}

export interface LesionFindings {
  microaneurysms: LesionDetails;
  exudates: LesionDetails;
  hemorrhages: LesionDetails;
  neovascularization: LesionDetails;
}

export interface StructuralFindings {
  optic_disc: {
    detected: boolean;
    location: [number, number];
    radius: number;
    confidence: number;
  };
  fovea: {
    detected: boolean;
    location: [number, number];
    radius: number;
    status: string;
  };
  vessel_density: number;
}

export interface ConfidenceCalibration {
  raw_confidence: number;
  calibrated_confidence: number;
  category: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

export interface ReviewAction {
  case_id: string;
  action: 'AGREE' | 'MODIFY' | 'INADEQUATE' | 'ESCALATE';
  modified_grade?: DRLevel;
  reviewer: string;
  comments: string;
  timestamp: string;
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  location: string;
  diabetic_years: number;
  hba1c?: number;
  last_screening_date: string;
}

export interface ScreeningCase {
  case_id: string;
  patient: PatientInfo;
  image_filename: string;
  image_dims: string;
  screening_date: string;
  facility: string;
  quality: QualityMetrics;
  dr_classification: DRClassification;
  lesions: LesionFindings;
  structures: StructuralFindings;
  calibration: ConfidenceCalibration;
  report_text: string;
  review_status: 'PENDING' | 'REVIEWED' | 'RECAPTURE_REQUIRED' | 'ESCALATED';
  clinician_review?: ReviewAction;
  images: {
    original: string;
    enhanced: string;
    vessels: string;
    lesions: string;
    structures: string;
    gradcam: string;
  };
}

export interface TelemedicineSimParams {
  patients_year: number;
  cameras: number;
  images_per_camera_day: number;
  bandwidth_mbps: number;
  ai_workers: number;
  doctors: number;
  review_time_sec: number;
  inference_time_sec: number;
}

export interface TelemedicineSimResults {
  target_patients_year: number;
  annual_patients_processed: number;
  annual_referrals_generated: number;
  daily_capacity: number;
  bottleneck: 'CAMERA' | 'NETWORK' | 'AI' | 'DOCTOR';
  utilization: {
    camera_utilization: number;
    network_utilization: number;
    ai_utilization: number;
    doctor_utilization: number;
  };
  queues: {
    network_queue_images: number;
    ai_queue_images: number;
    doctor_queue_cases: number;
    avg_total_turnaround_time_min: number;
  };
  resource_optimization: {
    recommended_cameras: number;
    recommended_bandwidth_mbps: number;
    recommended_ai_workers: number;
    recommended_doctors: number;
  };
}

export interface DemoCaseConfig {
  id: string;
  name: string;
  description: string;
  expected_grade: DRLevel;
  grade_name: string;
  is_referable: boolean;
  quality_status: 'GRADABLE' | 'BORDERLINE' | 'UNGRADABLE';
  image_path: string;
}
