'use client';

import { motion } from 'framer-motion';
import { usePresentationStore } from '@/stores/presentationStore';

export default function SlideNavigation() {
  const {
    currentDemo,
    currentSlideIndex,
    isPlaying,
    playbackSpeed,
    nextSlide,
    prevSlide,
    togglePlayback,
    setPlaybackSpeed,
  } = usePresentationStore();

  if (!currentDemo) return null;

  const totalSlides = currentDemo.slides.length;
  const canGoPrev = currentSlideIndex > 0;
  const canGoNext = currentSlideIndex < totalSlides - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--accent-cyan)]/20 shadow-xl">
        {/* Previous button */}
        <button
          onClick={prevSlide}
          disabled={!canGoPrev}
          className={`p-2 rounded-full transition-all duration-200 ${
            canGoPrev
              ? 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              : 'text-[var(--text-muted)] cursor-not-allowed'
          }`}
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={togglePlayback}
          className="p-3 rounded-full gradient-gold text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          )}
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          disabled={!canGoNext}
          className={`p-2 rounded-full transition-all duration-200 ${
            canGoNext
              ? 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              : 'text-[var(--text-muted)] cursor-not-allowed'
          }`}
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--text-muted)]/30" />

        {/* Slide counter */}
        <div className="text-sm text-[var(--text-secondary)] min-w-[60px] text-center">
          <span className="text-[var(--text-primary)] font-medium">{currentSlideIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{totalSlides}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--text-muted)]/30" />

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-transparent text-[var(--text-secondary)] text-sm border border-[var(--accent-cyan)]/30 rounded px-2 py-1 focus:outline-none focus:border-[var(--accent-cyan)]"
          >
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={8}>8s</option>
            <option value={10}>10s</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
