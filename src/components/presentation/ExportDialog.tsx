'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Demo } from '@/types/demo';
import {
  generateCapturePlan,
  CaptureStep,
  captureElement,
  createPptxFromImages,
  downloadPptx,
} from '@/lib/screenshot-export';
import { exportDemoToPptx, downloadPptx as downloadEditablePptx } from '@/lib/pptx-export';
import SlideRenderer from './SlideRenderer';

type ExportFormat = 'html-live' | 'html' | 'pptx-screenshot' | 'pptx-editable';

interface ExportOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  pros: string[];
  cons: string[];
  recommended?: boolean;
}

const exportOptions: ExportOption[] = [
  {
    id: 'html-live',
    name: 'Interactive HTML (Live)',
    description: 'Full animations with bundled React + Framer Motion',
    recommended: true,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    pros: ['Full live animations', 'Mirror of site', 'Works offline', 'Single HTML file'],
    cons: ['Larger file size (~600KB)'],
  },
  {
    id: 'html',
    name: 'HTML Standalone (Screenshots)',
    description: 'Self-contained HTML with embedded screenshot images',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    pros: ['Single file', 'No server needed', 'Click to advance'],
    cons: ['Static frames', 'No live animations'],
  },
  {
    id: 'pptx-screenshot',
    name: 'PowerPoint (Screenshots)',
    description: 'High-quality screenshots as slides',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    pros: ['Pixel-perfect', 'Native PowerPoint', 'Click to advance'],
    cons: ['Static images', 'Not editable'],
  },
  {
    id: 'pptx-editable',
    name: 'PowerPoint (Editable)',
    description: 'Editable shapes and text',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    pros: ['Fully editable', 'Small file size', 'Native PowerPoint'],
    cons: ['Basic styling', 'No animations'],
  },
];

