import math
import numpy as np

class TelemedicineSimulator:
    def __init__(self):
        pass

    def run_simulation(
        self,
        target_patients_year=100000,
        num_cameras=15,
        images_per_hour_per_camera=8,
        network_bandwidth_mbps=10.0,
        image_size_mb=4.5,
        ai_workers=4,
        ai_inference_time_sec=1.5,
        num_doctors=5,
        doctor_review_time_min=2.5,
        doctor_hours_per_day=7.0,
        referable_rate=0.22
    ):
        """
        Simulates large-scale rural telemedicine deployment workflow for 100,000+ patients/year.
        Calculates queue stats, waiting times, bottleneck identification, and scenario options.
        """
        operating_days_year = 300
        daily_target = target_patients_year / operating_days_year # ~333.3 patients/day

        # 1. Camera Acquisition Throughput
        camera_hours_day = 8.0
        daily_camera_capacity = num_cameras * images_per_hour_per_camera * camera_hours_day

        # 2. Network Upload Bandwidth Capacity
        # 10 Mbps = 1.25 MB/s -> 4.5 MB image takes 3.6 seconds to upload
        upload_time_per_image_sec = (image_size_mb * 8.0) / network_bandwidth_mbps
        daily_network_capacity = (camera_hours_day * 3600) / upload_time_per_image_sec

        # 3. AI Processing Capacity
        daily_ai_seconds = camera_hours_day * 3600 * ai_workers
        daily_ai_capacity = daily_ai_seconds / ai_inference_time_sec

        # 4. Doctor Review Capacity (Only referable cases + low confidence cases get queued)
        expected_referrals_daily = daily_target * referable_rate
        doctor_seconds_daily = num_doctors * doctor_hours_per_day * 3600
        doctor_time_per_review_sec = doctor_review_time_min * 60.0
        daily_doctor_capacity = doctor_seconds_daily / doctor_time_per_review_sec

        # Effective Processed Patients
        processed_daily = min(daily_target, daily_camera_capacity, daily_network_capacity, daily_ai_capacity)
        effective_referrals = processed_daily * referable_rate
        doctor_processed_daily = min(effective_referrals, daily_doctor_capacity)

        # Bottleneck Analysis
        capacities = {
            'CAMERA': daily_camera_capacity,
            'NETWORK': daily_network_capacity,
            'AI': daily_ai_capacity,
            'DOCTOR': daily_doctor_capacity / referable_rate
        }
        bottleneck = min(capacities, key=capacities.get)

        # Queue Lengths and Waiting Times (M/M/1 / M/M/c Queuing Approximation)
        # Network queue
        rho_net = min(0.98, daily_target / (daily_network_capacity + 1e-5))
        avg_queue_net = round((rho_net**2) / (1 - rho_net + 1e-5), 1) if rho_net < 1.0 else 125.0
        avg_wait_net_sec = round(avg_queue_net * upload_time_per_image_sec, 1)

        # AI queue
        rho_ai = min(0.98, daily_target / (daily_ai_capacity + 1e-5))
        avg_queue_ai = round((rho_ai**2) / (1 - rho_ai + 1e-5), 1) if rho_ai < 1.0 else 45.0
        avg_wait_ai_sec = round(avg_queue_ai * ai_inference_time_sec, 1)

        # Doctor queue
        rho_doc = min(0.98, effective_referrals / (daily_doctor_capacity + 1e-5))
        avg_queue_doc = round((rho_doc**2) / (1 - rho_doc + 1e-5), 1) if rho_doc < 1.0 else 80.0
        avg_wait_doc_min = round(avg_queue_doc * doctor_review_time_min / num_doctors, 1)

        total_wait_min = round((avg_wait_net_sec + avg_wait_ai_sec) / 60.0 + avg_wait_doc_min, 1)

        # Optimization recommendations
        req_cameras = math.ceil(daily_target / (images_per_hour_per_camera * camera_hours_day))
        req_bandwidth = round((daily_target * image_size_mb * 8.0) / (camera_hours_day * 3600.0), 1)
        req_doctors = math.ceil((daily_target * referable_rate * doctor_time_per_review_sec) / (doctor_hours_per_day * 3600.0))

        # Scenario Analysis Matrix
        scenarios = {
            'Scenario A (Low Bandwidth 2 Mbps, 2 Doctors)': self._calc_scenario(daily_target, num_cameras, 2.0, num_doctors=2, referable_rate=referable_rate),
            'Scenario B (Normal Bandwidth 10 Mbps, 5 Doctors)': self._calc_scenario(daily_target, num_cameras, 10.0, num_doctors=5, referable_rate=referable_rate),
            'Scenario C (High Bandwidth 50 Mbps, 10 Doctors)': self._calc_scenario(daily_target, num_cameras, 50.0, num_doctors=10, referable_rate=referable_rate)
        }

        return {
            'target_patients_year': target_patients_year,
            'annual_patients_processed': int(processed_daily * operating_days_year),
            'annual_referrals_generated': int(doctor_processed_daily * operating_days_year),
            'bottleneck': bottleneck,
            'daily_stats': {
                'target_patients': round(daily_target, 1),
                'processed_patients': round(processed_daily, 1),
                'referrals_screened': round(doctor_processed_daily, 1),
            },
            'utilization': {
                'camera_utilization': round(min(100.0, (daily_target / daily_camera_capacity) * 100), 1),
                'network_utilization': round(min(100.0, (daily_target / daily_network_capacity) * 100), 1),
                'ai_utilization': round(min(100.0, (daily_target / daily_ai_capacity) * 100), 1),
                'doctor_utilization': round(min(100.0, (effective_referrals / daily_doctor_capacity) * 100), 1)
            },
            'queues': {
                'network_queue_images': avg_queue_net,
                'ai_queue_images': avg_queue_ai,
                'doctor_queue_cases': avg_queue_doc,
                'avg_total_turnaround_time_min': total_wait_min
            },
            'resource_optimization': {
                'recommended_cameras': req_cameras,
                'recommended_bandwidth_mbps': req_bandwidth,
                'recommended_ai_workers': max(2, math.ceil(daily_target * ai_inference_time_sec / (camera_hours_day * 3600))),
                'recommended_doctors': req_doctors
            },
            'scenarios': scenarios
        }

    def _calc_scenario(self, daily_target, cameras, bandwidth, num_doctors, referable_rate):
        upload_sec = (4.5 * 8.0) / bandwidth
        net_cap = (8.0 * 3600) / upload_sec
        doc_cap = (num_doctors * 7.0 * 3600) / (2.5 * 60.0)
        
        proc = min(daily_target, net_cap)
        refs = proc * referable_rate
        doc_proc = min(refs, doc_cap)
        
        bottleneck = "NETWORK" if net_cap < daily_target else ("DOCTOR" if doc_cap < refs else "OPTIMAL")
        total_time_min = round((upload_sec * 5 + 2.5) if bottleneck == "OPTIMAL" else 45.0, 1)
        
        return {
            'annual_processed': int(proc * 300),
            'annual_referrals': int(doc_proc * 300),
            'bottleneck': bottleneck,
            'avg_wait_min': total_time_min
        }

if __name__ == "__main__":
    sim = TelemedicineSimulator()
    res = sim.run_simulation(target_patients_year=100000)
    print("Telemedicine Simulation Result:", res['annual_patients_processed'], "processed/yr | Bottleneck:", res['bottleneck'])
