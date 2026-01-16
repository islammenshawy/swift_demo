'use client';

import { motion } from 'framer-motion';
import { ChartData } from '@/types/demo';

interface AnimatedBarChartProps {
  data: ChartData[];
  delay?: number;
  className?: string;
  maxValue?: number;
}

export function AnimatedBarChart({
  data,
  delay = 0,
  className = '',
  maxValue,
}: AnimatedBarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        const barColor = item.color || (index % 2 === 0 ? 'var(--accent-gold)' : 'var(--accent-cyan)');

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">{item.label}</span>
              <span className="text-[var(--text-primary)] font-medium">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 1,
                  delay: delay + index * 0.1 + 0.3,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: barColor }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface AnimatedDonutChartProps {
  data: ChartData[];
  size?: number;
  delay?: number;
  className?: string;
}

export function AnimatedDonutChart({
  data,
  size = 200,
  delay = 0,
  className = '',
}: AnimatedDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const strokeWidth = size * 0.15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  const defaultColors = ['#C9A227', '#00D4FF', '#E5C44D', '#0097B2', '#6B7F9E'];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const strokeLength = circumference * percentage;
          const color = item.color || defaultColors[index % defaultColors.length];
          const offset = currentOffset;
          currentOffset += strokeLength;

          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${strokeLength} ${circumference}` }}
              transition={{
                duration: 1,
                delay: delay + index * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-3xl font-bold text-[var(--text-primary)]">
          {total.toLocaleString()}
        </span>
        <span className="text-sm text-[var(--text-muted)]">Total</span>
      </motion.div>
    </div>
  );
}

interface AnimatedLineChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  delay?: number;
  className?: string;
}

export function AnimatedLineChart({
  data,
  width = 400,
  height = 200,
  delay = 0,
  className = '',
}: AnimatedLineChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const padding = 40;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((item.value - min) / range) * (height - padding * 2);
    return { x, y, ...item };
  });

  const pathD = points
    .map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ');

  return (
    <div className={className}>
      <svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
          const y = padding + percent * (height - padding * 2);
          return (
            <line
              key={percent}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--bg-tertiary)"
              strokeWidth={1}
            />
          );
        })}

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
        />

        {/* Dots */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="var(--accent-gold)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 1 + index * 0.1 }}
          />
        ))}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-10">
        {data.map((item, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 1.5 + index * 0.1 }}
            className="text-xs text-[var(--text-muted)]"
          >
            {item.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
