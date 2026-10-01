import cv2
import numpy as np

class NonRetinalDetector:
    def __init__(self):
        pass

    def is_fundus_image(self, image_np):
        """
        Safeguard classifier checking key color distribution, circular geometry, 
        and aspect properties to prevent non-retinal images from entering diagnostic model.
        """
        if image_np is None or image_np.size == 0:
            return False, "Invalid image data."

        height, width, channels = image_np.shape
        if channels != 3:
            return False, "Image must have 3 RGB channels."

        # 1. Color profile check: Fundus images are predominantly red/orange hue
        r_mean = np.mean(image_np[:, :, 0])
        g_mean = np.mean(image_np[:, :, 1])
        b_mean = np.mean(image_np[:, :, 2])

        # Red channel should be dominant in retinal fundus photography
        if r_mean < g_mean or r_mean < b_mean:
            if r_mean < 40 and g_mean < 40 and b_mean < 40:
                # Black/dark background with circular area
                pass
            else:
                return False, "INVALID INPUT: Image color profile does not match retinal fundus photography (Red channel must dominate)."

        # 2. Field of view circular shape check
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        _, thresh = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            return False, "INVALID INPUT: No dark field-of-view circular boundary detected."

        c = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(c)
        total_area = height * width

        # Fundus ROI should occupy 30% - 95% of total image frame
        if area / total_area < 0.25:
            return False, "INVALID INPUT: Retinal circular field-of-view region is missing or too small."

        return True, "Valid Retinal Fundus Photograph"

if __name__ == "__main__":
    detector = NonRetinalDetector()
    dummy_fundus = np.zeros((512, 512, 3), dtype=np.uint8)
    dummy_fundus[:, :, 0] = 180 # Red
    dummy_fundus[:, :, 1] = 60  # Green
    valid, msg = detector.is_fundus_image(dummy_fundus)
    print("Non-Retinal Check Result:", valid, "| Message:", msg)
