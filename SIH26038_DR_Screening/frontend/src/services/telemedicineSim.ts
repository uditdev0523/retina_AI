import { TelemedicineSimParams, TelemedicineSimResults } from '../types/screening';

export function calculateTelemedicineCapacity(params: TelemedicineSimParams): TelemedicineSimResults {
  const {
    patients_year,
    cameras,
    images_per_camera_day,
    bandwidth_mbps,
    ai_workers,
    doctors,
    review_time_sec,
    inference_time_sec
  } = params;

  // Operating parameters: 300 operational screening days per year
  const operatingDays = 300;
  const targetDailyPatients = Math.ceil(patients_year / operatingDays);

  // 1. Camera Capacity
  const dailyCameraCapacity = cameras * images_per_camera_day;

  // 2. Network Transmission Capacity (assuming avg image size = 4.5 MB = 36 Mbits)
  // Operating 8 hours/day = 28,800 seconds
  const dailySec = 8 * 3600;
  const totalBandwidthMbitsDay = bandwidth_mbps * dailySec;
  const imageSizeMbits = 36;
  const dailyNetworkCapacity = Math.floor(totalBandwidthMbitsDay / imageSizeMbits);

  // 3. AI Worker Capacity (inference time per image)
  const imagesPerAiWorkerDay = Math.floor(dailySec / Math.max(0.5, inference_time_sec));
  const dailyAiCapacity = ai_workers * imagesPerAiWorkerDay;

  // 4. Doctor Review Capacity (estimated ~18% referable/borderline cases need human review)
  const casesPerDoctorDay = Math.floor(dailySec / Math.max(5, review_time_sec));
  const dailyDoctorReviewCapacity = doctors * casesPerDoctorDay;
  // Doctor capacity expressed in total patient throughput assuming 20% review rate
  const equivalentDoctorTotalCapacity = Math.floor(dailyDoctorReviewCapacity / 0.20);

  // Bottleneck determination
  const capacities = [
    { name: 'CAMERA' as const, cap: dailyCameraCapacity },
    { name: 'NETWORK' as const, cap: dailyNetworkCapacity },
    { name: 'AI' as const, cap: dailyAiCapacity },
    { name: 'DOCTOR' as const, cap: equivalentDoctorTotalCapacity },
  ];

  capacities.sort((a, b) => a.cap - b.cap);
  const bottleneck = capacities[0].name;
  const actualDailyThroughput = Math.min(targetDailyPatients, capacities[0].cap);

  const annualPatientsProcessed = actualDailyThroughput * operatingDays;
  const annualReferrals = Math.round(annualPatientsProcessed * 0.175);

  // Utilization percentages
  const cameraUtil = Math.min(100, Math.round((actualDailyThroughput / Math.max(1, dailyCameraCapacity)) * 100));
  const networkUtil = Math.min(100, Math.round((actualDailyThroughput / Math.max(1, dailyNetworkCapacity)) * 100));
  const aiUtil = Math.min(100, Math.round((actualDailyThroughput / Math.max(1, dailyAiCapacity)) * 100));
  const doctorUtil = Math.min(100, Math.round(((actualDailyThroughput * 0.20) / Math.max(1, dailyDoctorReviewCapacity)) * 100));

  // Queue estimates
  const netQueue = actualDailyThroughput > dailyNetworkCapacity ? actualDailyThroughput - dailyNetworkCapacity : 0;
  const aiQueue = actualDailyThroughput > dailyAiCapacity ? actualDailyThroughput - dailyAiCapacity : 0;
  const docQueue = (actualDailyThroughput * 0.20) > dailyDoctorReviewCapacity ? Math.round((actualDailyThroughput * 0.20) - dailyDoctorReviewCapacity) : 0;

  // Avg turnaround time calculation
  const networkDelayMin = (imageSizeMbits / Math.max(1, bandwidth_mbps)) / 60;
  const aiDelayMin = inference_time_sec / 60;
  const doctorDelayMin = docQueue > 0 ? (docQueue * review_time_sec) / (doctors * 60) : 0.5;
  const avgTurnaroundMin = parseFloat((networkDelayMin + aiDelayMin + doctorDelayMin + 2.5).toFixed(1));

  // Recommendations to remove bottleneck
  const requiredDaily = targetDailyPatients;
  const recCameras = Math.ceil(requiredDaily / images_per_camera_day);
  const recBandwidth = Math.ceil((requiredDaily * imageSizeMbits) / dailySec);
  const recAiWorkers = Math.ceil(requiredDaily / imagesPerAiWorkerDay);
  const recDoctors = Math.ceil((requiredDaily * 0.20) / casesPerDoctorDay);

  return {
    target_patients_year: patients_year,
    annual_patients_processed: annualPatientsProcessed,
    annual_referrals_generated: annualReferrals,
    daily_capacity: actualDailyThroughput,
    bottleneck,
    utilization: {
      camera_utilization: cameraUtil,
      network_utilization: networkUtil,
      ai_utilization: aiUtil,
      doctor_utilization: doctorUtil,
    },
    queues: {
      network_queue_images: netQueue,
      ai_queue_images: aiQueue,
      doctor_queue_cases: docQueue,
      avg_total_turnaround_time_min: avgTurnaroundMin,
    },
    resource_optimization: {
      recommended_cameras: recCameras,
      recommended_bandwidth_mbps: recBandwidth,
      recommended_ai_workers: recAiWorkers,
      recommended_doctors: recDoctors,
    },
  };
}
