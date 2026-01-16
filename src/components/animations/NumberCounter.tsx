'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface NumberCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function NumberCounter({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: NumberCounterProps) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    setHasAnimated(true);

    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();

      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      if (now >= endTime) {
        setCount(end);
        return;
      }

      const progress = (now - startTime) / (duration * 1000);
      const easeProgress = easeOutExpo(progress);
      const currentValue = start + (end - start) * easeProgress;

      setCount(currentValue);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, hasAnimated, start, end, duration, delay]);

  const formattedValue = count.toFixed(decimals);
  const [whole, decimal] = formattedValue.split('.');

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {prefix}
      <span className="tabular-nums">{formatNumber(parseInt(whole))}</span>
      {decimals > 0 && <span>.{decimal}</span>}
      {suffix}
    </motion.span>
  );
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}

export function StatCard({
  value,
  label,
  prefix = '',
  suffix = '',
  delay = 0,
  className = '',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`text-center p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-cyan)]/20 ${className}`}
    >
      <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
        <NumberCounter
          end={value}
          prefix={prefix}
          suffix={suffix}
          delay={delay + 0.3}
          duration={1.5}
        />
      </div>
      <p className="text-[var(--text-secondary)] text-sm md:text-base">{label}</p>
    </motion.div>
  );
}
