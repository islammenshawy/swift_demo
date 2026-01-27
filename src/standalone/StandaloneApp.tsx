'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import actual visualization components
import InteractiveSlide from '@/components/presentation/slides/InteractiveSlide';
import ChartSlide from '@/components/presentation/slides/ChartSlide';
import TimelineSlide from '@/components/presentation/slides/TimelineSlide';
import type { SlideContent, Slide as DemoSlide, Demo as DemoType, VisualizationType } from '@/types/demo';

// Local types for standalone (JSON data may have looser types)
interface StandaloneSlide {
  id: string;
  order: number;
  type: string;
  content: SlideContent;
  animation?: { entry: string; duration: number; delay: number };
}

interface StandaloneDemo {
  id: string;
  title: string;
  description: string;
  slides: StandaloneSlide[];
}

// Demo data is injected via window at runtime
declare global {
  interface Window {
    DEMO_DATA: StandaloneDemo;
  }
}

// Phase counts for visualizations
const PHASE_COUNTS: Record<string, number> = {
  'module-consolidation': 6,   // 6 phases for the consolidation animation
  'legacy-problems': 8,        // 8 problems to cycle through
  'technical-challenges': 5,   // 5 challenges to cycle through
  'product-opportunities': 6,  // 6 opportunities to cycle through
  'transformation-goals': 1,
  'elc-reimagination': 1,
  'transformation-metrics': 1,
  'trade-architecture': 1,
  // Evalio visualizations
  'engineering-score-journey': 5,
  'problem-visual': 1,
  'solution-visual': 1,
  'score-calculation': 1,
  'level-weights': 1,
  'team-benchmarking': 1,
  'ai-capabilities': 1,
  'promotion-pipeline': 1,
  'feature-showcase': 9, // phase 0-1 initial, phases 2-8 cycle through 7 features
};

function getPhaseCount(slide: StandaloneSlide): number {
  if (slide.type === 'interactive' && slide.content.visualization) {
    return PHASE_COUNTS[slide.content.visualization] || 1;
  }
  return 1;
}

// Title Slide Component - matches live site with animated circles
function TitleSlide({ content }: { content: SlideContent }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 relative">
      {/* Background decoration - animated circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 0.15, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-[600px] h-[600px] rounded-full border-2 border-[var(--accent-gold)]"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 0.2, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[400px] h-[400px] rounded-full border border-[var(--accent-cyan)]"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 0.3, 0.15] }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-cyan)]/20 blur-xl"
        />
        {/* Pulsing glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)', opacity: 0.1 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {content.title && (
          <motion.div
            initial={{ filter: 'blur(20px)', scale: 0.9 }}
            animate={{ filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              {content.title}
            </h1>
          </motion.div>
        )}

        {content.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)]"
          >
            {content.subtitle}
          </motion.p>
        )}

        {content.text && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-8 text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
          >
            {content.text}
          </motion.p>
        )}
      </div>

      {/* Bottom accent line with glow */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <div className="w-32 h-1 rounded-full" style={{ background: 'linear-gradient(135deg, #C9A227 0%, #E5C44D 100%)' }} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-32 h-1 rounded-full blur-md"
          style={{ background: 'linear-gradient(135deg, #C9A227 0%, #E5C44D 100%)' }}
        />
      </motion.div>
    </div>
  );
}

