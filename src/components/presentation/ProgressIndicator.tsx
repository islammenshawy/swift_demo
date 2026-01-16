'use client';

import { motion } from 'framer-motion';
import { usePresentationStore } from '@/stores/presentationStore';

export default function ProgressIndicator() {
  const { currentDemo, currentSlideIndex, goToSlide, isPlaying, playbackSpeed } =
    usePresentationStore();

  if (!currentDemo) return null;

  const totalSlides = currentDemo.slides.length;
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-1 bg-[var(--bg-tertiary)]">
        <motion.div
          className="h-full gradient-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Slide dots (optional, shown when fewer than 15 slides) */}
      {totalSlides <= 15 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2"
        >
          {currentDemo.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlideIndex
                    ? 'bg-[var(--accent-gold)]'
                    : 'bg-[var(--text-muted)]/50 group-hover:bg-[var(--text-muted)]'
                }`}
                animate={{
                  scale: index === currentSlideIndex ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Auto-play progress ring */}
              {isPlaying && index === currentSlideIndex && (
                <svg
                  className="absolute -inset-1 w-4 h-4"
                  viewBox="0 0 16 16"
                >
                  <motion.circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: playbackSpeed,
                      ease: 'linear',
                      repeat: 0,
                    }}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                    }}
                  />
                </svg>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
