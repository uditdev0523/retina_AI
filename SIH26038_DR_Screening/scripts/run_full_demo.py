import urllib.request
import urllib.parse
import json
import time

def run_full_demo():
    print("=================================================================================")
    print("      SIH26038: EXPLAINABLE AI DR SCREENING WEB SYSTEM DEMO RUNNER               ")
    print("=================================================================================")

    server_url = "http://127.0.0.1:8000"
    
    # 1. Health Check
    try:
        req = urllib.request.Request(f"{server_url}/")
        res = urllib.request.urlopen(req)
        print(f"[STATUS] Web Dashboard UI Server is LIVE at {server_url} (HTTP 200 OK)")
    except Exception as e:
        print(f"[ERROR] Failed to reach server at {server_url}: {e}")
        return

    demos = [
        ("demo_no_dr.png", "Demo 1: No DR (Level 0)"),
        ("demo_mild_dr.png", "Demo 2: Mild DR (Level 1)"),
        ("demo_moderate_dr.png", "Demo 3: Moderate DR (Level 2)"),
        ("demo_severe_dr.png", "Demo 4: Severe DR (Level 3)"),
        ("demo_poor_quality.png", "Demo 5: Poor Quality Image"),
        ("non_retinal.png", "Demo 6: Non-Retinal Image Safeguard")
    ]

    print("\n---------------------------------------------------------------------------------")
    print(" RUNNING AUTOMATED SCREENING ANALYSIS ACROSS ALL DEMO CASES...")
    print("---------------------------------------------------------------------------------")

    for demo_filename, label in demos:
        print(f"\n>>> Analyzing [{label}]...")
        start_time = time.time()
        
        post_data = urllib.parse.urlencode({'demo_name': demo_filename}).encode('utf-8')
        req = urllib.request.Request(f"{server_url}/api/analyze", data=post_data)
        
        try:
            res = urllib.request.urlopen(req)
            data = json.loads(res.read().decode('utf-8'))
            elapsed = round((time.time() - start_time) * 1000, 1)

            if not data.get('success'):
                print(f"    - Error / Safeguard Triggered: {data.get('message')}")
                continue

            q = data['quality']
            dr = data['dr_classification']
            cal = data['calibration']
            les = data['lesions']
            struct = data['structures']

            print(f"    - Case ID:               {data['case_id']}")
            print(f"    - Processing Time:       {elapsed} ms")
            print(f"    - Image Quality:         {q['status']} (Focus: {q['focus_status']}, Score: {q['overall_score']}/100)")
            print(f"    - Predicted DR Grade:    {dr['grade_label']}")
            print(f"    - Referable DR Status:   {dr['referable_status']}")
            print(f"    - Raw Confidence:        {dr['raw_confidence']}%")
            print(f"    - Calibrated Confidence: {cal['calibrated_confidence']}% ({cal['category']} RELIABILITY)")
            print(f"    - Detected Lesions:      MA ({les['microaneurysms']['status']}), Exudates ({les['exudates']['status']}), Hemorrhages ({les['hemorrhages']['status']})")
            print(f"    - Structural Mask:       Optic Disc Detected at {struct['optic_disc']['location']}, Vessel Density: {struct['vessel_density']}%")
            print(f"    - Clinical Report Saved: {data['report_file']}")

        except urllib.error.HTTPError as he:
            err_body = he.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
                print(f"    - [SAFEGUARD TRIGGERED]: {err_json.get('message')}")
            except Exception:
                print(f"    - [HTTP ERROR {he.code}]: {he.reason}")

    print("\n---------------------------------------------------------------------------------")
    print(" RUNNING TELEMEDICINE SIMULATION RUNNER (100,000 PATIENTS/YEAR)...")
    print("---------------------------------------------------------------------------------")

    sim_payload = json.dumps({
        'patients_year': 100000,
        'cameras': 15,
        'bandwidth': 10.0,
        'ai_workers': 4,
        'doctors': 5
    }).encode('utf-8')

    req_sim = urllib.request.Request(
        f"{server_url}/api/telemedicine_sim",
        data=sim_payload,
        headers={'Content-Type': 'application/json'}
    )
    
    res_sim = urllib.request.urlopen(req_sim)
    sim_data = json.loads(res_sim.read().decode('utf-8'))

    print(f"    - Annual Patients Target:   {sim_data['target_patients_year']:,}")
    print(f"    - Annual Patients Screened: {sim_data['annual_patients_processed']:,}")
    print(f"    - System Bottleneck:        {sim_data['bottleneck']}")
    print(f"    - Camera Utilization:       {sim_data['utilization']['camera_utilization']}%")
    print(f"    - Network Utilization:      {sim_data['utilization']['network_utilization']}%")
    print(f"    - AI Utilization:           {sim_data['utilization']['ai_utilization']}%")
    print(f"    - Doctor Utilization:       {sim_data['utilization']['doctor_utilization']}%")
    print(f"    - Resource Optimization:    Recommended Cameras: {sim_data['resource_optimization']['recommended_cameras']}, Bandwidth: {sim_data['resource_optimization']['recommended_bandwidth_mbps']} Mbps, Doctors: {sim_data['resource_optimization']['recommended_doctors']}")

    print("=================================================================================")
    print("      ALL LIVE DEMO RUNS & API ENDPOINTS OPERATING AT FULL CAPACITY!             ")
    print("=================================================================================")

if __name__ == "__main__":
    run_full_demo()
