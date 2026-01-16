import { Demo } from '@/types/demo';

export const tradeFinance101Demo: Demo = {
  id: 'trade-finance-101',
  title: 'SCF Deep Dive',
  description: 'Technical deep dive into Supply Chain Finance mechanics',
  createdAt: new Date('2025-01-01'),
  theme: 'swift-dark',
  autoPlaySpeed: 10,
  slides: [
    {
      id: 'tf-slide-1',
      order: 0,
      type: 'title',
      content: {
        title: 'Supply Chain Finance',
        subtitle: 'Deep Dive: Buyers, Suppliers & Banks',
        text: 'Technical Workshop for Banking Professionals',
      },
      animation: { entry: 'scale', duration: 0.8, delay: 0 },
    },
    {
      id: 'tf-slide-2',
      order: 1,
      type: 'content',
      content: {
        title: 'The Three Players',
        subtitle: 'Understanding Each Role in SCF',
        bullets: [
          'BUYER (Anchor): Large corporates with strong credit ratings',
          'SUPPLIER: SMEs needing faster access to cash flow',
          'BANK (Financier): Provides early payment based on Buyer credit',
          'Platform: Connects all three parties digitally',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.12 },
    },
    {
      id: 'tf-slide-3',
      order: 2,
      type: 'chart',
      content: {
        title: 'Working Capital Impact',
        subtitle: 'Days of Cash Tied Up Before vs After SCF',
        chartType: 'bar',
        chartData: [
          { label: 'Supplier DSO Before', value: 75, color: '#8B7355' },
          { label: 'Supplier DSO After', value: 15, color: '#4a6a5a' },
          { label: 'Buyer DPO Before', value: 45, color: '#6B7F9E' },
          { label: 'Buyer DPO After', value: 90, color: '#0097B2' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'tf-slide-4',
      order: 3,
      type: 'timeline',
      content: {
        title: 'Money Flow: Step by Step',
        timeline: [
          {
            year: 'Day 0',
            title: 'Invoice Created',
            description: 'Supplier ships goods worth $1M to Buyer',
          },
          {
            year: 'Day 3',
            title: 'Buyer Approves',
            description: 'Buyer confirms invoice on SCF platform',
          },
          {
            year: 'Day 5',
            title: 'Bank Pays Supplier',
            description: 'Supplier receives $985K (1.5% APR discount)',
          },
          {
            year: 'Day 90',
            title: 'Buyer Settles',
            description: 'Buyer pays Bank $1M on extended terms',
          },
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.2 },
    },
    {
      id: 'tf-slide-5',
      order: 4,
      type: 'content',
      content: {
        title: 'Why Buyers Participate',
        subtitle: 'Benefits for Corporate Anchors',
        bullets: [
          'Extend payment terms from 30 to 90+ days',
          'Improve working capital without hurting suppliers',
          'Strengthen supplier relationships and supply chain',
          'No balance sheet impact (off-balance sheet financing)',
          'Potential rebates from banks for volume',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'tf-slide-6',
      order: 5,
      type: 'content',
      content: {
        title: 'Why Suppliers Participate',
        subtitle: 'Benefits for SME Vendors',
        bullets: [
          'Get paid in 5 days instead of 60-90 days',
          'Financing at Buyer\'s credit rate (much lower)',
          'No debt on balance sheet (true sale of receivables)',
          'Predictable cash flow for operations',
          'No collateral required unlike bank loans',
        ],
      },
      animation: { entry: 'slideRight', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'tf-slide-7',
      order: 6,
      type: 'chart',
      content: {
        title: 'Bank Revenue per $1M Financed',
        subtitle: 'Revenue breakdown over 90-day term',
        chartType: 'donut',
        chartData: [
          { label: 'Discount Fee ($15K)', value: 50, color: '#4a6a5a' },
          { label: 'Platform Fee ($3K)', value: 10, color: '#4a5a7a' },
          { label: 'FX Spread ($6K)', value: 20, color: '#8B7355' },
          { label: 'Ancillary Services ($6K)', value: 20, color: '#0097B2' },
        ],
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
    {
      id: 'tf-slide-8',
      order: 7,
      type: 'content',
      content: {
        title: 'Risk Considerations',
        subtitle: 'What Banks Need to Evaluate',
        bullets: [
          'Buyer credit risk (primary exposure)',
          'Dilution risk: disputes, returns, credits',
          'Fraud risk: duplicate invoices, fake shipments',
          'Operational risk: platform failures',
          'Concentration risk: over-reliance on single buyer',
        ],
      },
      animation: { entry: 'slideUp', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'tf-slide-9',
      order: 8,
      type: 'chart',
      content: {
        title: 'Pricing Example',
        subtitle: 'Cost to Supplier for Early Payment (% APR)',
        chartType: 'bar',
        chartData: [
          { label: 'Bank Overdraft', value: 12.5, color: '#8B7355' },
          { label: 'Factoring', value: 8.0, color: '#6B7F9E' },
          { label: 'SCF Program', value: 3.5, color: '#4a6a5a' },
          { label: 'Dynamic Discounting', value: 2.0, color: '#0097B2' },
        ],
      },
      animation: { entry: 'fadeIn', duration: 0.5, delay: 0 },
    },
    {
      id: 'tf-slide-10',
      order: 9,
      type: 'speaker',
      content: {
        title: 'Program Director',
        speaker: {
          name: 'David Nakamura',
          title: 'VP Supply Chain Finance',
          company: 'Asia Pacific Trade Bank',
          bio: 'Launched 50+ SCF programs across APAC, financing $2B+ annually. Specialist in multi-bank platform integrations.',
        },
      },
      animation: { entry: 'fadeIn', duration: 0.6, delay: 0 },
    },
    {
      id: 'tf-slide-11',
      order: 10,
      type: 'content',
      content: {
        title: 'SWIFT Integration Points',
        subtitle: 'How SWIFT Enables SCF',
        bullets: [
          'MT798: Trade finance message envelope',
          'ISO 20022: Rich data for invoice details',
          'gpi: Track cross-border supplier payments',
          'API Gateway: Real-time platform connectivity',
          'KYC Registry: Streamlined supplier onboarding',
        ],
      },
      animation: { entry: 'slideLeft', duration: 0.5, delay: 0, stagger: 0.1 },
    },
    {
      id: 'tf-slide-12',
      order: 11,
      type: 'title',
      content: {
        title: 'Questions?',
        subtitle: 'SCF: Win-Win-Win for Buyers, Suppliers & Banks',
        text: 'Discussion & Next Steps',
      },
      animation: { entry: 'scale', duration: 0.6, delay: 0 },
    },
  ],
};
