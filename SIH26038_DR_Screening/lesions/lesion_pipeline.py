import cv2
import numpy as np

class LesionAnalyzer:
    def __init__(self):
        pass

    def analyze(self, image_np, optic_disc_info=None, vessel_mask=None):
        """
        Unified lesion detection pipeline for:
        1. Microaneurysms (MA) - Tiny red dot lesions
        2. Exudates (EX) - Hard yellowish bright lipid deposits
        3. Hemorrhages (HE) - Dark red blotch / flame lesions
        4. Neovascularization (NV) - Abnormal vessel proliferation near disc
        """
        if image_np is None:
            return self._empty_response()

        height, width, _ = image_np.shape
        green = image_np[:, :, 1]
        red = image_np[:, :, 0]
        
        # FOV Mask
        _, fov_mask = cv2.threshold(green, 15, 255, cv2.THRESH_BINARY)
        
        # Optic Disc Mask (to avoid false positive exudates on bright disc)
        od_mask = np.zeros((height, width), dtype=np.uint8)
        if optic_disc_info and optic_disc_info.get('detected', False):
            od_x, od_y = optic_disc_info['location']
            od_r = int(optic_disc_info['radius'] * 1.3)
            cv2.circle(od_mask, (od_x, od_y), od_r, 255, -1)

        # 1. Detect Hard Exudates (Bright yellow spots in LAB / HSV)
        lab = cv2.cvtColor(image_np, cv2.COLOR_RGB2LAB)
        l_chan = lab[:, :, 0]
        b_chan = lab[:, :, 2] # Yellow chromaticity
        
        # Threshold high brightness and yellow component outside Optic Disc
        exudate_cand = (l_chan > 180) & (b_chan > 140) & (fov_mask > 0) & (od_mask == 0)
        exudate_mask = exudate_cand.astype(np.uint8) * 255
        
        # Morphological filtering to clean noise
        kernel_ex = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        exudate_mask = cv2.morphologyEx(exudate_mask, cv2.MORPH_OPEN, kernel_ex)
        
        num_exudates, _, stats_ex, centroids_ex = cv2.connectedComponentsWithStats(exudate_mask)
        exudate_count = max(0, num_exudates - 1)
        ex_detected = exudate_count >= 3

        # 2. Detect Microaneurysms & Hemorrhages (Dark red lesions on green channel)
        # Apply top-hat transform on inverted green channel
        green_inv = cv2.bitwise_not(green)
        kernel_ma = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        ma_tophat = cv2.morphologyEx(green_inv, cv2.MORPH_TOPHAT, kernel_ma)
        
        # Exclude blood vessels if vessel mask provided
        if vessel_mask is not None:
            dilated_vessels = cv2.dilate(vessel_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
            ma_tophat[dilated_vessels > 0] = 0

        ma_tophat[fov_mask == 0] = 0
        ma_tophat[od_mask > 0] = 0

        # Microaneurysms: small dot candidates (area 2 - 25 px)
        _, ma_thresh = cv2.threshold(ma_tophat, 30, 255, cv2.THRESH_BINARY)
        num_ma, labels_ma, stats_ma, _ = cv2.connectedComponentsWithStats(ma_thresh)
        
        ma_count = 0
        he_count = 0
        ma_coords = []
        he_coords = []

        for i in range(1, num_ma):
            area = stats_ma[i, cv2.CC_STAT_AREA]
            cx = stats_ma[i, cv2.CC_STAT_LEFT] + stats_ma[i, cv2.CC_STAT_WIDTH] // 2
            cy = stats_ma[i, cv2.CC_STAT_TOP] + stats_ma[i, cv2.CC_STAT_HEIGHT] // 2
            
            if 2 <= area <= 25:
                ma_count += 1
                ma_coords.append((int(cx), int(cy)))
            elif 26 <= area <= 400:
                he_count += 1
                he_coords.append((int(cx), int(cy)))

        ma_detected = ma_count >= 3
        he_detected = he_count >= 2

        # 3. Detect Neovascularization (Dense fine vessel network around disc edge)
        nv_detected = False
        nv_count = 0
        if optic_disc_info and optic_disc_info.get('detected', False) and vessel_mask is not None:
            od_x, od_y = optic_disc_info['location']
            od_r = optic_disc_info['radius']
            # Ring around optic disc (1.1x to 2.2x disc radius)
            ring_mask = np.zeros((height, width), dtype=np.uint8)
            cv2.circle(ring_mask, (od_x, od_y), int(od_r * 2.2), 255, -1)
            cv2.circle(ring_mask, (od_x, od_y), int(od_r * 1.1), 0, -1)
            
            vessels_near_disc = cv2.bitwise_and(vessel_mask, ring_mask)
            ring_area = np.count_nonzero(ring_mask)
            nv_vessel_pixels = np.count_nonzero(vessels_near_disc)
            if ring_area > 0 and (nv_vessel_pixels / ring_area) > 0.28:
                nv_detected = True
                nv_count = 1

        # Create combined lesion evidence visual overlay
        overlay = image_np.copy()
        
        # Yellow boxes for Exudates
        for i in range(1, num_exudates):
            x = stats_ex[i, cv2.CC_STAT_LEFT]
            y = stats_ex[i, cv2.CC_STAT_TOP]
            w = stats_ex[i, cv2.CC_STAT_WIDTH]
            h = stats_ex[i, cv2.CC_STAT_HEIGHT]
            cv2.rectangle(overlay, (x, y), (x+w, y+h), (255, 235, 0), 2)
            
        # Red circles for Microaneurysms
        for (cx, cy) in ma_coords:
            cv2.circle(overlay, (cx, cy), 4, (255, 0, 0), 1)

        # Dark Red boxes for Hemorrhages
        for (cx, cy) in he_coords:
            cv2.circle(overlay, (cx, cy), 8, (180, 0, 0), 2)

        return {
            'microaneurysms': {
                'detected': ma_detected,
                'count': ma_count,
                'status': 'DETECTED' if ma_detected else 'NOT DETECTED',
                'coords': ma_coords[:15]
            },
            'exudates': {
                'detected': ex_detected,
                'count': exudate_count,
                'status': 'DETECTED' if ex_detected else 'NOT DETECTED',
                'count_estimated': exudate_count
            },
            'hemorrhages': {
                'detected': he_detected,
                'count': he_count,
                'status': 'DETECTED' if he_detected else 'NOT DETECTED'
            },
            'neovascularization': {
                'detected': nv_detected,
                'count': nv_count,
                'status': 'DETECTED' if nv_detected else 'NOT DETECTED'
            },
            'overlay': overlay
        }

    def _empty_response(self):
        return {
            'microaneurysms': {'detected': False, 'count': 0, 'status': 'NOT DETECTED', 'coords': []},
            'exudates': {'detected': False, 'count': 0, 'status': 'NOT DETECTED', 'count_estimated': 0},
            'hemorrhages': {'detected': False, 'count': 0, 'status': 'NOT DETECTED'},
            'neovascularization': {'detected': False, 'count': 0, 'status': 'NOT DETECTED'},
            'overlay': None
        }

if __name__ == "__main__":
    analyzer = LesionAnalyzer()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    print("Lesion Analysis:", analyzer.analyze(test_img))
