import numpy as np

class ConfidenceCalibrator:
    def __init__(self, temperature=1.15):
        self.temperature = temperature

    def calibrate(self, raw_confidence, dr_grade=0, quality_score=85.0):
        """
        Calibrates raw neural network confidence using temperature scaling 
        and image quality factor penalties.
        """
        # Apply temperature scaling to soften overconfident predictions
        raw_prob = raw_confidence / 100.0
        
        # Quality adjustment factor: if quality is low, confidence is penalized
        q_factor = min(1.0, quality_score / 85.0)
        
        # Calibrated probability formula
        calib_prob = (raw_prob ** (1.0 / self.temperature)) * q_factor
        calibrated_confidence = float(min(98.0, max(15.0, calib_prob * 100.0)))

        if calibrated_confidence >= 82.0:
            category = "HIGH"
            recommendation = "AI result has high diagnostic reliability."
        elif calibrated_confidence >= 65.0:
            category = "MEDIUM"
            recommendation = "AI result has moderate reliability. Standard clinician review recommended."
        else:
            category = "LOW"
            recommendation = "LOW CONFIDENCE PREDICTION. Mandatory direct ophthalmologist review required before referral."

        return {
            'raw_confidence': round(raw_confidence, 1),
            'calibrated_confidence': round(calibrated_confidence, 1),
            'category': category,
            'temperature_applied': self.temperature,
            'recommendation': recommendation
        }

if __name__ == "__main__":
    calibrator = ConfidenceCalibrator()
    print("Calibration Result:", calibrator.calibrate(97.8, dr_grade=2, quality_score=78.0))
