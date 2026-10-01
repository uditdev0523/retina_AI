import cv2
import numpy as np

class ImageQualityAssessor:
    def __init__(self, focus_thresh=60.0, illum_low=40, illum_high=210, fov_min_ratio=0.35):
        self.focus_thresh = focus_thresh
        self.illum_low = illum_low
        self.illum_high = illum_high
        self.fov_min_ratio = fov_min_ratio

    def evaluate(self, image_np):
        """
        Evaluates focus, illumination, field of view, and contrast of fundus image.
        Returns detailed dictionary of metrics and overall gradeability.
        """
        if image_np is None or image_np.size == 0:
            return {
                "status": "UNGRADABLE",
                "overall_score": 0.0,
                "reason": "Invalid or empty image",
                "recommendation": "Please upload a valid fundus photograph."
            }

        # Convert to gray for focus/contrast calculations
        if len(image_np.shape) == 3:
            gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        else:
            gray = image_np

        height, width = gray.shape

        # 1. Focus / Sharpness via Laplacian Variance
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Scale score 0 - 100
        focus_score = min(100.0, (lap_var / self.focus_thresh) * 75.0)
        focus_status = "GOOD" if focus_score >= 70 else ("BORDERLINE" if focus_score >= 45 else "POOR")

        # 2. Illumination Analysis
        mean_illum = float(np.mean(gray))
        std_illum = float(np.std(gray))
        if self.illum_low <= mean_illum <= self.illum_high and std_illum > 15:
            illum_score = 90.0 - abs(mean_illum - 110) * 0.3
            illum_status = "GOOD"
        elif mean_illum < self.illum_low:
            illum_score = max(10.0, (mean_illum / self.illum_low) * 50.0)
            illum_status = "POOR (Underexposed)"
        else:
            illum_score = max(10.0, (1 - (mean_illum - self.illum_high)/45.0) * 50.0)
            illum_status = "POOR (Overexposed)"
        illum_score = max(0.0, min(100.0, illum_score))

        # 3. Field of View (FOV) ratio
        _, thresh = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)
        non_zero_ratio = float(np.count_nonzero(thresh)) / (height * width)
        fov_score = min(100.0, (non_zero_ratio / self.fov_min_ratio) * 85.0)
        fov_status = "ADEQUATE" if non_zero_ratio >= self.fov_min_ratio else "INADEQUATE"

        # 4. Contrast score (RMS Contrast)
        rms_contrast = std_illum
        contrast_score = min(100.0, (rms_contrast / 35.0) * 80.0)
        contrast_status = "GOOD" if contrast_score >= 65 else "POOR"

        # Overall Quality Score weighted formula
        overall_score = float(0.35 * focus_score + 0.30 * illum_score + 0.20 * fov_score + 0.15 * contrast_score)

        if overall_score >= 65.0 and focus_status != "POOR" and fov_status == "ADEQUATE":
            status = "GRADABLE"
            reason = "Image meets clinical resolution, focus, and illumination parameters."
            recommendation = "Proceed with DR screening analysis."
        elif overall_score >= 45.0:
            status = "BORDERLINE"
            reason = "Image has acceptable but sub-optimal focus or illumination contrast."
            recommendation = "Enhancement applied automatically before diagnostic classification."
        else:
            status = "UNGRADABLE"
            reason = f"Poor sharpness ({focus_status}), illumination ({illum_status}), or inadequate field of view."
            recommendation = "IMAGE NOT SUITABLE FOR DIAGNOSTIC SCREENING. Please recapture the fundus photograph using standard dilated retinal camera settings."

        return {
            "status": status,
            "overall_score": round(overall_score, 1),
            "focus_score": round(focus_score, 1),
            "focus_status": focus_status,
            "laplacian_variance": round(float(lap_var), 2),
            "illumination_score": round(illum_score, 1),
            "illumination_status": illum_status,
            "mean_brightness": round(mean_illum, 1),
            "fov_score": round(fov_score, 1),
            "fov_status": fov_status,
            "contrast_score": round(contrast_score, 1),
            "contrast_status": contrast_status,
            "reason": reason,
            "recommendation": recommendation
        }

if __name__ == "__main__":
    assessor = ImageQualityAssessor()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    res = assessor.evaluate(test_img)
    print("Quality Assessment Result:", res)
