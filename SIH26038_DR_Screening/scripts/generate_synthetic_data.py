import os
import math
import numpy as np

def create_synthetic_fundus(filename, dr_level=0, quality='GOOD', is_retinal=True):
    width, height = 512, 512
    img = np.zeros((height, width, 3), dtype=np.uint8)
    
    if not is_retinal:
        # Generate non-retinal image (e.g., text/geometric document pattern)
        img.fill(240)
        # Draw some arbitrary shapes and lines
        for i in range(10):
            y = 50 + i * 40
            img[y:y+5, 40:460] = [30, 30, 100]
        # Save image using pure numpy / standard writing or standard library PIL if available
        save_image_array(img, filename)
        return
    
    # Retinal Background: Dark red/orange circular region
    cy, cx = height // 2, width // 2
    radius = int(width * 0.45)
    
    y_grid, x_grid = np.ogrid[:height, :width]
    dist_from_center = np.sqrt((x_grid - cx)**2 + (y_grid - cy)**2)
    fundus_mask = dist_from_center <= radius
    
    # Base retinal background color (warm reddish-orange gradient)
    for y in range(height):
        for x in range(width):
            if fundus_mask[y, x]:
                # Slight shading towards edges (vignetting/spherical curvature)
                d = dist_from_center[y, x] / radius
                shading = 1.0 - 0.3 * (d ** 2)
                r = int(min(255, (200 + 40 * math.sin(x/50)) * shading))
                g = int(min(255, (80 + 20 * math.cos(y/50)) * shading))
                b = int(min(255, (20 * shading)))
                img[y, x] = [r, g, b]
            else:
                img[y, x] = [5, 5, 5]  # Black border outside FOV

    # Optic Disc: Bright yellowish circular area located slightly left-of-center
    od_cx, od_cy = cx - int(width * 0.2), cy - int(height * 0.05)
    od_radius = int(width * 0.08)
    od_dist = np.sqrt((x_grid - od_cx)**2 + (y_grid - od_cy)**2)
    od_mask = od_dist <= od_radius
    
    for y in range(height):
        for x in range(width):
            if od_mask[y, x]:
                d = od_dist[y, x] / od_radius
                intensity = 1.0 - 0.2 * (d**2)
                img[y, x] = [int(240 * intensity), int(220 * intensity), int(140 * intensity)]

    # Fovea: Darker macula region located slightly right of center
    fov_cx, fov_cy = cx + int(width * 0.12), cy + int(height * 0.02)
    fov_radius = int(width * 0.06)
    fov_dist = np.sqrt((x_grid - fov_cx)**2 + (y_grid - fov_cy)**2)
    fov_mask = fov_dist <= fov_radius
    for y in range(height):
        for x in range(width):
            if fov_mask[y, x]:
                d = fov_dist[y, x] / fov_radius
                factor = 0.6 + 0.4 * d
                img[y, x] = [int(img[y, x, 0] * factor), int(img[y, x, 1] * factor), int(img[y, x, 2] * factor)]

    # Blood Vessel Tree (Branching curves originating from Optic Disc)
    # Draw dark reddish-brown branching vessel paths
    angles = [-0.8, -0.4, 0.0, 0.4, 0.8, 2.3, 2.7, 3.5, 3.9]
    for angle in angles:
        curr_x, curr_y = float(od_cx), float(od_cy)
        curr_angle = angle
        steps = 150
        thickness = 4
        for step in range(steps):
            curr_x += math.cos(curr_angle) * 2.5
            curr_y += math.sin(curr_angle) * 2.5
            curr_angle += np.random.uniform(-0.08, 0.08)
            
            ix, iy = int(round(curr_x)), int(round(curr_y))
            t = max(1, int(thickness * (1.0 - step / steps * 0.7)))
            
            if 0 <= ix < width and 0 <= iy < height and fundus_mask[iy, ix]:
                y_min, y_max = max(0, iy - t), min(height, iy + t + 1)
                x_min, x_max = max(0, ix - t), min(width, ix + t + 1)
                for py in range(y_min, y_max):
                    for px in range(x_min, x_max):
                        # Dark vessel color
                        img[py, px] = [int(img[py, px, 0] * 0.35), int(img[py, px, 1] * 0.15), int(img[py, px, 2] * 0.1)]

    # Add Lesions according to DR Level
    if dr_level >= 1:
        # Microaneurysms: Tiny deep red dots
        num_ma = 5 if dr_level == 1 else (15 if dr_level == 2 else 35)
        np.random.seed(42 + dr_level)
        for _ in range(num_ma):
            rx = np.random.randint(cx - int(width*0.3), cx + int(width*0.3))
            ry = np.random.randint(cy - int(height*0.3), cy + int(height*0.3))
            if fundus_mask[ry, rx] and od_dist[ry, rx] > od_radius + 10:
                img[ry-1:ry+2, rx-1:rx+2] = [160, 20, 10]

    if dr_level >= 2:
        # Hard Exudates: Bright yellowish/white spots with sharp margins
        num_ex = 8 if dr_level == 2 else 25
        np.random.seed(100 + dr_level)
        for _ in range(num_ex):
            rx = np.random.randint(cx - int(width*0.25), cx + int(width*0.25))
            ry = np.random.randint(cy - int(height*0.25), cy + int(height*0.25))
            if fundus_mask[ry, rx] and od_dist[ry, rx] > od_radius + 15:
                r_size = np.random.randint(3, 7)
                img[max(0, ry-r_size):min(height, ry+r_size), max(0, rx-r_size):min(width, rx+r_size)] = [245, 235, 170]

    if dr_level >= 3:
        # Hemorrhages: Dark red blotches / flame-shaped dark spots
        num_hem = 12 if dr_level == 3 else 30
        np.random.seed(200 + dr_level)
        for _ in range(num_hem):
            rx = np.random.randint(cx - int(width*0.3), cx + int(width*0.3))
            ry = np.random.randint(cy - int(height*0.3), cy + int(height*0.3))
            if fundus_mask[ry, rx] and od_dist[ry, rx] > od_radius + 10:
                r_w = np.random.randint(4, 10)
                r_h = np.random.randint(4, 10)
                img[max(0, ry-r_h):min(height, ry+r_h), max(0, rx-r_w):min(width, rx+r_w)] = [110, 10, 10]

    if dr_level == 4:
        # Neovascularization: Fine abnormal tortuous vessel net near optic disc
        for _ in range(40):
            ang = np.random.uniform(0, 2*math.pi)
            r_dist = np.random.uniform(od_radius, od_radius + 35)
            nx = int(od_cx + r_dist * math.cos(ang))
            ny = int(od_cy + r_dist * math.sin(ang))
            if 0 <= nx < width and 0 <= ny < height:
                img[max(0, ny-1):min(height, ny+2), max(0, nx-1):min(width, nx+2)] = [140, 30, 20]

    # Apply Quality degradation if specified
    if quality == 'POOR':
        # Blur (box blur) and low illumination gradient
        temp = img.astype(np.float32)
        # Apply heavy blur
        kernel_size = 15
        pad = kernel_size // 2
        padded = np.pad(temp, ((pad, pad), (pad, pad), (0, 0)), mode='edge')
        blurred = np.zeros_like(temp)
        for y in range(height):
            for x in range(width):
                blurred[y, x] = np.mean(padded[y:y+kernel_size, x:x+kernel_size], axis=(0, 1))
        # Reduce brightness
        blurred = blurred * 0.4
        img = np.clip(blurred, 0, 255).astype(np.uint8)

    save_image_array(img, filename)

