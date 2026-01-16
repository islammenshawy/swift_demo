'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal from '@/components/animations/TextReveal';

interface ContentSlideProps {
  content: SlideContent;
}

export default function ContentSlide({ content }: ContentSlideProps) {
  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16">
      {/* Header section */}
      <div className="mb-8 md:mb-12">
        {content.title && (
          <TextReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {content.title}
            </h2>
          </TextReveal>
        )}

        {content.subtitle && (
          <TextReveal delay={0.3}>
            <p className="text-xl text-[var(--text-secondary)]">{content.subtitle}</p>
          </TextReveal>
        )}

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-24 h-1 gradient-gold mt-4 rounded-full"
        />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col justify-center">
        {content.bullets && content.bullets.length > 0 && (
          <ul className="space-y-6 max-w-4xl">
            {content.bullets.map((bullet, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.12,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="flex items-start gap-4"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.12,
                    type: 'spring',
                    stiffness: 300,
                  }}
                  className="flex-shrink-0 w-3 h-3 mt-2 rounded-full gradient-gold"
                />
                <motion.span
                  className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.12 }}
                >
                  {bullet}
                </motion.span>
              </motion.li>
            ))}
          </ul>
        )}

        {content.text && !content.bullets && (
          <TextReveal delay={0.6}>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
              {content.text}
            </p>
          </TextReveal>
        )}

        {content.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <img
              src={content.image}
              alt=""
              className="max-w-full max-h-[40vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
