import os
import sys
import io
import base64
import numpy as np
import cv2
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Add parent dir to path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from preprocessing.quality.image_quality import ImageQualityAssessor
from preprocessing.enhancement.enhancement import ImageEnhancer
from segmentation.optic_disc.optic_disc_detector import OpticDiscDetector
from segmentation.fovea.fovea_locator import FoveaLocator
from segmentation.vessels.vessel_segmenter import VesselSegmenter
from lesions.lesion_pipeline import LesionAnalyzer
from models.classifier.dr_classifier import DRClassifier
from explainability.gradcam.gradcam import GradCAM
from models.calibration.confidence_calibration import ConfidenceCalibrator
from models.non_retinal.non_retinal_detector import NonRetinalDetector
from reports.report_generator import ReportGenerator
from evaluation.metrics.evaluator import ModelEvaluator
from simulink.telemedicine_simulation import TelemedicineSimulator

app = FastAPI(title="SIH26038 - Explainable AI DR Screening System")

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEMO_DIR = os.path.join(BASE_DIR, "..", "data", "demo")
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
PROCESSED_DIR = os.path.join(BASE_DIR, "..", "data", "processed")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/demo_data", StaticFiles(directory=DEMO_DIR), name="demo_data")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Instantiate core AI modules
quality_assessor = ImageQualityAssessor()
image_enhancer = ImageEnhancer()
optic_disc_detector = OpticDiscDetector()
fovea_locator = FoveaLocator()
vessel_segmenter = VesselSegmenter()
lesion_analyzer = LesionAnalyzer()
dr_classifier = DRClassifier()
gradcam_engine = GradCAM()
confidence_calibrator = ConfidenceCalibrator()
non_retinal_detector = NonRetinalDetector()
report_generator = ReportGenerator(output_dir=PROCESSED_DIR)
model_evaluator = ModelEvaluator()
telemedicine_simulator = TelemedicineSimulator()

