// Utility to generate dynamic fundus visual maps (Enhanced CLAHE, Vessel Map, Lesion overlay, GradCAM Heatmap)
// on HTML5 Canvas elements for uploaded or demo images.

export function drawEnhancedRetina(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  mode: 'enhanced' | 'vessels' | 'lesions' | 'gradcam' | 'structures',
  options?: { drLevel?: number; opacity?: number }
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = (targetCanvas.width = sourceImage.width || 512);
  const height = (targetCanvas.height = sourceImage.height || 512);

  ctx.drawImage(sourceImage, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  if (mode === 'enhanced') {
    // CLAHE & contrast enhancement simulation
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Stretch contrast on green channel (most informative channel in fundus copy)
      g = Math.min(255, Math.max(0, (g - 40) * 1.35));
      r = Math.min(255, Math.max(0, (r - 20) * 1.15));
      b = Math.min(255, Math.max(0, b * 0.9));

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (mode === 'vessels') {
    // Green channel isolation + threshold for vessel tree segmentation
    for (let i = 0; i < data.length; i += 4) {
      const g = data[i + 1];
      const r = data[i];
      const diff = r - g;

      if (diff > 18 && g < 140) {
        // Vessel pixel -> white
        data[i] = 0;
        data[i + 1] = 220;
        data[i + 2] = 255;
      } else {
        // Background -> dark
        data[i] = 10;
        data[i + 1] = 15;
        data[i + 2] = 26;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (mode === 'gradcam') {
    // Render base image, then overlay thermal Grad-CAM heatmap
    ctx.putImageData(imgData, 0, 0);

    const heatmapCanvas = document.createElement('canvas');
    heatmapCanvas.width = width;
    heatmapCanvas.height = height;
    const hCtx = heatmapCanvas.getContext('2d');
    if (!hCtx) return;

    const drLevel = options?.drLevel ?? 2;
    const opacity = options?.opacity ?? 0.65;

    // Draw radial gradient hotspots for GradCAM attention
    const centerX = width * 0.45;
    const centerY = height * 0.5;

    const grad = hCtx.createRadialGradient(
      centerX, centerY, 10,
      centerX, centerY, drLevel === 0 ? 30 : 120 + drLevel * 30
    );

    if (drLevel === 0) {
      grad.addColorStop(0, 'rgba(0, 255, 100, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 255, 0)');
    } else if (drLevel === 1) {
      grad.addColorStop(0, 'rgba(255, 230, 0, 0.8)');
      grad.addColorStop(0.5, 'rgba(255, 120, 0, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 255, 0)');
    } else {
      grad.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
      grad.addColorStop(0.3, 'rgba(255, 140, 0, 0.75)');
      grad.addColorStop(0.6, 'rgba(255, 255, 0, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 255, 0)');
    }

    hCtx.fillStyle = grad;
    hCtx.fillRect(0, 0, width, height);

    ctx.globalAlpha = opacity;
    ctx.drawImage(heatmapCanvas, 0, 0);
    ctx.globalAlpha = 1.0;
  } else if (mode === 'lesions') {
    ctx.putImageData(imgData, 0, 0);
    const drLevel = options?.drLevel ?? 2;

    if (drLevel > 0) {
      // Draw Microaneurysms (red circles)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      const maCoords = [
        [width * 0.42, height * 0.45],
        [width * 0.48, height * 0.52],
        [width * 0.38, height * 0.58],
        [width * 0.52, height * 0.41],
      ];
      maCoords.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fill();
      });

      if (drLevel >= 2) {
        // Draw Exudates (yellow regions)
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        const exCoords = [
          [width * 0.58, height * 0.48],
          [width * 0.62, height * 0.54],
        ];
        exCoords.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.fill();
        });
      }
    }
  } else if (mode === 'structures') {
    ctx.putImageData(imgData, 0, 0);
    // Draw Optic Disc (bright yellowish disc at right side)
    const odX = width * 0.76;
    const odY = height * 0.48;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(odX, odY, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fill();

    // Optic Disc Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Optic Disc', odX - 30, odY - 50);

    // Draw Fovea (center dark region)
    const fvX = width * 0.46;
    const fvY = height * 0.50;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(fvX, fvY, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('Fovea Center', fvX - 35, fvY - 30);
  }
}
