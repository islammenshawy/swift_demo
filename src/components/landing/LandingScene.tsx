'use client';

import React, { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandingStore } from '@/stores/landingStore';
import ParticleSystem from './ParticleSystem';
import GlobeNetwork from './GlobeNetwork';
import DataStreams from './DataStreams';
import AnimationSelector from './AnimationSelector';

function AnimationContent() {
  const { animationStyle } = useLandingStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9A227" />

      {/* Direct conditional rendering */}
      {animationStyle === 'particles' && <ParticleSystem key="particles" />}
      {animationStyle === 'globe' && <GlobeNetwork key="globe" />}
      {animationStyle === 'dataStreams' && <DataStreams key="dataStreams" />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#C9A227" wireframe />
    </mesh>
  );
}

interface LandingSceneProps {
  onEnterPresentation: () => void;
}

export default function LandingScene({ onEnterPresentation }: LandingSceneProps) {
  const { setMousePosition, shouldExit, animationStyle } = useLandingStore();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'done' | 'error'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevAnimationRef = useRef(animationStyle);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);

  // Smooth transition effect when animation style changes
  useEffect(() => {
    if (prevAnimationRef.current !== animationStyle) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Match the CSS transition duration
      prevAnimationRef.current = animationStyle;
      return () => clearTimeout(timer);
    }
  }, [animationStyle]);

  // Export as screenshot
  const handleExportScreenshot = useCallback(async () => {
    setExportStatus('exporting');
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (containerRef.current) {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: '#0A1628',
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const link = document.createElement('a');
        link.download = `landing-${animationStyle}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setExportStatus('done');
        setTimeout(() => {
          setShowExportDialog(false);
          setExportStatus('idle');
        }, 1500);
      }
    } catch (err) {
      console.error('Export failed:', err);
      setExportStatus('error');
    }
  }, [animationStyle]);

  // Export as interactive HTML (uses the standalone export API)
  const handleExportHtml = useCallback(async () => {
    setExportStatus('exporting');
    try {
      const response = await fetch(`/api/export-standalone?demoId=landing-page&animationStyle=${animationStyle}`);
      if (!response.ok) {
        throw new Error('Export failed');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `landing-page-${animationStyle}.html`;
      link.click();
      URL.revokeObjectURL(url);
      setExportStatus('done');
      setTimeout(() => {
        setShowExportDialog(false);
        setExportStatus('idle');
      }, 1500);
    } catch (err) {
      console.error('HTML export failed:', err);
      setExportStatus('error');
    }
  }, [animationStyle]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <AnimationContent />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Smooth transition overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[var(--bg-primary)] pointer-events-none z-10"
      />

      {/* Overlay Content - positioned at edges to not block animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar - minimal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"
        >
          <div>
            <h1 className="text-2xl font-bold text-gradient-gold">Trade Finance Offsite Workshop</h1>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono text-[var(--accent-cyan)]">
              <CurrentTime />
            </div>
          </div>
        </motion.div>

        {/* Bottom content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pt-16 pb-8 px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Supply Chain Finance
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-6">
              Connecting Buyers, Suppliers & Banks Globally
            </p>

            {/* Action buttons */}
            <div className="pointer-events-auto flex flex-col sm:flex-row gap-3 items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnterPresentation}
                className="px-6 py-3 rounded-full gradient-gold text-[var(--bg-primary)] font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Presentation
              </motion.button>
              <motion.a
                href="/demos"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-semibold text-sm hover:bg-[var(--accent-cyan)]/10 transition-colors"
              >
                View Demos
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation selector with export */}
      <AnimationSelector onExport={() => setShowExportDialog(true)} />

      {/* Export Dialog */}
      <AnimatePresence>
        {showExportDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && exportStatus === 'idle' && setShowExportDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-md w-full mx-4 border border-[var(--accent-cyan)]/20 shadow-2xl"
            >
              {exportStatus === 'idle' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Export Landing Page</h2>
                    <button
                      onClick={() => setShowExportDialog(false)}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-[var(--text-secondary)] mb-4">
                    Export the current view as an image or interactive HTML file.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleExportScreenshot}
                      className="w-full p-4 rounded-xl border-2 border-white/10 hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 transition-all text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)]">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">Screenshot (PNG)</h3>
                          <p className="text-sm text-[var(--text-muted)] mt-1">High-quality image of the current view</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportHtml}
                      className="w-full p-4 rounded-xl border-2 border-white/10 hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 transition-all text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)]">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--text-primary)]">Interactive HTML</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">Recommended</span>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mt-1">Full animations, works offline</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {exportStatus === 'exporting' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--accent-gold)] animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <p className="text-[var(--text-primary)] font-medium">Exporting...</p>
                </div>
              )}

              {exportStatus === 'done' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[var(--text-primary)] font-medium">Export Complete!</p>
                </div>
              )}

              {exportStatus === 'error' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-[var(--text-primary)] font-medium mb-4">Export Failed</p>
                  <button
                    onClick={() => setExportStatus('idle')}
                    className="px-6 py-2 bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-semibold rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time || '--:--:--'}</span>;
}
