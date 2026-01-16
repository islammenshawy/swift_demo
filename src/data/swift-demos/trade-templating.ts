import { Demo } from '@/types/demo';

export const tradeTemplatingDemo: Demo = {
  id: 'trade-templating',
  title: 'Trade Templating',
  description: 'Pattern recognition and template extraction from SWIFT trade messages',
  createdAt: new Date('2025-01-01'),
  theme: 'swift-dark',
  autoPlaySpeed: 12,
  slides: [
    {
      id: 'slide-1',
      order: 0,
      type: 'title',
      content: {
        title: 'Trade Templating',
        subtitle: 'Your Memory Train for Trade Finance',
        text: 'Learn from the past. Accelerate the present.',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-2',
      order: 1,
      type: 'interactive',
      content: {
        visualization: 'message-inbox',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-3',
      order: 2,
      type: 'interactive',
      content: {
        visualization: 'hidden-workflow',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-4',
      order: 3,
      type: 'chart',
      content: {
        title: 'Transaction Patterns',
        subtitle: 'Analyzing 12 months of historical data',
        chartType: 'donut',
        chartData: [
          { label: 'Repeat Buyer-Supplier Pairs', value: 68, color: '#4ECDC4' },
          { label: 'Similar Message Structures', value: 22, color: '#6495ED' },
          { label: 'Unique Transactions', value: 10, color: '#8B7355' },
        ],
      },
      animation: { entry: 'scale', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-5',
      order: 4,
      type: 'interactive',
      content: {
        visualization: 'patterns-emerge',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-6',
      order: 5,
      type: 'interactive',
      content: {
        visualization: 'template-comparison',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-7',
      order: 6,
      type: 'timeline',
      content: {
        title: 'The Templating Solution',
        timeline: [
          {
            year: 'Extract',
            title: 'Learn from History',
            description: 'Analyze past transactions to identify common patterns',
          },
          {
            year: 'Match',
            title: 'Find Similar Cases',
            description: 'Auto-find closest historical matches for new messages',
          },
          {
            year: 'Suggest',
            title: 'Present Templates',
            description: '"This looks like Transaction X from 3 months ago"',
          },
          {
            year: 'Apply',
            title: 'Copy & Refine',
            description: 'User copies from template, adjusts only what changed',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'slide-8',
      order: 7,
      type: 'interactive',
      content: {
        visualization: 'message-types',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-9',
      order: 8,
      type: 'interactive',
      content: {
        visualization: 'memory-train',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-10',
      order: 9,
      type: 'chart',
      content: {
        title: 'Time Savings',
        subtitle: 'Minutes per transaction',
        chartType: 'bar',
        chartData: [
          { label: 'Start from Scratch', value: 25, color: '#6B7F9E' },
          { label: 'Manual Copy-Paste', value: 15, color: '#8B7355' },
          { label: 'Template Match', value: 5, color: '#4ECDC4' },
          { label: 'Auto-Populated', value: 2, color: '#FFD700' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-11',
      order: 10,
      type: 'chart',
      content: {
        title: 'Error Reduction',
        subtitle: '% decrease with template usage',
        chartType: 'bar',
        chartData: [
          { label: 'Field Entry Errors', value: 45, color: '#4ECDC4' },
          { label: 'Missing Documents', value: 38, color: '#6495ED' },
          { label: 'Wrong Clauses', value: 52, color: '#FFD700' },
          { label: 'Compliance Issues', value: 35, color: '#C9A227' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-12',
      order: 11,
      type: 'interactive',
      content: {
        visualization: 'branch-intelligence',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-13',
      order: 12,
      type: 'timeline',
      content: {
        title: 'Implementation Roadmap',
        timeline: [
          {
            year: 'Phase 1',
            title: 'Pattern Analysis',
            description: 'Mine historical transactions, identify top buyer-supplier pairs',
          },
          {
            year: 'Phase 2',
            title: 'Template Extraction',
            description: 'Generate templates from high-frequency transaction patterns',
          },
          {
            year: 'Phase 3',
            title: 'Matching Engine',
            description: 'Build similarity scoring for new vs. historical transactions',
          },
          {
            year: 'Phase 4',
            title: 'UI Integration',
            description: 'Embed template suggestions into operator workflow',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'slide-14',
      order: 13,
      type: 'title',
      content: {
        title: 'Your Past is Your Power',
        subtitle: 'Stop reinventing. Start remembering.',
        text: "Let's explore your transaction patterns",
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