interface ExportDialogProps {
  demo: Demo;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDialog({ demo, isOpen, onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [status, setStatus] = useState<'select' | 'capturing' | 'building' | 'done' | 'error'>('select');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<CaptureStep | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const captureRef = useRef<HTMLDivElement>(null);
  const [captureKey, setCaptureKey] = useState(0);

  const capturePlan = generateCapturePlan(demo);
  const totalSteps = capturePlan.length;

  // Export as HTML standalone with embedded screenshots
  const exportAsHtml = useCallback(async () => {
    setStatus('capturing');
    setProgress(0);

    const images: string[] = [];

    // Capture all slides/phases as screenshots
    for (let i = 0; i < capturePlan.length; i++) {
      const step = capturePlan[i];
      setCurrentStep(step);
      setCaptureKey(prev => prev + 1);

      // Wait for the slide to render with the correct phase
      const waitTime = step.totalPhases > 1 ? 800 + (step.phase * 300) : 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Capture the screenshot
      if (captureRef.current) {
        try {
          const image = await captureElement(captureRef.current);
          images.push(image);
        } catch (err) {
          console.error('Failed to capture slide:', err);
          setErrorMessage(`Failed to capture slide ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setStatus('error');
          return;
        }
      }

      setProgress(Math.round(((i + 1) / totalSteps) * 80));
    }

    // Build the HTML file
    setStatus('building');
    setProgress(90);

    try {
      const htmlContent = generateStandaloneHtmlWithImages(demo.title, images);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${demo.title.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('HTML export failed:', err);
      setErrorMessage('Failed to generate HTML file');
      setStatus('error');
    }
  }, [capturePlan, demo.title, totalSteps]);

  // Export as screenshot PPTX
  const exportAsScreenshotPptx = useCallback(async () => {
    setStatus('capturing');
    setProgress(0);

    const images: string[] = [];

    for (let i = 0; i < capturePlan.length; i++) {
      const step = capturePlan[i];
      setCurrentStep(step);
      setCaptureKey(prev => prev + 1);

      // Wait for the slide to render with the correct phase
      const waitTime = step.totalPhases > 1 ? 800 + (step.phase * 300) : 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Capture the screenshot
      if (captureRef.current) {
        try {
          const image = await captureElement(captureRef.current);
          images.push(image);
        } catch (err) {
          console.error('Failed to capture slide:', err);
          setErrorMessage(`Failed to capture slide ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setStatus('error');
          return;
        }
      }

      setProgress(Math.round(((i + 1) / totalSteps) * 80));
    }

    // Build the PowerPoint
    setStatus('building');
    setProgress(90);

    try {
      const blob = await createPptxFromImages(images, demo.title);
      const filename = `${demo.title.replace(/\s+/g, '-').toLowerCase()}.pptx`;
      downloadPptx(blob, filename);
      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('Failed to build PowerPoint:', err);
      setErrorMessage('Failed to build PowerPoint file');
      setStatus('error');
    }
  }, [capturePlan, demo.title, totalSteps]);

  // Export as editable PPTX
  const exportAsEditablePptx = useCallback(async () => {
    setStatus('building');
    setProgress(50);

    try {
      const blob = await exportDemoToPptx(demo);
      const filename = `${demo.title.replace(/\s+/g, '-').toLowerCase()}-editable.pptx`;
      downloadEditablePptx(blob, filename);
      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('Editable PPTX export failed:', err);
      setErrorMessage('Failed to generate editable PowerPoint');
      setStatus('error');
    }
  }, [demo]);

  // Export as video
  const exportAsVideo = useCallback(async () => {
    setStatus('capturing');
    setProgress(0);

    const images: string[] = [];
    const frameDelay = 2000; // 2 seconds per frame

    // Capture all frames
    for (let i = 0; i < capturePlan.length; i++) {
      const step = capturePlan[i];
      setCurrentStep(step);
      setCaptureKey(prev => prev + 1);

      // Wait for the slide to render
      const waitTime = step.totalPhases > 1 ? 800 + (step.phase * 300) : 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Capture the screenshot
      if (captureRef.current) {
        try {
          const image = await captureElement(captureRef.current);
          images.push(image);
        } catch (err) {
          console.error('Failed to capture slide:', err);
          setErrorMessage(`Failed to capture slide ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setStatus('error');
          return;
        }
      }

      setProgress(Math.round(((i + 1) / totalSteps) * 60));
    }

    // Build video from images
    setStatus('building');
    setProgress(70);

    try {
      const videoBlob = await createVideoFromImages(images, frameDelay);
      setProgress(95);

      // Download video
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${demo.title.replace(/\s+/g, '-').toLowerCase()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('Video export failed:', err);
      setErrorMessage('Failed to generate video file');
      setStatus('error');
    }
  }, [capturePlan, demo.title, totalSteps]);

  // Export as live interactive HTML (full static export)
  const exportAsLiveHtml = useCallback(async () => {
    setStatus('building');
    setProgress(10);

    try {
      // Call the standalone export API endpoint (uses pre-built bundle)
      const response = await fetch(`/api/export-standalone?demoId=${demo.id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export API error:', response.status, errorText);
        throw new Error(`Export failed: ${response.status} - ${errorText}`);
      }

      setProgress(90);

      // Download the HTML file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${demo.title.replace(/\s+/g, '-').toLowerCase()}-interactive.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('Live HTML export failed:', err);
      setErrorMessage('Failed to generate interactive export. Make sure the server is running.');
      setStatus('error');
    }
  }, [demo.id, demo.title]);

  // Start export based on selected format
  const startExport = useCallback(() => {
    if (!selectedFormat) return;

    switch (selectedFormat) {
      case 'html-live':
        exportAsLiveHtml();
        break;
      case 'html':
        exportAsHtml();
        break;
      case 'pptx-screenshot':
        exportAsScreenshotPptx();
        break;
      case 'pptx-editable':
        exportAsEditablePptx();
        break;
    }
  }, [selectedFormat, exportAsLiveHtml, exportAsHtml, exportAsScreenshotPptx, exportAsEditablePptx]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFormat(null);
      setStatus('select');
      setProgress(0);
      setCurrentStep(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && status === 'select' && onClose()}
      >
        {/* Export Dialog */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-2xl w-full mx-4 border border-[var(--accent-cyan)]/20 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Export Presentation
            </h2>
            {status === 'select' && (
              <button
                onClick={onClose}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Format Selection */}
          {status === 'select' && (
            <>
              <p className="text-[var(--text-secondary)] mb-4">
                Choose an export format for "{demo.title}"
              </p>

              <div className="space-y-3 mb-6">
                {exportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFormat(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedFormat === option.id
                        ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        selectedFormat === option.id
                          ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/20'
                          : 'text-[var(--text-muted)] bg-white/5'
                      }`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--text-primary)]">
                            {option.name}
                          </h3>
                          {option.recommended && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                          {option.description}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <div className="flex-1">
                            <p className="text-xs text-green-400 mb-1">Pros:</p>
                            <ul className="text-xs text-[var(--text-secondary)]">
                              {option.pros.map((pro, i) => (
                                <li key={i}>+ {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-orange-400 mb-1">Cons:</p>
                            <ul className="text-xs text-[var(--text-secondary)]">
                              {option.cons.map((con, i) => (
                                <li key={i}>- {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startExport}
                  disabled={!selectedFormat}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    selectedFormat
                      ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)] hover:bg-[var(--accent-cyan)]/90'
                      : 'bg-white/10 text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                >
                  Export
                </button>
              </div>
            </>
          )}

          {/* Progress State */}
          {(status === 'capturing' || status === 'building') && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--accent-gold)] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-[var(--text-primary)] font-medium mb-2">
                {status === 'capturing' ? 'Capturing slides...' : 'Building export...'}
              </p>
              {currentStep && status === 'capturing' && (
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Slide {currentStep.slideIndex + 1}
                  {currentStep.totalPhases > 1 && ` (Phase ${currentStep.phase + 1}/${currentStep.totalPhases})`}
                </p>
              )}
              <div className="w-full max-w-xs mx-auto bg-[var(--bg-primary)] rounded-full h-2 mb-2">
                <motion.div
                  className="bg-[var(--accent-gold)] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-[var(--text-muted)]">{progress}%</p>
            </div>
          )}

          {/* Done State */}
          {status === 'done' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[var(--text-primary)] font-medium mb-2">
                Export Complete!
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Your file has been downloaded
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-[var(--text-primary)] font-medium mb-2">
                Export Failed
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStatus('select');
                    setErrorMessage('');
                  }}
                  className="px-6 py-3 bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-[var(--accent-cyan)]/90 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-[var(--text-muted)] text-[var(--text-secondary)] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hidden capture container for screenshot export */}
        {status === 'capturing' && currentStep && (
          <div
            className="fixed pointer-events-none"
            style={{
              left: '-9999px',
              top: 0,
              width: '1920px',
              height: '1080px',
            }}
          >
            <div
              ref={captureRef}
              className="w-full h-full bg-[var(--bg-primary)]"
              style={{ width: '1920px', height: '1080px' }}
            >
              <SlideRenderer
                key={`capture-${captureKey}`}
                slide={currentStep.slide}
                forcePhase={currentStep.phase}
                isCapturing={true}
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Create video from sequence of images
async function createVideoFromImages(images: string[], frameDelay: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    // Get canvas stream for recording
    const stream = canvas.captureStream(30); // 30 fps
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000, // 8 Mbps for high quality
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(new Error('MediaRecorder error'));
    };

    // Start recording
    mediaRecorder.start();

    // Draw each image frame
    let currentFrame = 0;

    const drawNextFrame = () => {
      if (currentFrame >= images.length) {
        // Add a small delay before stopping to ensure last frame is captured
        setTimeout(() => {
          mediaRecorder.stop();
        }, 500);
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        currentFrame++;
        // Wait for frameDelay before drawing next frame
        setTimeout(drawNextFrame, frameDelay);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image frame ${currentFrame}`));
      };
      img.src = images[currentFrame];
    };

    // Start drawing frames
    drawNextFrame();
  });
}

// Generate standalone HTML with embedded screenshot images
function generateStandaloneHtmlWithImages(title: string, images: string[]): string {
  const imagesJson = JSON.stringify(images);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A1628;
      min-height: 100vh;
      overflow: hidden;
    }

    .presentation {
      width: 100vw;
      height: 100vh;
      position: relative;
      perspective: 1000px;
    }

    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: translateX(100%) rotateY(15deg);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    .slide.active {
      opacity: 1;
      transform: translateX(0) rotateY(0);
      pointer-events: auto;
    }
    .slide.prev {
      opacity: 0;
      transform: translateX(-100%) rotateY(-15deg);
    }
    .slide img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #0A1628;
    }

    .nav {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 100;
      background: rgba(15, 31, 53, 0.95);
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      border: 1px solid rgba(0, 212, 255, 0.3);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }
    .nav button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #00D4FF;
      background: transparent;
      color: #B4C7E7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .nav button:hover:not(:disabled) {
      background: #00D4FF;
      color: #0A1628;
      transform: scale(1.1);
    }
    .nav button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .nav .counter {
      color: #6B7C93;
      font-size: 0.875rem;
      min-width: 60px;
      text-align: center;
    }
    .nav .divider {
      width: 1px;
      height: 24px;
      background: rgba(0, 212, 255, 0.3);
    }

    .progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #0F1F35;
      z-index: 100;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #C9A227, #00D4FF);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    }

    .help {
      position: fixed;
      top: 1rem;
      right: 1rem;
      color: #6B7C93;
      font-size: 0.7rem;
      text-align: right;
      z-index: 100;
      background: rgba(15, 31, 53, 0.9);
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(0, 212, 255, 0.1);
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .help:hover { opacity: 1; }

    .title-bar {
      position: fixed;
      top: 1rem;
      left: 1rem;
      color: #B4C7E7;
      font-size: 0.875rem;
      z-index: 100;
      background: rgba(15, 31, 53, 0.9);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 1px solid rgba(0, 212, 255, 0.1);
    }

    /* Fullscreen styles */
    :fullscreen .nav { bottom: 1.5rem; }
    :fullscreen .help { display: none; }
    :fullscreen .title-bar { display: none; }
  </style>
</head>
<body>
  <div class="title-bar">${title}</div>

  <div class="presentation" id="presentation"></div>

  <div class="progress">
    <div class="progress-bar" id="progress"></div>
  </div>

  <div class="nav">
    <button id="prevBtn" title="Previous (←)">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 14l-4-4 4-4"/>
      </svg>
    </button>
    <span class="counter" id="counter">1 / 1</span>
    <button id="nextBtn" title="Next (→)">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 14l4-4-4-4"/>
      </svg>
    </button>
    <div class="divider"></div>
    <button id="fullscreenBtn" title="Fullscreen (F)">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" id="fsIcon">
        <path d="M4 8V4m0 0h4M4 4l5 5m7-1V4m0 0h-4m4 0l-5 5M4 10v4m0 0h4m-4 0l5-5m7 1v4m0 0h-4m4 0l-5-5"/>
      </svg>
    </button>
  </div>

  <div class="help">
    ← → Navigate | Space Next | F Fullscreen
  </div>

  <script>
    const images = ${imagesJson};
    let current = 0;
    let prevIndex = -1;

    function init() {
      const container = document.getElementById('presentation');
      images.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'slide' + (i === 0 ? ' active' : '');
        div.innerHTML = '<img src="' + src + '" alt="Slide ' + (i + 1) + '" draggable="false">';
        container.appendChild(div);
      });
      update();
    }

    function update() {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((el, i) => {
        el.classList.remove('active', 'prev');
        if (i === current) {
          el.classList.add('active');
        } else if (i < current) {
          el.classList.add('prev');
        }
      });
      document.getElementById('counter').textContent = (current + 1) + ' / ' + images.length;
      document.getElementById('progress').style.width = ((current + 1) / images.length * 100) + '%';
      document.getElementById('prevBtn').disabled = current === 0;
      document.getElementById('nextBtn').disabled = current === images.length - 1;
      prevIndex = current;
    }

    function next() {
      if (current < images.length - 1) {
        current++;
        update();
      }
    }
    function prev() {
      if (current > 0) {
        current--;
        update();
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          alert('Fullscreen not available: ' + err.message);
        });
      } else {
        document.exitFullscreen();
      }
    }

