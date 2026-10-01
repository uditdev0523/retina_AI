import cv2
import numpy as np

class VesselSegmenter:
    def __init__(self):
        pass

    def segment(self, image_np):
        """
        Segments blood vessels using green-channel extraction, CLAHE contrast enhancement,
        morphological top-hat / matched filtering, and adaptive thresholding.
        Returns: { 'vessel_mask': np.ndarray, 'vessel_density': float, 'overlay': np.ndarray }
        """
        if image_np is None:
            return {'vessel_mask': None, 'vessel_density': 0.0, 'overlay': None}

        # Green channel provides highest contrast between blood vessels and retinal background
        green = image_np[:, :, 1]

        # Apply CLAHE to green channel
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced_green = clahe.apply(green)

        # Morphological opening and top-hat operation to isolate tubular vascular structures
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
        tophat = cv2.morphologyEx(enhanced_green, cv2.MORPH_TOPHAT, kernel)

        # Invert to make vessels bright on dark background
        vessel_inv = cv2.bitwise_not(enhanced_green)
        vessel_inv_enhanced = cv2.addWeighted(vessel_inv, 0.6, tophat, 0.4, 0)

        # Adaptive thresholding
        vessel_mask = cv2.adaptiveThreshold(
            vessel_inv_enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 15, -2
        )

        # Mask out black background outside fundus FOV
        _, fov_mask = cv2.threshold(green, 15, 255, cv2.THRESH_BINARY)
        vessel_mask = cv2.bitwise_and(vessel_mask, fov_mask)

        # Clean noise with small morphological opening
        kernel_clean = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        vessel_mask = cv2.morphologyEx(vessel_mask, cv2.MORPH_OPEN, kernel_clean)

        # Calculate vessel density inside FOV
        fov_pixels = np.count_nonzero(fov_mask)
        vessel_pixels = np.count_nonzero(vessel_mask)
        density = (vessel_pixels / fov_pixels * 100.0) if fov_pixels > 0 else 0.0

        # Create cyan overlay on original image
        overlay = image_np.copy()
        overlay[vessel_mask > 0] = [0, 255, 220]  # Bright Cyan vessels

        return {
            'vessel_mask': vessel_mask,
            'vessel_density': round(density, 2),
            'overlay': overlay
        }

if __name__ == "__main__":
    segmenter = VesselSegmenter()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    res = segmenter.segment(test_img)
    print("Vessel Density:", res['vessel_density'], "%")
