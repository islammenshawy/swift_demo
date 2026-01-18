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
  const demo = demos[id];
  if (!demo) return null;

  // Filter out hidden slides and re-index
  const visibleSlides = demo.slides
    .filter(slide => !slide.hidden)
    .map((slide, index) => ({ ...slide, order: index }));

  return { ...demo, slides: visibleSlides };
}
