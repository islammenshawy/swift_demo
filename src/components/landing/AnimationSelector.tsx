'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLandingStore } from '@/stores/landingStore';
import { AnimationStyle } from '@/types/demo';

const animationOptions: { value: AnimationStyle; label: string; icon: string }[] = [
  { value: 'particles', label: 'Particles', icon: '✦' },
  { value: 'globe', label: 'Globe', icon: '🌐' },
  { value: 'dataStreams', label: 'Data Flow', icon: '〰' },
];

interface AnimationSelectorProps {
  onExport?: () => void;
}

export default function AnimationSelector({ onExport }: AnimationSelectorProps) {
  const { animationStyle, setAnimationStyle } = useLandingStore();
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard shortcut for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        // Don't trigger if user is typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const rotateToNext = useCallback(() => {
    const currentIndex = animationOptions.findIndex(opt => opt.value === animationStyle);
    const nextIndex = (currentIndex + 1) % animationOptions.length;
    setAnimationStyle(animationOptions[nextIndex].value);
  }, [animationStyle, setAnimationStyle]);

  // Auto-rotate effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      rotateToNext();
    }, 10000); // 10 seconds per animation

    return () => clearInterval(interval);
  }, [isAutoRotating, rotateToNext]);

  // Auto-hide when in play mode, show on mouse move
  useEffect(() => {
    if (!isAutoRotating) {
      setIsVisible(true);
      return;
    }

    // Hide after 2 seconds when auto-rotating
    const hideControls = () => {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    const showControls = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      setIsVisible(true);
      hideControls();
    };

    // Initial hide
    hideControls();

    // Show on mouse move
    document.addEventListener('mousemove', showControls);

    return () => {
      document.removeEventListener('mousemove', showControls);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isAutoRotating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="flex gap-2 p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20">
        {/* Auto-rotate button */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`
            relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${isAutoRotating
              ? 'text-[var(--bg-primary)] bg-[var(--accent-cyan)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
          title={isAutoRotating ? 'Stop auto-rotate' : 'Auto-rotate views'}
        >
          <span className="flex items-center gap-1">
            {isAutoRotating ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        </button>

        <div className="w-px bg-[var(--accent-cyan)]/30" />

        {/* Animation options */}
        {animationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setAnimationStyle(option.value);
              setIsAutoRotating(false); // Stop auto-rotate when manually selecting
            }}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                animationStyle === option.value
                  ? 'text-[var(--bg-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {animationStyle === option.value && (
              <motion.div
                layoutId="selector"
                className="absolute inset-0 rounded-full gradient-gold"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </span>
          </button>
        ))}

        {/* Export button */}
        {onExport && (
          <>
            <div className="w-px bg-[var(--accent-cyan)]/30" />
            <button
              onClick={onExport}
              className="relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Export landing page"
            >
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </span>
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <div className="w-px bg-[var(--accent-cyan)]/30" />
        <button
          onClick={toggleFullscreen}
          className={`
            relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${isFullscreen
              ? 'text-[var(--bg-primary)] bg-[var(--accent-cyan)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
          title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
        >
          <span className="flex items-center gap-1">
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
