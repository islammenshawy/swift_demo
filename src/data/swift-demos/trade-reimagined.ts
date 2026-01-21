import { Demo } from '@/types/demo';

export const tradeReimaginedDemo: Demo = {
  id: 'trade-reimagined',
  title: 'Trade Reimagined',
  description: 'Transforming legacy trade processing into a modern, AI-powered platform',
  createdAt: new Date('2025-01-01'),
  theme: 'swift-dark',
  autoPlaySpeed: 12,
  slides: [
    {
      id: 'slide-1',
      order: 0,
      type: 'title',
      content: {
        title: 'Trade Reimagined',
        subtitle: 'From Legacy to Leading Edge',
        text: 'Transforming trade processing for the modern era',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-1b',
      order: 1,
      type: 'interactive',
      content: {
        visualization: 'journey-overview',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-2',
      order: 2,
      type: 'interactive',
      content: {
        visualization: 'legacy-problems',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-5',
      order: 3,
      type: 'interactive',
      content: {
        visualization: 'module-consolidation',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-3',
      order: 4,
      type: 'interactive',
      content: {
        visualization: 'product-opportunities',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-6b',
      order: 5,
      type: 'title',
      content: {
        title: 'Introducing ELC',
        subtitle: 'The Foundation for Trade Transformation',
        text: 'Enterprise Lifecycle Components — powering the next generation of trade services',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-10',
      order: 6,
      type: 'interactive',
      content: {
        visualization: 'transformation-metrics',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-4',
      order: 7,
      type: 'interactive',
      content: {
        visualization: 'transformation-goals',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-7',
      order: 8,
      type: 'interactive',
      content: {
        visualization: 'elc-architecture',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-8',
      order: 9,
      type: 'interactive',
      content: {
        visualization: 'elc-integration-patterns',
      },
      animation: { entry: 'fadeIn', duration: 0.2, delay: 0 },
    },
    {
      id: 'slide-arch-compare',
      order: 10,
      type: 'interactive',
      content: {
        visualization: 'architecture-comparison',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-8b',
      order: 11,
      type: 'interactive',
      content: {
        visualization: 'elc-roadmap',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-10b',
      order: 12,
      type: 'interactive',
      content: {
        visualization: 'elc-deliverables-heatmap',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-11',
      order: 13,
      type: 'title',
      content: {
        title: 'Questions?',
        text: "Let's discuss how we can get there ...",
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
