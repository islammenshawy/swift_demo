import { Demo } from '@/types/demo';

export const evalioDemo: Demo = {
  id: 'evalio-demo',
  title: 'Evalio - AI Performance Evaluation',
  description: 'AI-powered employee performance evaluation and ranking system for financial services',
  createdAt: new Date('2025-01-01'),
  theme: 'swift-dark',
  autoPlaySpeed: 12,
  slides: [
    {
      id: 'slide-1',
      order: 0,
      type: 'title',
      content: {
        title: 'Evalio',
        subtitle: 'Objective Performance. Data-Driven Decisions.',
        text: 'AI-powered employee evaluation for financial services',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-2',
      order: 1,
      type: 'interactive',
      content: {
        visualization: 'problem-visual',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-3',
      order: 2,
      type: 'interactive',
      content: {
        visualization: 'solution-visual',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-4',
      order: 3,
      type: 'timeline',
      content: {
        title: 'Multi-Framework Scoring',
        timeline: [
          {
            year: 'DORA',
            title: 'DevOps Research',
            description: 'Deployment frequency, lead time, failure rate, recovery time',
          },
          {
            year: 'SPACE',
            title: 'Developer Productivity',
            description: 'Satisfaction, Performance, Activity, Communication, Efficiency',
          },
          {
            year: 'JIRA',
            title: 'Task Execution',
            description: 'Completion rate, velocity, on-time delivery, quality score',
          },
          {
            year: 'GitHub',
            title: 'Code Contribution',
            description: 'Commits, PR quality, code reviews, technical impact',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'slide-5',
      order: 4,
      type: 'interactive',
      content: {
        visualization: 'score-calculation',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-6',
      order: 5,
      type: 'interactive',
      content: {
        visualization: 'level-weights',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-7',
      order: 6,
      type: 'interactive',
      content: {
        visualization: 'team-benchmarking',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-8',
      order: 7,
      type: 'interactive',
      content: {
        visualization: 'ai-capabilities',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-9',
      order: 8,
      type: 'interactive',
      content: {
        visualization: 'promotion-pipeline',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-10',
      order: 9,
      type: 'chart',
      content: {
        title: 'Impact Metrics',
        subtitle: 'Organizations using Evalio report',
        chartType: 'bar',
        chartData: [
          { label: 'Review Time Saved', value: 65, color: '#4ECDC4' },
          { label: 'Employee Trust Increase', value: 78, color: '#6495ED' },
          { label: 'Retention Improvement', value: 42, color: '#FFD700' },
          { label: 'Promotion Accuracy', value: 89, color: '#C9A227' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-11',
      order: 10,
      type: 'interactive',
      content: {
        visualization: 'feature-showcase',
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-12',
      order: 11,
      type: 'timeline',
      content: {
        title: 'Implementation Journey',
        timeline: [
          {
            year: 'Week 1',
            title: 'Integration Setup',
            description: 'Connect JIRA, GitHub, Confluence APIs',
          },
          {
            year: 'Week 2',
            title: 'Data Migration',
            description: 'Import employee data with AI field mapping',
          },
          {
            year: 'Week 3',
            title: 'Calibration',
            description: 'Fine-tune weights and thresholds for your org',
          },
          {
            year: 'Week 4',
            title: 'Go Live',
            description: 'First evaluation cycle with full AI analysis',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'slide-13',
      order: 12,
      type: 'title',
      content: {
        title: "Let's See It In Action",
        subtitle: 'Live Demo: evalio.islam-org.work',
        text: 'Objective performance evaluation starts here',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