// Content Slide Component
function ContentSlide({ content }: { content: SlideContent }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-[var(--bg-primary)]">
      {content.title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-[var(--accent-cyan)] mb-8 text-center"
        >
          {content.title}
        </motion.h2>
      )}
      {content.bullets && (
        <ul className="max-w-3xl space-y-4">
          {content.bullets.map((bullet, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex items-start gap-4 text-xl text-[var(--text-secondary)]"
            >
              <span className="text-[var(--accent-gold)]">→</span>
              {bullet}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Slide Renderer
function SlideRenderer({ slide, phase }: { slide: StandaloneSlide; phase: number }) {
  if (slide.type === 'title') {
    return <TitleSlide content={slide.content} />;
  }
  if (slide.type === 'interactive' && slide.content.visualization) {
    return (
      <InteractiveSlide
        content={slide.content}
        slideId={slide.id}
        forcePhase={phase}
        isCapturing={false}
      />
    );
  }
  if (slide.type === 'chart') {
    return <ChartSlide content={slide.content} />;
  }
  if (slide.type === 'timeline') {
    return <TimelineSlide content={slide.content} />;
  }
  return <ContentSlide content={slide.content} />;
}

// Slide variants for transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

// Pre-slide Launcher Component
function LauncherScreen({
  title,
  onStartWindowed,
  onStartFullscreen
}: {
  title: string;
  onStartWindowed: () => void;
  onStartFullscreen: () => void;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[var(--bg-primary)] flex flex-col items-center justify-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 0.1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-[800px] h-[800px] rounded-full border border-[var(--accent-gold)]/30"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 0.15, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[500px] h-[500px] rounded-full border border-[var(--accent-cyan)]/20"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[var(--accent-gold)]/10 to-[var(--accent-cyan)]/10 blur-2xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg text-[var(--text-muted)] mb-12"
        >
          Choose how you want to view this presentation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Windowed Mode Button */}
          <button
            onClick={onStartWindowed}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-[var(--accent-cyan)] hover:bg-gray-800 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16" />
            </svg>
            <div className="text-left">
              <p className="text-white font-semibold">Windowed Mode</p>
              <p className="text-sm text-gray-400">View in browser window</p>
            </div>
          </button>

          {/* Fullscreen Mode Button */}
          <button
            onClick={onStartFullscreen}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/50 hover:border-[var(--accent-gold)] hover:from-[var(--accent-cyan)]/30 hover:to-[var(--accent-gold)]/30 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <div className="text-left">
              <p className="text-white font-semibold">Full Screen</p>
              <p className="text-sm text-gray-400">Immersive presentation</p>
            </div>
          </button>
        </motion.div>

        {/* Keyboard hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
        >
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">←</kbd>
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">→</kbd>
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">Space</kbd>
            <span>Next</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">+</kbd>
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">-</kbd>
            <span>Zoom</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">F</kbd>
            <span>Fullscreen</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Main App Component
export default function StandaloneApp() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(5); // seconds
  const [showSettings, setShowSettings] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  const demo = window.DEMO_DATA;
  const slides = demo.slides;
  const totalPhases = getPhaseCount(slides[currentSlide]);

  const next = useCallback(() => {
    if (currentPhase < totalPhases - 1) {
      setCurrentPhase(prev => prev + 1);
      setDirection(1);
    } else if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setCurrentPhase(0);
      setDirection(1);
    }
  }, [currentSlide, currentPhase, totalPhases, slides.length]);

  const prev = useCallback(() => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1);
      setDirection(-1);
    } else if (currentSlide > 0) {
      const prevSlidePhases = getPhaseCount(slides[currentSlide - 1]);
      setCurrentSlide(prev => prev - 1);
      setCurrentPhase(prevSlidePhases - 1);
      setDirection(-1);
    }
  }, [currentSlide, currentPhase, slides]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Reset zoom when changing slides
  useEffect(() => {
    setZoomLevel(1);
  }, [currentSlide]);

  // Start presentation handlers
  const startWindowed = useCallback(() => {
    setHasStarted(true);
  }, []);

  const startFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen().then(() => {
      setIsFullscreen(true);
      setHasStarted(true);
    }).catch(() => {
      // If fullscreen fails, start in windowed mode
      setHasStarted(true);
    });
  }, []);

  // Keyboard navigation - only active after presentation starts
  useEffect(() => {
    if (!hasStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          setCurrentPhase(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(slides.length - 1);
          setCurrentPhase(0);
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, next, prev, toggleFullscreen, slides.length, zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom handler
  useEffect(() => {
    if (!hasStarted) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [hasStarted, zoomIn, zoomOut]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls on mouse inactivity
  useEffect(() => {
    if (!hasStarted) return;

    const showControls = () => {
      setControlsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    // Show controls initially
    showControls();

    const handleMouseMove = () => {
      showControls();
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hasStarted]);

  // Auto-play functionality - directly calls next() at the selected interval
  useEffect(() => {
    if (!isAutoPlaying || !hasStarted) return;

    const isAtEnd = currentSlide === slides.length - 1 && currentPhase === totalPhases - 1;
    if (isAtEnd) {
      setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      next();
    }, autoPlayInterval * 1000);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, hasStarted, autoPlayInterval, currentSlide, currentPhase, totalPhases, slides.length, next]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // Show launcher screen if presentation hasn't started
  if (!hasStarted) {
    return (
      <LauncherScreen
        title={demo.title}
        onStartWindowed={startWindowed}
        onStartFullscreen={startFullscreen}
      />
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-[var(--bg-primary)] relative">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content - key only changes on slide change, not phase change */}
      <div className="absolute inset-0 overflow-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full h-full"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              minHeight: zoomLevel > 1 ? `${100 * zoomLevel}%` : '100%',
              minWidth: zoomLevel > 1 ? `${100 * zoomLevel}%` : '100%',
            }}
          >
            <SlideRenderer slide={slides[currentSlide]} phase={currentPhase} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 transition-opacity duration-300"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        <button
          onClick={prev}
          disabled={currentSlide === 0 && currentPhase === 0}
          className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-[var(--accent-cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={toggleAutoPlay}
          className={`p-3 rounded-full transition-colors ${
            isAutoPlaying
              ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)]'
              : 'bg-gray-800/80 text-white hover:bg-[var(--accent-cyan)]'
          }`}
        >
          {isAutoPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="px-4 py-2 rounded-full bg-gray-800/80 text-white text-sm">
          {currentSlide + 1} / {slides.length}
        </div>

        <button
          onClick={next}
          disabled={currentSlide === slides.length - 1 && currentPhase === totalPhases - 1}
          className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-[var(--accent-cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-full transition-colors ${
            showSettings
              ? 'bg-[var(--accent-gold)] text-[var(--bg-primary)]'
              : 'bg-gray-800/80 text-white hover:bg-[var(--accent-gold)]'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 z-50 border border-gray-700"
          >
            <div className="flex items-center gap-4">
              <span className="text-white text-sm whitespace-nowrap">Auto-play interval:</span>
              <div className="flex items-center gap-2">
                {[2, 3, 5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setAutoPlayInterval(sec)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      autoPlayInterval === sec
                        ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)]'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top right controls */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-50 transition-opacity duration-300"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1">
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className="p-1 rounded text-white hover:text-[var(--accent-cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out (-)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            className="px-2 py-0.5 text-xs font-medium text-white hover:text-[var(--accent-cyan)] transition-colors min-w-[3rem] text-center"
            title="Reset Zoom (0)"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className="p-1 rounded text-white hover:text-[var(--accent-cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Zoom In (+)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-gray-800/80 text-white hover:bg-[var(--accent-cyan)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </div>

      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-50">
        <p className="text-sm text-[var(--text-muted)]">{demo.title}</p>
      </div>
    </div>
  );
}
