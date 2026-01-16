'use client';

import { motion } from 'framer-motion';
import { useLandingStore } from '@/stores/landingStore';
import { AnimationStyle } from '@/types/demo';

const animationOptions: { value: AnimationStyle; label: string; icon: string }[] = [
  { value: 'particles', label: 'Particles', icon: '✦' },
  { value: 'globe', label: 'Globe', icon: '🌐' },
  { value: 'dataStreams', label: 'Data Flow', icon: '〰' },
  { value: 'minimalist', label: 'Minimal', icon: '◇' },
];

export default function AnimationSelector() {
  const { animationStyle, setAnimationStyle } = useLandingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="flex gap-2 p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--accent-cyan)]/20">
        {animationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setAnimationStyle(option.value)}
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
      </div>
    </motion.div>
  );
}
