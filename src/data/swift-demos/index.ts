import { Demo } from '@/types/demo';
import { swiftInitiativesDemo } from './swift-initiatives';
import { tradeFinance101Demo } from './trade-finance-101';
import { tradeTemplatingDemo } from './trade-templating';
import { evalioDemo } from './evalio-demo';
import { tradeReimaginedDemo } from './trade-reimagined';

export const demos: Record<string, Demo> = {
  'swift-initiatives': swiftInitiativesDemo,
  'trade-finance-101': tradeFinance101Demo,
  'trade-templating': tradeTemplatingDemo,
  'evalio-demo': evalioDemo,
  'trade-reimagined': tradeReimaginedDemo,
};

export const demoList = Object.values(demos).map((demo) => ({
  id: demo.id,
  title: demo.title,
  description: demo.description,
  slideCount: demo.slides.length,
}));

export function getDemo(id: string): Demo | null {
  return demos[id] || null;
}
