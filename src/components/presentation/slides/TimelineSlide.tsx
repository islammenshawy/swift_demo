'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal from '@/components/animations/TextReveal';

interface TimelineSlideProps {
  content: SlideContent;
}

export default function TimelineSlide({ content }: TimelineSlideProps) {
  const { timeline } = content;

  if (!timeline || timeline.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[var(--text-muted)]">No timeline data</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16 overflow-auto">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        {content.title && (
          <motion.div
            initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <TextReveal delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                {content.title}
              </h2>
            </TextReveal>
          </motion.div>
        )}
        {/* Accent line under title */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-24 h-1 gradient-gold rounded-full"
        />
      </div>

      {/* Timeline */}
      <div className="flex-1 relative">
        {/* Center line with glow */}
        <motion.div
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
        >
          <div className="w-full h-full bg-gradient-to-b from-[var(--accent-gold)] to-[var(--accent-cyan)]" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-2 -translate-x-[3px] bg-gradient-to-b from-[var(--accent-gold)] to-[var(--accent-cyan)] blur-md"
          />
        </motion.div>

        {/* Timeline items */}
        <div className="space-y-12">
          {timeline.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: isLeft ? -80 : 80,
                  filter: 'blur(10px)',
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  scale: 1
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + index * 0.25,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className={`relative flex items-center ${
                  isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content card */}
                <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <motion.div
                    className="inline-block p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-cyan)]/20 relative overflow-hidden"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0, 212, 255, 0.4)' }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Card glow effect */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.25 }}
                      className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/5 to-[var(--accent-cyan)]/5"
                    />
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.7 + index * 0.25,
                        type: 'spring',
                        stiffness: 300
                      }}
                      className="text-sm font-mono text-[var(--accent-gold)] mb-2 block relative"
                    >
                      {item.year}
                    </motion.span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 relative">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm relative">
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                {/* Center dot with pulse */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7 + index * 0.25,
                      type: 'spring',
                      stiffness: 300
                    }}
                    className="w-5 h-5 rounded-full gradient-gold border-4 border-[var(--bg-primary)]"
                  />
                  {/* Pulse ring */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: 1 + index * 0.25,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute inset-0 rounded-full border-2 border-[var(--accent-gold)]"
                  />
                </div>

                {/* Spacer for opposite side */}
                <div className="w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
