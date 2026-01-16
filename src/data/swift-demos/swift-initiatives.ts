import { Demo } from '@/types/demo';

export const swiftInitiativesDemo: Demo = {
  id: 'swift-initiatives',
  title: 'Supply Chain Finance',
  description: 'SWIFT initiatives for modern supply chain finance solutions',
  createdAt: new Date('2025-01-01'),
  theme: 'swift-dark',
  autoPlaySpeed: 8,
  slides: [
    {
      id: 'slide-1',
      order: 0,
      type: 'title',
      content: {
        title: 'Supply Chain Finance',
        subtitle: 'Connecting Buyers, Suppliers & Banks',
        text: 'SWIFT Strategic Initiatives 2025',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-2',
      order: 1,
      type: 'content',
      content: {
        title: 'Agenda',
        bullets: [
          'The $2.5 Trillion Supply Chain Finance Gap',
          'Buyer-Led vs Supplier-Led Programs',
          'Early Payment & Dynamic Discounting',
          'SWIFT\'s Role in SCF Digitalization',
          'Bank Integration & Platform Solutions',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'slide-3',
      order: 2,
      type: 'chart',
      content: {
        title: 'Global SCF Market Size',
        subtitle: 'USD Billions - Growing Demand',
        chartType: 'bar',
        chartData: [
          { label: 'Reverse Factoring', value: 850, color: '#8B7355' },
          { label: 'Dynamic Discounting', value: 420, color: '#4a6a5a' },
          { label: 'Invoice Financing', value: 680, color: '#C9A227' },
          { label: 'Payables Finance', value: 550, color: '#0097B2' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-4',
      order: 3,
      type: 'content',
      content: {
        title: 'The Supply Chain Finance Flow',
        subtitle: 'How Money Moves: Supplier → Bank → Buyer',
        bullets: [
          '1. Supplier delivers goods/services to Buyer',
          '2. Buyer approves invoice on SCF platform',
          '3. Bank provides early payment to Supplier (minus discount)',
          '4. Buyer pays Bank on original due date',
          '5. Everyone wins: Supplier gets cash, Buyer extends DPO, Bank earns spread',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'slide-5',
      order: 4,
      type: 'timeline',
      content: {
        title: 'Invoice Lifecycle',
        timeline: [
          {
            year: 'Day 0',
            title: 'Invoice Created',
            description: 'Supplier issues invoice to Buyer for $100,000',
          },
          {
            year: 'Day 5',
            title: 'Buyer Approval',
            description: 'Buyer approves invoice on SCF platform',
          },
          {
            year: 'Day 7',
            title: 'Early Payment',
            description: 'Supplier receives $98,500 (1.5% discount)',
          },
          {
            year: 'Day 60',
            title: 'Settlement',
            description: 'Buyer pays Bank $100,000 on due date',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'slide-6',
      order: 5,
      type: 'chart',
      content: {
        title: 'Who Benefits?',
        subtitle: 'Value Distribution in SCF Programs',
        chartType: 'donut',
        chartData: [
          { label: 'Suppliers (Working Capital)', value: 45, color: '#4a6a5a' },
          { label: 'Buyers (DPO Extension)', value: 30, color: '#4a5a7a' },
          { label: 'Banks (Fee Income)', value: 25, color: '#8B7355' },
        ],
      },
      animation: { entry: 'scale', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-7',
      order: 6,
      type: 'content',
      content: {
        title: 'SWIFT for Supply Chain Finance',
        subtitle: 'Standardized Messaging for SCF',
        bullets: [
          'ISO 20022 messages for invoice data exchange',
          'Bank Payment Obligation (BPO) standards',
          'API connectivity for real-time approvals',
          'Multi-bank platform interoperability',
          'Cross-border payment tracking via gpi',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'slide-8',
      order: 7,
      type: 'speaker',
      content: {
        title: 'Program Lead',
        speaker: {
          name: 'Sarah Chen',
          title: 'Head of Supply Chain Finance',
          company: 'Global Trade Bank',
          bio: 'Leading SCF initiatives connecting 500+ corporate buyers with 10,000+ suppliers across 40 countries.',
        },
      },
      animation: { entry: 'fadeIn', duration: 0.6, delay: 0 },
    },
    {
      id: 'slide-9',
      order: 8,
      type: 'content',
      content: {
        title: 'Key Metrics for Success',
        subtitle: 'Measuring SCF Program Performance',
        bullets: [
          'Days Payable Outstanding (DPO) - Buyer benefit',
          'Days Sales Outstanding (DSO) - Supplier benefit',
          'Discount rates vs. traditional financing costs',
          'Supplier adoption rate (% of spend)',
          'On-time payment performance',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'slide-10',
      order: 9,
      type: 'chart',
      content: {
        title: 'Cost Comparison',
        subtitle: 'Annual Financing Cost by Method',
        chartType: 'bar',
        chartData: [
          { label: 'Traditional Bank Loan', value: 8.5, color: '#6B7F9E' },
          { label: 'Invoice Factoring', value: 6.2, color: '#4a5a7a' },
          { label: 'SCF (Reverse Factoring)', value: 3.5, color: '#4a6a5a' },
          { label: 'Dynamic Discounting', value: 2.8, color: '#8B7355' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'slide-11',
      order: 10,
      type: 'content',
      content: {
        title: '2025 Roadmap',
        subtitle: 'What\'s Next for SCF',
        bullets: [
          'AI-powered credit scoring for suppliers',
          'Blockchain-based invoice verification',
          'ESG-linked financing incentives',
          'Real-time cross-border settlements',
          'SME access expansion programs',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'slide-12',
      order: 11,
      type: 'title',
      content: {
        title: 'Thank You',
        subtitle: 'Unlocking $2.5T in Working Capital',
        text: 'Questions & Discussion',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
