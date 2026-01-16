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
      id: 'slide-2',
      order: 1,
      type: 'interactive',
      content: {
        visualization: 'legacy-problems',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-3',
      order: 2,
      type: 'interactive',
      content: {
        visualization: 'technical-challenges',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-4',
      order: 3,
      type: 'interactive',
      content: {
        visualization: 'product-opportunities',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-5',
      order: 4,
      type: 'interactive',
      content: {
        visualization: 'transformation-goals',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-6',
      order: 5,
      type: 'interactive',
      content: {
        visualization: 'elc-reimagination',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-7',
      order: 6,
      type: 'interactive',
      content: {
        visualization: 'transformation-metrics',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-8',
      order: 7,
      type: 'interactive',
      content: {
        visualization: 'module-consolidation',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-9',
      order: 8,
      type: 'interactive',
      content: {
        visualization: 'trade-architecture',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-10',
      order: 9,
      type: 'title',
      content: {
        title: 'The Future is Now',
        subtitle: 'Trade Processing, The Modern Way',
        text: 'Ready to reimagine your trade operations?',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
