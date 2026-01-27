'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { usePresentationStore } from '@/stores/presentationStore';
import { Demo } from '@/types/demo';
import SlideRenderer from './SlideRenderer';
import SlideNavigation from './SlideNavigation';
import ProgressIndicator from './ProgressIndicator';
import { useRecording, formatRecordingTime } from '@/hooks/useRecording';
import ExportDialog from './ExportDialog';

interface PresentationContainerProps {
  demo: Demo;
  initialSlide?: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '50%' : '-50%',
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-50%' : '50%',
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -15 : 15,
  }),
};

export default function PresentationContainer({ demo, initialSlide = 0 }: PresentationContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  const {
    currentSlideIndex,
    currentPhase,
    direction,
    isPlaying,
    playbackSpeed,
    navigationKey,
    setDemo,
    nextSlide,
    prevSlide,
    goToSlide,
    setPhase,
    togglePlayback,
    toggleFullscreen,
  } = usePresentationStore();

  const {
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecording();

  // Zoom functions
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
  }, [currentSlideIndex]);

  // Mouse wheel zoom handler
  useEffect(() => {
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
  }, [zoomIn, zoomOut]);

  // Track fullscreen state and stop recording when entering fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      // Stop recording when entering fullscreen
      if (isNowFullscreen && isRecording) {
        stopRecording();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isRecording, stopRecording]);

  // Initialize demo
  useEffect(() => {
    setDemo(demo);
    if (initialSlide > 0 && initialSlide < demo.slides.length) {
      goToSlide(initialSlide);
    }
  }, [demo, setDemo, initialSlide, goToSlide]);

  // Update URL when slide changes
  useEffect(() => {
    const newUrl = `${pathname}?mode=present&slide=${currentSlideIndex + 1}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentSlideIndex, pathname]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove(); // Initial trigger

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Keyboard navigation
  // ArrowUp/ArrowDown are reserved for within-slide navigation (e.g., interactive elements)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePlayback();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        case 'r':
        case 'R':
          // Recording disabled in fullscreen mode
          if (!document.fullscreenElement) {
            e.preventDefault();
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (isRecording) {
            stopRecording();
          } else {
            router.push(`/demo/${demo.id}`);
          }
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(demo.slides.length - 1);
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
    },
    [nextSlide, prevSlide, togglePlayback, toggleFullscreen, router, demo.id, demo.slides.length, goToSlide, isRecording, startRecording, stopRecording, zoomIn, zoomOut, resetZoom]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, playbackSpeed * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, nextSlide]);

  // Touch/swipe support
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const currentSlide = demo.slides[currentSlideIndex];

  if (!currentSlide) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-[var(--text-muted)]">No slides available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-[var(--bg-primary)] relative cursor-none">
      {/* Show cursor when controls visible */}
      <style jsx global>{`
        .cursor-none { cursor: ${showControls ? 'default' : 'none'}; }
      `}</style>

      {/* Progress indicator */}
      <ProgressIndicator />

      {/* Slide content with transitions */}
      <div className="absolute inset-0 overflow-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentSlideIndex}-${navigationKey}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.5 },
            }}
            className="w-full h-full"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              minHeight: zoomLevel > 1 ? `${100 * zoomLevel}%` : '100%',
              minWidth: zoomLevel > 1 ? `${100 * zoomLevel}%` : '100%',
            }}
          >
            <SlideRenderer slide={currentSlide} navigationKey={navigationKey} forcePhase={currentPhase} onPhaseChange={setPhase} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls - fade with mouse */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <SlideNavigation />
      </motion.div>

      {/* Recording indicator - hidden in fullscreen mode */}
      {isRecording && !isFullscreen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showControls ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-red-600/90 backdrop-blur-sm rounded-full"
          style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        >
          {/* Back/Exit button */}
          <button
            onClick={() => {
              stopRecording();
              router.push(`/demo/${demo.id}`);
            }}
            className="p-1 hover:bg-white/20 rounded"
            title="Stop & Exit"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="w-px h-4 bg-white/30" />

          <motion.div
            animate={{ opacity: isPaused ? 0.5 : [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: isPaused ? 0 : Infinity }}
            className="w-3 h-3 rounded-full bg-white"
          />
          <span className="text-white font-medium">
            {isPaused ? 'Paused' : 'Recording'} {formatRecordingTime(recordingTime)}
          </span>
          <button
            onClick={isPaused ? resumeRecording : pauseRecording}
            className="p-1 hover:bg-white/20 rounded"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
          <button
            onClick={stopRecording}
            className="p-1 hover:bg-white/20 rounded"
            title="Stop Recording"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Top controls */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 left-6 right-6 z-40 flex justify-between items-start pointer-events-none"
      >
        {/* Home button */}
        <button
          onClick={() => router.push('/')}
          className="pointer-events-auto p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Go to home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded-full border border-[var(--accent-cyan)]/20 px-2 py-1">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= MIN_ZOOM}
              className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
              title="Zoom Out (-)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-w-[3rem] text-center"
              title="Reset Zoom (0)"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= MAX_ZOOM}
              className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
              title="Zoom In (+)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Export to PowerPoint button - hidden in fullscreen */}
          {!isFullscreen && (
            <button
              onClick={() => setShowExportDialog(true)}
              className="p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
              aria-label="Export to PowerPoint"
              title="Export to PowerPoint"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}

          {/* Record button - hidden in fullscreen */}
          {!isRecording && !isFullscreen && (
            <button
              onClick={startRecording}
              className="p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
              aria-label="Start recording"
              title="Start Recording (R)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
              </svg>
            </button>
          )}

          {/* Fullscreen button */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle fullscreen"
            title="Fullscreen (F)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>

          {/* Demo title */}
          <div className="text-right ml-4">
            <p className="text-sm text-[var(--text-muted)]">{demo.title}</p>
          </div>
        </div>
      </motion.div>

      {/* Export Dialog */}
      <ExportDialog
        demo={demo}
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
}
