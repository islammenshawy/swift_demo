'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  direction = 'up',
}: TextRevealProps) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerTextProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  charClassName?: string;
}

export function StaggerText({
  text,
  delay = 0,
  staggerDelay = 0.03,
  className = '',
  charClassName = '',
}: StaggerTextProps) {
  const chars = text.split('');

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className={`inline-block ${charClassName}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

interface WordRevealProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  wordClassName?: string;
}

export function WordReveal({
  text,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  wordClassName = '',
}: WordRevealProps) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className={`inline-block mr-[0.25em] ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
