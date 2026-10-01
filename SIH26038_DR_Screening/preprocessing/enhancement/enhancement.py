import cv2
import numpy as np

class ImageEnhancer:
    def __init__(self, clip_limit=2.5, tile_grid_size=(8, 8)):
        self.clip_limit = clip_limit
        self.tile_grid_size = tile_grid_size

    def enhance(self, image_np):
        """
        Enhances borderline fundus images using CLAHE in LAB color space, 
        illumination balance, bilateral filtering for noise reduction, and retinal field cropping.
        """
        if image_np is None:
            return None

        # 1. Convert to LAB color space to process L (Lightness) channel without altering color hues
        lab = cv2.cvtColor(image_np, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)

        # 2. Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=self.clip_limit, tileGridSize=self.tile_grid_size)
        cl = clahe.apply(l)

        # 3. Recombine channels
        limg = cv2.merge((cl, a, b))
        enhanced_rgb = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)

        # 4. Illumination Balance: Subtract low-frequency background background field
        gray = cv2.cvtColor(enhanced_rgb, cv2.COLOR_RGB2GRAY)
        bg = cv2.GaussianBlur(gray, (0, 0), sigmaX=30)
        bg_rgb = cv2.cvtColor(bg, cv2.COLOR_GRAY2RGB)
        
        # Add back mean illumination offset
        norm_img = cv2.addWeighted(enhanced_rgb, 0.8, cv2.subtract(enhanced_rgb, bg_rgb), 0.4, 10)

        # 5. Denoise with Bilateral Filter to smooth noise while preserving vascular edges
        denoised = cv2.bilateralFilter(norm_img, d=5, sigmaColor=25, sigmaSpace=25)

        return denoised

    def crop_retinal_fov(self, image_np):
        """
        Crops black margins around the circular retinal field of view.
        """
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        _, thresh = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            c = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(c)
            # Add small margin
            h_img, w_img = gray.shape
            x = max(0, x - 5)
            y = max(0, y - 5)
            w = min(w_img - x, w + 10)
            h = min(h_img - y, h + 10)
            return image_np[y:y+h, x:x+w]
        return image_np

if __name__ == "__main__":
    enhancer = ImageEnhancer()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    enh = enhancer.enhance(test_img)
    print("Enhanced Image Shape:", enh.shape)
