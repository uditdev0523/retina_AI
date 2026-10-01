export const DASHBOARD_STATS = {
  totalScreened: 12480,
  referableCount: 2186,
  ungradableCount: 412,
  pendingReviews: 37,
  screeningAccuracyDemo: "94.8% (Validation Dataset)",
};

export const MONTHLY_VOLUME_DATA = [
  { month: 'Jan', screened: 820, referable: 142, ungradable: 28 },
  { month: 'Feb', screened: 950, referable: 168, ungradable: 31 },
  { month: 'Mar', screened: 1100, referable: 195, ungradable: 35 },
  { month: 'Apr', screened: 1040, referable: 182, ungradable: 33 },
  { month: 'May', screened: 1250, referable: 218, ungradable: 42 },
  { month: 'Jun', screened: 1380, referable: 245, ungradable: 44 },
  { month: 'Jul', screened: 1420, referable: 252, ungradable: 46 },
  { month: 'Aug', screened: 1560, referable: 278, ungradable: 51 },
  { month: 'Sep', screened: 1640, referable: 289, ungradable: 48 },
  { month: 'Oct', screened: 1320, referables: 217, ungradable: 54 },
];

export const SEVERITY_DISTRIBUTION_DATA = [
  { name: 'Level 0 — No DR', value: 7850, percentage: '62.9%', color: '#10b981' },
  { name: 'Level 1 — Mild NPDR', value: 2032, percentage: '16.3%', color: '#3b82f6' },
  { name: 'Level 2 — Moderate NPDR', value: 1420, percentage: '11.4%', color: '#f59e0b' },
  { name: 'Level 3 — Severe NPDR', value: 540, percentage: '4.3%', color: '#f97316' },
  { name: 'Level 4 — Proliferative DR', value: 226, percentage: '1.8%', color: '#ef4444' },
  { name: 'Ungradable Image', value: 412, percentage: '3.3%', color: '#6b7280' },
];

export const QUALITY_DISTRIBUTION_DATA = [
  { name: 'Good Quality (Gradable)', value: 10850, fill: '#10b981' },
  { name: 'Borderline Quality', value: 1218, fill: '#f59e0b' },
  { name: 'Ungradable Quality', value: 412, fill: '#ef4444' },
];

export const CONFIDENCE_HISTOGRAM_DATA = [
  { range: '0-50%', count: 120, label: 'Low' },
  { range: '50-70%', count: 340, label: 'Medium' },
  { range: '70-85%', count: 1450, label: 'Good' },
  { range: '85-95%', count: 5820, label: 'High' },
  { range: '95-100%', count: 4750, label: 'Very High' },
];

export const MODEL_PERFORMANCE_METRICS = {
  sensitivity: { value: 93.4, target: 90.0, label: 'Sensitivity (TPR)', status: 'PASS' },
  specificity: { value: 89.2, target: 85.0, label: 'Specificity (TNR)', status: 'PASS' },
  precision: { value: 87.6, target: 80.0, label: 'Precision (PPV)', status: 'PASS' },
  recall: { value: 93.4, target: 90.0, label: 'Recall', status: 'PASS' },
  f1Score: { value: 90.4, target: 85.0, label: 'F1 Score', status: 'PASS' },
  accuracy: { value: 94.8, target: 90.0, label: 'Overall Accuracy', status: 'PASS' },
  rocAuc: { value: 0.962, target: 0.900, label: 'ROC-AUC Area', status: 'PASS' }
};

export const CONFUSION_MATRIX_DATA = [
  { actual: 'Referable DR (Actual +)', predNonRef: 132, predRef: 1868 },
  { actual: 'Non-Referable DR (Actual -)', predNonRef: 8840, predRef: 1068 }
];

export const ROC_CURVE_DATA = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.02, tpr: 0.45 },
  { fpr: 0.05, tpr: 0.72 },
  { fpr: 0.08, tpr: 0.86 },
  { fpr: 0.11, tpr: 0.934 },
  { fpr: 0.15, tpr: 0.96 },
  { fpr: 0.25, tpr: 0.98 },
  { fpr: 0.50, tpr: 0.99 },
  { fpr: 1.00, tpr: 1.00 },
];
