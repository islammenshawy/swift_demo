'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal from '@/components/animations/TextReveal';

interface ImageSlideProps {
  content: SlideContent;
}

export default function ImageSlide({ content }: ImageSlideProps) {
  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16">
      {/* Header */}
      {(content.title || content.subtitle) && (
        <div className="mb-6">
          {content.title && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <TextReveal delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                  {content.title}
                </h2>
              </TextReveal>
            </motion.div>
          )}

          {content.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <TextReveal delay={0.3}>
                <p className="text-lg text-[var(--text-secondary)]">{content.subtitle}</p>
              </TextReveal>
            </motion.div>
          )}

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="w-24 h-1 gradient-gold mt-3 rounded-full"
          />
        </div>
      )}

      {/* Image */}
      <div className="flex-1 flex items-center justify-center">
        {content.image ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="relative max-w-full max-h-full"
          >
            {/* Image frame with glow */}
            <motion.div
              className="relative rounded-xl overflow-hidden border-2 border-[var(--accent-cyan)]/30 shadow-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(0, 212, 255, 0.5)' }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={content.image}
                alt={content.title || ''}
                className="max-w-full max-h-[60vh] object-contain"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 to-transparent pointer-events-none" />

              {/* Shimmer effect */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              />
            </motion.div>

            {/* Decorative elements with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.8, type: 'spring', stiffness: 200 }}
              className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[var(--accent-gold)] rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 90 }}
              animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-4 -left-4 w-16 h-16 gradient-cyan rounded-lg"
            />

            {/* Corner glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -right-8 w-32 h-32 bg-[var(--accent-gold)]/20 rounded-full blur-xl"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-64 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center"
          >
            <p className="text-[var(--text-muted)]">No image provided</p>
          </motion.div>
        )}
      </div>

      {/* Caption */}
      {content.text && (
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 1, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <TextReveal delay={0.8}>
            <p className="mt-6 text-center text-[var(--text-muted)] italic">
              {content.text}
            </p>
          </TextReveal>
        </motion.div>
      )}
    </div>
  );
}
