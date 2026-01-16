'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Demo } from '@/types/demo';

interface PresentationModeEntryProps {
  demo: Demo;
  onStart: (fullscreen: boolean) => void;
}

export default function PresentationModeEntry({
  demo,
  onStart,
}: PresentationModeEntryProps) {
  const [isEnteringFullscreen, setIsEnteringFullscreen] = useState(false);

  const handleStartFullscreen = async () => {
    setIsEnteringFullscreen(true);
    try {
      await document.documentElement.requestFullscreen();
      onStart(true);
    } catch (err) {
      console.error('Fullscreen not supported:', err);
      onStart(false);
    }
  };

  const handleStartWindowed = () => {
    onStart(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 text-center"
      >
        {/* Demo info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <span className="inline-block px-4 py-1 text-sm font-medium text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 rounded-full mb-4">
            {demo.slides.length} slides
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {demo.title}
          </h1>
          {demo.description && (
            <p className="text-lg text-[var(--text-secondary)]">
              {demo.description}
            </p>
          )}
        </motion.div>

        {/* Mode selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl text-[var(--text-secondary)] mb-6">
            Choose presentation mode
          </h2>

          {/* Fullscreen button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartFullscreen}
            disabled={isEnteringFullscreen}
            className="w-full p-6 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] rounded-xl text-[var(--bg-primary)] font-semibold text-lg flex items-center justify-center gap-4 hover:shadow-lg hover:shadow-[var(--accent-gold)]/20 transition-shadow disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {isEnteringFullscreen ? 'Entering fullscreen...' : 'Start Fullscreen (Recommended)'}
          </motion.button>

          {/* Windowed button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartWindowed}
            className="w-full p-6 bg-[var(--bg-secondary)] border border-[var(--accent-cyan)]/30 rounded-xl text-[var(--text-primary)] font-medium text-lg flex items-center justify-center gap-4 hover:border-[var(--accent-cyan)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Start Windowed
          </motion.button>
        </motion.div>

        {/* Keyboard hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-[var(--text-muted)]"
        >
          <p className="mb-2">Keyboard shortcuts during presentation:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">← → Navigate</span>
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">Space Next</span>
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">P Play/Pause</span>
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">F Fullscreen</span>
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">R Record</span>
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">Esc Exit</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
