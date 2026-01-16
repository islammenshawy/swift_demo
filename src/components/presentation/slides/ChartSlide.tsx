'use client';

import { motion } from 'framer-motion';
import { SlideContent } from '@/types/demo';
import TextReveal from '@/components/animations/TextReveal';
import {
  AnimatedBarChart,
  AnimatedDonutChart,
  AnimatedLineChart,
} from '@/components/animations/ChartAnimations';

interface ChartSlideProps {
  content: SlideContent;
}

export default function ChartSlide({ content }: ChartSlideProps) {
  const renderChart = () => {
    if (!content.chartData || content.chartData.length === 0) {
      return null;
    }

    switch (content.chartType) {
      case 'bar':
        return <AnimatedBarChart data={content.chartData} delay={0.5} />;
      case 'donut':
      case 'pie':
        return <AnimatedDonutChart data={content.chartData} size={280} delay={0.5} />;
      case 'line':
        return <AnimatedLineChart data={content.chartData} width={500} height={250} delay={0.5} />;
      default:
        return <AnimatedBarChart data={content.chartData} delay={0.5} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16">
      {/* Header */}
      <div className="mb-8">
        {content.title && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
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

        {content.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <TextReveal delay={0.3}>
              <p className="text-xl text-[var(--text-secondary)]">{content.subtitle}</p>
            </TextReveal>
          </motion.div>
        )}

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-24 h-1 gradient-gold mt-4 rounded-full"
        />
      </div>

      {/* Chart section with entrance animation */}
      <motion.div
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="w-full max-w-2xl">{renderChart()}</div>
      </motion.div>

      {/* Legend for donut/pie charts with staggered animation */}
      {(content.chartType === 'donut' || content.chartType === 'pie') && content.chartData && (
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {content.chartData.map((item, index) => {
            const defaultColors = ['#C9A227', '#00D4FF', '#E5C44D', '#0097B2', '#6B7F9E'];
            const color = item.color || defaultColors[index % defaultColors.length];

            return (
              <motion.div
                key={item.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1 + index * 0.1,
                  type: 'spring',
                  stiffness: 300
                }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.1 + index * 0.1,
                    type: 'spring',
                    stiffness: 400
                  }}
                />
                <span className="text-[var(--text-secondary)]">
                  {item.label}: {item.value.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Legend for bar charts */}
      {content.chartType === 'bar' && content.chartData && (
        <motion.div
          className="mt-4 text-center text-sm text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          % reduction with templates
        </motion.div>
      )}
    </div>
  );
}