def save_image_array(arr, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    try:
        from PIL import Image
        img_pil = Image.fromarray(arr)
        img_pil.save(filepath)
        print(f"Saved: {filepath}")
    except ImportError:
        # Fallback to pure python PPM/BMP writer if PIL is not yet installed
        write_ppm(arr, filepath.replace('.png', '.ppm'))

def write_ppm(arr, filepath):
    h, w, c = arr.shape
    with open(filepath, 'wb') as f:
        f.write(f"P6\n{w} {h}\n255\n".encode())
        f.write(arr.tobytes())
    print(f"Saved PPM fallback: {filepath}")

def generate_all_demo_data(data_dir):
    os.makedirs(data_dir, exist_ok=True)
    create_synthetic_fundus(os.path.join(data_dir, "demo_no_dr.png"), dr_level=0, quality='GOOD')
    create_synthetic_fundus(os.path.join(data_dir, "demo_mild_dr.png"), dr_level=1, quality='GOOD')
    create_synthetic_fundus(os.path.join(data_dir, "demo_moderate_dr.png"), dr_level=2, quality='GOOD')
    create_synthetic_fundus(os.path.join(data_dir, "demo_severe_dr.png"), dr_level=3, quality='GOOD')
    create_synthetic_fundus(os.path.join(data_dir, "demo_poor_quality.png"), dr_level=0, quality='POOR')
    create_synthetic_fundus(os.path.join(data_dir, "non_retinal.png"), is_retinal=False)
    print("All demo synthetic fundus images generated successfully!")

if __name__ == "__main__":
    target_dir = os.path.join(os.path.dirname(__file__), "..", "data", "demo")
    generate_all_demo_data(target_dir)
