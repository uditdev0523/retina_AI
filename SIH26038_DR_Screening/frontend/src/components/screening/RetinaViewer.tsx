import React, { useState, useRef, useEffect } from 'react';
import { drawEnhancedRetina } from '../../services/retinaCanvasGenerator';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Layers, 
  Eye, 
  Sliders, 
  Split,
  Download,
  Info
} from 'lucide-react';

interface RetinaViewerProps {
  originalUrl: string;
  drLevel?: number;
  qualityStatus?: string;
}

export const RetinaViewer: React.FC<RetinaViewerProps> = ({ 
  originalUrl, 
  drLevel = 2,
  qualityStatus = 'GRADABLE' 
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'enhanced' | 'gradcam' | 'lesions' | 'vessels' | 'structures'>('original');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.70);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const splitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load image & draw on Canvas whenever tab, URL, opacity or level changes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalUrl;
    img.onload = () => {
      if (canvasRef.current) {
        if (activeTab === 'original') {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = img.width || 512;
            canvasRef.current.height = img.height || 512;
            ctx.drawImage(img, 0, 0);
          }
        } else {
          drawEnhancedRetina(img, canvasRef.current, activeTab, {
            drLevel,
            opacity: heatmapOpacity
          });
        }
      }

      if (isSplitView && splitCanvasRef.current) {
        drawEnhancedRetina(img, splitCanvasRef.current, 'enhanced', { drLevel });
      }
    };
  }, [originalUrl, activeTab, drLevel, heatmapOpacity, isSplitView]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setShowOverlays(true);
  };

  const handleDownloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `retina_screen_${activeTab}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const tabs = [
    { id: 'original', label: 'Original' },
    { id: 'enhanced', label: 'Enhanced (CLAHE)' },
    { id: 'gradcam', label: 'Grad-CAM Heatmap' },
    { id: 'lesions', label: 'Lesion Annotations' },
    { id: 'vessels', label: 'Vessel Segment' },
    { id: 'structures', label: 'Retinal Structures' },
  ];

  return (
    <div className={`bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      
      {/* Top Header Controls Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-medical-600 text-white shadow-md shadow-medical-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-2">
          
          {/* Compare Split View Toggle */}
          <button
            onClick={() => setIsSplitView(!isSplitView)}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              isSplitView ? 'bg-medical-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Original vs Enhanced Split View"
          >
            <Split className="w-4 h-4" />
            <span className="hidden sm:inline">Split View</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-850 rounded-lg p-0.5 border border-slate-750">
            <button 
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-750"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-2 font-semibold">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-750"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-750 rounded-lg"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button 
            onClick={handleDownloadImage}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-750 rounded-lg"
            title="Download Canvas Snapshot"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-750 rounded-lg"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas View Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 bg-black min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden p-4 select-none"
      >
        {isSplitView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Fundus</span>
              <div className="flex justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <canvas 
                  ref={canvasRef}
                  className="max-h-[360px] object-contain transition-transform duration-150"
                  style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-medical-400 uppercase tracking-wider">CLAHE Enhanced</span>
              <div className="flex justify-center overflow-hidden rounded-xl border border-medical-900/50 bg-slate-950">
                <canvas 
                  ref={splitCanvasRef}
                  className="max-h-[360px] object-contain transition-transform duration-150"
                  style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <canvas 
              ref={canvasRef}
              className="max-h-[440px] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-150"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            />
          </div>
        )}

        {/* Grad-CAM Opacity Slider Control Floating Panel */}
        {activeTab === 'gradcam' && (
          <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center gap-3 text-xs text-white shadow-xl z-20">
            <Sliders className="w-4 h-4 text-medical-400" />
            <span>Heatmap Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
              className="w-24 accent-medical-500 cursor-pointer"
            />
            <span className="font-mono text-slate-300 font-bold">{Math.round(heatmapOpacity * 100)}%</span>
          </div>
        )}

        {/* Quality status floating badge */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>512x512 Fundus Copy</span>
        </div>
      </div>

      {/* Caption bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-medical-400" />
          <span>
            {activeTab === 'original' && 'Raw non-mydriatic fundus photograph.'}
            {activeTab === 'enhanced' && 'Contrast-Limited Adaptive Histogram Equalization (CLAHE) applied.'}
            {activeTab === 'gradcam' && 'Grad-CAM spatial heatmap overlay showing neural network attention region.'}
            {activeTab === 'lesions' && 'Automated biomarker annotation (Microaneurysms, Exudates).'}
            {activeTab === 'vessels' && 'Green-channel vessel tree segmentation map.'}
            {activeTab === 'structures' && 'Optic Disc boundary and Foveal center detection.'}
          </span>
        </div>
        <span className="hidden md:inline text-[11px] text-slate-500">Interactive Canvas View</span>
      </div>

    </div>
  );
};
