'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal from '@/components/animations/TextReveal';

interface SpeakerSlideProps {
  content: SlideContent;
}

export default function SpeakerSlide({ content }: SpeakerSlideProps) {
  const { speaker } = content;

  if (!speaker) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[var(--text-muted)]">No speaker information</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 p-8 md:p-16">
      {/* Speaker image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative"
      >
        <motion.div
          className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[var(--accent-gold)]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              className="w-full h-full bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-cyan)]/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.span
                className="text-6xl text-[var(--text-muted)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 300 }}
              >
                {speaker.name.charAt(0)}
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative ring with animation */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute -inset-4 rounded-full border-2 border-[var(--accent-cyan)]/30"
        />

        {/* Pulsing glow ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-8 rounded-full border border-[var(--accent-gold)]/20"
        />

        {/* Corner glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute -top-8 -left-8 w-32 h-32 bg-[var(--accent-gold)]/20 rounded-full blur-xl"
        />
      </motion.div>

      {/* Speaker info */}
      <div className="text-center md:text-left max-w-lg">
        <motion.div
          initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <TextReveal delay={0.3}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
              {speaker.name}
            </h2>
          </TextReveal>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <TextReveal delay={0.5}>
            <p className="text-xl md:text-2xl text-gradient-gold font-medium mb-2">
              {speaker.title}
            </p>
          </TextReveal>
        </motion.div>

        {speaker.company && (
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <TextReveal delay={0.7}>
              <p className="text-lg text-[var(--text-secondary)] mb-6">
                {speaker.company}
              </p>
            </TextReveal>
          </motion.div>
        )}

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-24 h-1 gradient-gold mb-6 rounded-full mx-auto md:mx-0"
        />

        {speaker.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <TextReveal delay={0.9}>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {speaker.bio}
              </p>
            </TextReveal>
          </motion.div>
        )}

        {/* Social/contact buttons with staggered animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex gap-4 justify-center md:justify-start"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 1.3 + index * 0.1,
                type: 'spring',
                stiffness: 400
              }}
              whileHover={{ scale: 1.1, borderColor: 'rgba(0, 212, 255, 0.5)' }}
              className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border border-[var(--accent-cyan)]/30 cursor-pointer"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
