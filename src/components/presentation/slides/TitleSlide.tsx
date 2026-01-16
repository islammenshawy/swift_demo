'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal, { WordReveal } from '@/components/animations/TextReveal';

interface TitleSlideProps {
  content: SlideContent;
  isCapturing?: boolean;
}

export default function TitleSlide({ content, isCapturing = false }: TitleSlideProps) {
  // Skip animations when capturing for export
  const animationProps = isCapturing ? { initial: false } : {};

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16">
      {/* Background decoration - animated circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          {...animationProps}
          initial={isCapturing ? { scale: 1, opacity: 0.15, rotate: 0 } : { scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 0.15, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-[600px] h-[600px] rounded-full border-2 border-[var(--accent-gold)]"
        />
        <motion.div
          {...animationProps}
          initial={isCapturing ? { scale: 1, opacity: 0.2, rotate: 0 } : { scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 0.2, rotate: 0 }}
          transition={{ duration: 1, delay: isCapturing ? 0 : 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[400px] h-[400px] rounded-full border border-[var(--accent-cyan)]"
        />
        <motion.div
          {...animationProps}
          initial={isCapturing ? { scale: 1, opacity: 0.15 } : { scale: 0, opacity: 0 }}
          animate={isCapturing ? { scale: 1, opacity: 0.15 } : { scale: [0, 1.2, 1], opacity: [0, 0.3, 0.15] }}
          transition={{ duration: 1.2, delay: isCapturing ? 0 : 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-cyan)]/20 blur-xl"
        />
        {/* Pulsing glow */}
        <motion.div
          {...animationProps}
          initial={isCapturing ? { scale: 1, opacity: 0.15 } : { scale: 0.8, opacity: 0 }}
          animate={isCapturing ? { scale: 1, opacity: 0.15 } : { scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, delay: isCapturing ? 0 : 1.5, repeat: isCapturing ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-[var(--accent-gold)]/10 to-transparent"
        />
      </div>

      {/* Main title */}
      <div className="relative z-10 text-center">
        {content.title && (
          <motion.div
            {...animationProps}
            initial={isCapturing ? { filter: 'blur(0px)', scale: 1 } : { filter: 'blur(20px)', scale: 0.9 }}
            animate={{ filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--text-primary)] mb-6">
              {isCapturing ? content.title : <WordReveal text={content.title} delay={0.2} staggerDelay={0.08} />}
            </h1>
          </motion.div>
        )}

        {content.subtitle && (
          <motion.div
            {...animationProps}
            initial={isCapturing ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: isCapturing ? 0 : 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {isCapturing ? (
              <p className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)]">{content.subtitle}</p>
            ) : (
              <TextReveal delay={0.8} className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)]">
                {content.subtitle}
              </TextReveal>
            )}
          </motion.div>
        )}

        {content.text && (
          <motion.div
            {...animationProps}
            initial={isCapturing ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: isCapturing ? 0 : 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {isCapturing ? (
              <p className="mt-8 text-lg text-[var(--text-muted)] max-w-2xl mx-auto">{content.text}</p>
            ) : (
              <TextReveal delay={1.2} className="mt-8 text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                {content.text}
              </TextReveal>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom accent line with glow */}
      <motion.div
        {...animationProps}
        initial={isCapturing ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: isCapturing ? 0 : 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <div className="w-32 h-1 gradient-gold rounded-full" />
        <motion.div
          {...animationProps}
          initial={isCapturing ? { opacity: 0.5 } : { opacity: 0 }}
          animate={isCapturing ? { opacity: 0.5 } : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, delay: isCapturing ? 0 : 2, repeat: isCapturing ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-32 h-1 gradient-gold rounded-full blur-md"
        />
      </motion.div>
    </div>
  );
}
