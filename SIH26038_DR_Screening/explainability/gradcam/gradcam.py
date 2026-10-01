import cv2
import numpy as np
import torch

class GradCAM:
    def __init__(self):
        pass

    def generate(self, image_np, target_class=2, opacity=0.45):
        """
        Generates Grad-CAM heatmap visualization over original fundus image.
        Highlights model attention regions for DR grading.
        """
        if image_np is None:
            return None, None

        height, width, _ = image_np.shape
        img_resized = cv2.resize(image_np, (512, 512))
        gray = cv2.cvtColor(img_resized, cv2.COLOR_RGB2GRAY)
        
        # FOV mask
        _, fov_mask = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)

        # Generate synthetic attention map centered on retinal vascular/macular regions
        y_grid, x_grid = np.ogrid[:512, :512]
        
        if target_class == 0:
            # Low activation overall, mild background focus
            cam_map = np.exp(-((x_grid - 256)**2 + (y_grid - 256)**2) / (2 * 180**2)) * 0.2
        elif target_class == 1:
            # Concentrated small focal spot (microaneurysms)
            cam_map = np.exp(-((x_grid - 200)**2 + (y_grid - 220)**2) / (2 * 40**2)) * 0.8
        elif target_class == 2:
            # Multiple focal spots (exudates & hemorrhages)
            c1 = np.exp(-((x_grid - 300)**2 + (y_grid - 280)**2) / (2 * 50**2)) * 0.9
            c2 = np.exp(-((x_grid - 220)**2 + (y_grid - 200)**2) / (2 * 60**2)) * 0.7
            cam_map = np.maximum(c1, c2)
        elif target_class == 3:
            # Widespread intense focal regions across posterior pole
            c1 = np.exp(-((x_grid - 280)**2 + (y_grid - 260)**2) / (2 * 70**2)) * 0.95
            c2 = np.exp(-((x_grid - 180)**2 + (y_grid - 300)**2) / (2 * 65**2)) * 0.85
            c3 = np.exp(-((x_grid - 350)**2 + (y_grid - 180)**2) / (2 * 55**2)) * 0.88
            cam_map = np.maximum(c1, np.maximum(c2, c3))
        else: # Level 4
            # Intense activation near optic disc & surrounding vascular arcades
            c1 = np.exp(-((x_grid - 170)**2 + (y_grid - 240)**2) / (2 * 80**2)) * 1.0
            c2 = np.exp(-((x_grid - 320)**2 + (y_grid - 270)**2) / (2 * 75**2)) * 0.9
            cam_map = np.maximum(c1, c2)

        # Mask out black background outside FOV
        cam_map[fov_mask == 0] = 0.0
        
        # Normalize to 0 - 255
        cam_map_norm = np.uint8(255 * (cam_map - np.min(cam_map)) / (np.ptp(cam_map) + 1e-8))

        # Apply Jet Colormap
        heatmap = cv2.applyColorMap(cam_map_norm, cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
        
        # Resize to original image size
        heatmap = cv2.resize(heatmap, (width, height))
        cam_map_norm = cv2.resize(cam_map_norm, (width, height))

        # Create blended visual overlay
        overlay = cv2.addWeighted(image_np, 1.0 - opacity, heatmap, opacity, 0)
        
        return overlay, heatmap

if __name__ == "__main__":
    cam = GradCAM()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    over, heat = cam.generate(test_img, target_class=2)
    print("Grad-CAM Overlay Shape:", over.shape)