    document.getElementById('nextBtn').onclick = next;
    document.getElementById('prevBtn').onclick = prev;
    document.getElementById('fullscreenBtn').onclick = toggleFullscreen;

    // Click on slide area to advance
    document.getElementById('presentation').onclick = (e) => {
      if (e.target.closest('.nav')) return;
      const rect = document.getElementById('presentation').getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width / 2) {
        next();
      } else {
        prev();
      }
    };

    document.onkeydown = (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          prev();
          break;
        case 'f':
        case 'F':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Home':
          e.preventDefault();
          current = 0;
          update();
          break;
        case 'End':
          e.preventDefault();
          current = images.length - 1;
          update();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };

    // Update fullscreen icon
    document.onfullscreenchange = () => {
      const icon = document.getElementById('fsIcon');
      if (document.fullscreenElement) {
        icon.innerHTML = '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m10-5v5h-5"/>';
      } else {
        icon.innerHTML = '<path d="M4 8V4m0 0h4M4 4l5 5m7-1V4m0 0h-4m4 0l-5 5M4 10v4m0 0h4m-4 0l5-5m7 1v4m0 0h-4m4 0l-5-5"/>';
      }
    };

    init();
  </script>
</body>
</html>`;
}

// Generate true standalone HTML file with embedded slideshow (legacy - text only)
function generateStandaloneHtml(demo: Demo): string {
  // Serialize slide data for embedding
  const slidesJson = JSON.stringify(demo.slides);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${demo.title}</title>
  <style>
    :root {
      --bg-primary: #0A1628;
      --bg-secondary: #0F1F35;
      --accent-gold: #C9A227;
      --accent-cyan: #00D4FF;
      --text-primary: #FFFFFF;
      --text-secondary: #B4C7E7;
      --text-muted: #6B7C93;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      overflow: hidden;
    }

    /* Presentation container */
    .presentation {
      width: 100vw;
      height: 100vh;
      position: relative;
    }

    /* Slide base */
    .slide {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.5s ease-out;
      pointer-events: none;
    }
    .slide.active {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
    .slide.prev {
      opacity: 0;
      transform: translateX(-100%);
    }

    /* Title slide */
    .slide-title {
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }
    .slide-title h1 {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-gold), var(--accent-cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.8s ease-out;
    }
    .slide-title .subtitle {
      font-size: 1.5rem;
      color: var(--text-secondary);
      text-align: center;
      max-width: 800px;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    /* Content slide */
    .slide-content {
      background: var(--bg-primary);
      text-align: left;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 3rem 6rem;
    }
    .slide-content h2 {
      font-size: 2.5rem;
      color: var(--accent-cyan);
      margin-bottom: 2rem;
      animation: fadeInUp 0.6s ease-out;
    }
    .slide-content .content-body {
      font-size: 1.25rem;
      color: var(--text-secondary);
      line-height: 1.8;
      max-width: 1000px;
    }
    .slide-content ul {
      list-style: none;
      padding: 0;
    }
    .slide-content li {
      padding: 0.75rem 0;
      padding-left: 2rem;
      position: relative;
      animation: fadeInUp 0.6s ease-out both;
    }
    .slide-content li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--accent-gold);
    }
    .slide-content li:nth-child(1) { animation-delay: 0.1s; }
    .slide-content li:nth-child(2) { animation-delay: 0.2s; }
    .slide-content li:nth-child(3) { animation-delay: 0.3s; }
    .slide-content li:nth-child(4) { animation-delay: 0.4s; }
    .slide-content li:nth-child(5) { animation-delay: 0.5s; }
    .slide-content li:nth-child(6) { animation-delay: 0.6s; }

    /* Interactive slide placeholder */
    .slide-interactive {
      background: radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    }
    .slide-interactive h2 {
      font-size: 2.5rem;
      color: var(--accent-cyan);
      margin-bottom: 1rem;
    }
    .slide-interactive .viz-placeholder {
      width: 80%;
      max-width: 1000px;
      aspect-ratio: 16/9;
      background: var(--bg-secondary);
      border: 2px dashed var(--accent-cyan);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      margin-top: 2rem;
    }
    .slide-interactive .viz-placeholder svg {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Navigation */
    .nav {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 100;
    }
    .nav button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--accent-cyan);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .nav button:hover {
      background: var(--accent-cyan);
      color: var(--bg-primary);
    }
    .nav button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .nav button:disabled:hover {
      background: var(--bg-secondary);
      color: var(--text-secondary);
    }
    .nav .counter {
      color: var(--text-muted);
      font-size: 0.875rem;
      min-width: 60px;
      text-align: center;
    }

    /* Progress bar */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--bg-secondary);
      z-index: 100;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-gold), var(--accent-cyan));
      transition: width 0.3s ease-out;
    }

    /* Help overlay */
    .help {
      position: fixed;
      top: 1rem;
      right: 1rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      text-align: right;
      z-index: 100;
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="presentation" id="presentation">
    <!-- Slides will be rendered here -->
  </div>

  <div class="progress">
    <div class="progress-bar" id="progress"></div>
  </div>

  <div class="nav">
    <button id="prevBtn" title="Previous (←)">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <span class="counter" id="counter">1 / 1</span>
    <button id="nextBtn" title="Next (→)">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>

  <div class="help">
    Press F for fullscreen<br>
    Use arrow keys to navigate
  </div>

  <script>
    // Embedded slide data
    const slides = ${slidesJson};
    let currentSlide = 0;

    // Render slides
    function renderSlides() {
      const container = document.getElementById('presentation');
      container.innerHTML = '';

      slides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = 'slide slide-' + slide.type;
        div.id = 'slide-' + index;

        if (slide.type === 'title') {
          div.innerHTML = \`
            <h1>\${slide.content.title || ''}</h1>
            <p class="subtitle">\${slide.content.subtitle || ''}</p>
          \`;
        } else if (slide.type === 'content') {
          const bullets = slide.content.bullets || [];
          const bulletHtml = bullets.map(b => '<li>' + b + '</li>').join('');
          div.innerHTML = \`
            <h2>\${slide.content.title || ''}</h2>
            <div class="content-body">
              \${slide.content.body ? '<p>' + slide.content.body + '</p>' : ''}
              \${bullets.length ? '<ul>' + bulletHtml + '</ul>' : ''}
            </div>
          \`;
        } else if (slide.type === 'interactive') {
          div.innerHTML = \`
            <h2>\${slide.content.title || 'Interactive Visualization'}</h2>
            <div class="viz-placeholder">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>Interactive: \${slide.content.visualization || 'Visualization'}</span>
              <span style="font-size: 0.75rem; margin-top: 0.5rem;">View in full app for animations</span>
            </div>
          \`;
        } else {
          div.innerHTML = '<h2>' + (slide.content.title || 'Slide') + '</h2>';
        }

        container.appendChild(div);
      });

      updateSlide();
    }

    // Update current slide
    function updateSlide() {
      document.querySelectorAll('.slide').forEach((el, i) => {
        el.classList.remove('active', 'prev');
        if (i === currentSlide) {
          el.classList.add('active');
        } else if (i < currentSlide) {
          el.classList.add('prev');
        }
      });

      // Update counter
      document.getElementById('counter').textContent = (currentSlide + 1) + ' / ' + slides.length;

      // Update progress
      const progress = ((currentSlide + 1) / slides.length) * 100;
      document.getElementById('progress').style.width = progress + '%';

      // Update buttons
      document.getElementById('prevBtn').disabled = currentSlide === 0;
      document.getElementById('nextBtn').disabled = currentSlide === slides.length - 1;
    }

    // Navigation
    function nextSlide() {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
      }
    }

    // Event listeners
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        case 'Home':
          e.preventDefault();
          currentSlide = 0;
          updateSlide();
          break;
        case 'End':
          e.preventDefault();
          currentSlide = slides.length - 1;
          updateSlide();
          break;
      }
    });

    // Initialize
    renderSlides();
  </script>
</body>
</html>`;
}