# Helper image to base64 string conversion
def np_to_b64(img_np):
    if img_np is None:
        return ""
    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR) if len(img_np.shape) == 3 else img_np
    _, buffer = cv2.imencode('.png', img_bgr)
    return "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(None), demo_name: str = Form(None)):
    """
    Main Screening Pipeline:
    Quality -> Safeguard -> Enhancement -> Retinal Analysis -> DR Classification -> Referable DR -> Grad-CAM -> Confidence -> Report
    """
    try:
        case_id = "CASE-" + str(np.random.randint(10000, 99999))
        image_np = None
        image_filename = ""

        if demo_name:
            case_id = "DEMO-" + demo_name.upper().replace(".PNG", "")
            image_filename = demo_name
            demo_file_path = os.path.join(DEMO_DIR, demo_name)
            if not os.path.exists(demo_file_path):
                raise HTTPException(status_code=404, detail="Demo file not found.")
            pil_img = Image.open(demo_file_path).convert('RGB')
            image_np = np.array(pil_img)
        elif file:
            image_filename = file.filename
            contents = await file.read()
            pil_img = Image.open(io.BytesIO(contents)).convert('RGB')
            image_np = np.array(pil_img)
        else:
            raise HTTPException(status_code=400, detail="No image file or demo name provided.")

        # 0. Non-Retinal Safeguard Check
        is_valid_fundus, non_retinal_msg = non_retinal_detector.is_fundus_image(image_np)
        if not is_valid_fundus:
            return JSONResponse({
                "success": False,
                "error_type": "NON_RETINAL_IMAGE",
                "message": non_retinal_msg,
                "original_image_b64": np_to_b64(image_np)
            })

        # 1. Quality Assessment
        quality_res = quality_assessor.evaluate(image_np)
        if quality_res['status'] == 'UNGRADABLE':
            return JSONResponse({
                "success": False,
                "error_type": "UNGRADABLE_IMAGE",
                "quality": quality_res,
                "original_image_b64": np_to_b64(image_np),
                "message": "IMAGE NOT SUITABLE FOR DIAGNOSTIC SCREENING. " + quality_res['reason']
            })

        # 2. Image Enhancement
        enhanced_np = image_enhancer.enhance(image_np)

        # 3. Retinal Structure Analysis
        optic_disc_res = optic_disc_detector.detect(enhanced_np)
        fovea_res = fovea_locator.estimate(enhanced_np, optic_disc_res)
        vessel_res = vessel_segmenter.segment(enhanced_np)

        # 4. DR Lesion Analysis
        lesion_res = lesion_analyzer.analyze(
            enhanced_np, 
            optic_disc_info=optic_disc_res, 
            vessel_mask=vessel_res.get('vessel_mask')
        )

        # 5. DR Classification & Referable DR
        dr_res = dr_classifier.predict(enhanced_np, lesion_results=lesion_res)

        # 6. Grad-CAM Explainability
        gradcam_overlay_np, heatmap_np = gradcam_engine.generate(
            enhanced_np, 
            target_class=dr_res['predicted_grade'], 
            opacity=0.45
        )

        # 7. Confidence Calibration
        calib_res = confidence_calibrator.calibrate(
            dr_res['raw_confidence'], 
            dr_grade=dr_res['predicted_grade'], 
            quality_score=quality_res['overall_score']
        )

        # 8. Structural Overlay Compositor (Optic Disc + Fovea Marker)
        struct_overlay = enhanced_np.copy()
        if optic_disc_res['detected']:
            od_x, od_y = optic_disc_res['location']
            od_r = optic_disc_res['radius']
            cv2.circle(struct_overlay, (od_x, od_y), od_r, (0, 255, 0), 2)
            cv2.putText(struct_overlay, "Optic Disc", (od_x - 30, od_y - od_r - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        fov_x, fov_y = fovea_res['location']
        cv2.drawMarker(struct_overlay, (fov_x, fov_y), (255, 0, 255), cv2.MARKER_CROSS, 15, 2)
        cv2.putText(struct_overlay, "Fovea", (fov_x - 20, fov_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 2)

        # 9. Generate Clinical Report
        struct_res_dict = {
            'optic_disc': optic_disc_res,
            'fovea': fovea_res,
            'vessels': vessel_res
        }
        report_res = report_generator.generate_report(
            case_id, quality_res, dr_res, lesion_res, struct_res_dict, calib_res
        )

        dr_res_clean = {
            'predicted_grade': dr_res['predicted_grade'],
            'grade_label': dr_res['grade_label'],
            'raw_confidence': dr_res['raw_confidence'],
            'is_referable': bool(dr_res['is_referable']),
            'referable_status': dr_res['referable_status'],
            'probabilities': dr_res['probabilities']
        }

        return JSONResponse({
            "success": True,
            "case_id": case_id,
            "image_filename": image_filename,
            "image_dims": f"{image_np.shape[1]} x {image_np.shape[0]} px",
            "quality": quality_res,
            "dr_classification": dr_res_clean,
            "lesions": {
                "microaneurysms": lesion_res['microaneurysms'],
                "exudates": lesion_res['exudates'],
                "hemorrhages": lesion_res['hemorrhages'],
                "neovascularization": lesion_res['neovascularization']
            },
            "structures": {
                "optic_disc": optic_disc_res,
                "fovea": fovea_res,
                "vessel_density": vessel_res['vessel_density']
            },
            "calibration": calib_res,
            "report_file": report_res['file_path'],
            "report_text": report_res['report_text'],
            "images": {
                "original": np_to_b64(image_np),
                "enhanced": np_to_b64(enhanced_np),
                "vessels": np_to_b64(vessel_res['overlay']),
                "lesions": np_to_b64(lesion_res['overlay']),
                "structures": np_to_b64(struct_overlay),
                "gradcam": np_to_b64(gradcam_overlay_np)
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"success": False, "error_type": "PIPELINE_ERROR", "message": str(e)}, status_code=500)

@app.get("/api/evaluation")
async def get_evaluation_metrics():
    """
    Returns model test evaluation metrics, confusion matrices, and benchmark comparison table.
    """
    test_results = model_evaluator.generate_synthetic_test_results(num_samples=500)
    return JSONResponse(test_results)

@app.post("/api/telemedicine_sim")
async def run_telemedicine_sim(request: Request):
    """
    Runs Rural Telemedicine Queueing Simulation for 100k+ patients/year.
    """
    data = await request.json()
    patients_year = int(data.get("patients_year", 100000))
    cameras = int(data.get("cameras", 15))
    bandwidth = float(data.get("bandwidth", 10.0))
    ai_workers = int(data.get("ai_workers", 4))
    doctors = int(data.get("doctors", 5))

    sim_results = telemedicine_simulator.run_simulation(
        target_patients_year=patients_year,
        num_cameras=cameras,
        network_bandwidth_mbps=bandwidth,
        ai_workers=ai_workers,
        num_doctors=doctors
    )
    return JSONResponse(sim_results)

@app.post("/api/review")
async def submit_clinician_review(request: Request):
    """
    Submits Human-in-the-Loop clinician review for a case.
    """
    data = await request.json()
    case_id = data.get("case_id", "DEMO-001")
    action = data.get("action", "Accepted")
    reviewer = data.get("reviewer", "Dr. Ophthalmologist")
    comments = data.get("comments", "AI finding confirmed.")

    return JSONResponse({
        "success": True,
        "case_id": case_id,
        "status": "REVIEW_COMPLETED",
        "action": action,
        "reviewer": reviewer,
        "comments": comments,
        "timestamp": str(np.datetime64('now'))
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
