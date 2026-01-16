import PptxGenJS from 'pptxgenjs';
import { domToPng } from 'modern-screenshot';
import { Demo, Slide, VisualizationType } from '@/types/demo';

// Animation phase counts for each visualization type
export const VISUALIZATION_PHASE_COUNTS: Record<string, number> = {
  'module-consolidation': 5,
  'legacy-problems': 1,
  'technical-challenges': 1,
  'product-opportunities': 1,
  'transformation-goals': 1,
  'elc-reimagination': 1,
  'transformation-metrics': 1,
  'trade-architecture': 1,
};

// Get phase count for a visualization
export function getPhaseCount(vizType: VisualizationType | undefined): number {
  if (!vizType) return 1;
  return VISUALIZATION_PHASE_COUNTS[vizType] || 1;
}

// Capture a DOM element as a base64 image
export async function captureElement(element: HTMLElement): Promise<string> {
  const dataUrl = await domToPng(element, {
    backgroundColor: '#0A1628',
    scale: 2, // Higher resolution
    style: {
      // Force standard color space to avoid oklab issues
      colorScheme: 'dark',
    },
  });

  return dataUrl;
}

// Create PowerPoint from captured images
export async function createPptxFromImages(
  images: string[],
  title: string
): Promise<Blob> {
  const pres = new PptxGenJS();

  // Set presentation properties
  pres.author = 'SWIFT Demo Platform';
  pres.title = title;
  pres.company = 'SWIFT';

  // Set slide size (16:9)
  pres.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
  pres.layout = 'WIDE';

  // Add each image as a slide
  for (let i = 0; i < images.length; i++) {
    const slide = pres.addSlide();

    // Set fade transition for smooth animations between phases
    if (i > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (slide as any).transition = { type: 'fade', speed: 0.5 };
    }

    // Add the screenshot as a full-slide background
    slide.addImage({
      data: images[i],
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'cover', w: '100%', h: '100%' },
    });
  }

  // Generate and return blob
  const blob = await pres.write({ outputType: 'blob' }) as Blob;
  return blob;
}

// Helper to trigger download
export function downloadPptx(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Calculate total slides including animation phases
export function calculateTotalSlides(demo: Demo): number {
  let total = 0;
  for (const slide of demo.slides) {
    if (slide.type === 'interactive' && slide.content.visualization) {
      total += getPhaseCount(slide.content.visualization);
    } else {
      total += 1;
    }
  }
  return total;
}

// Generate slide capture plan
export interface CaptureStep {
  slideIndex: number;
  phase: number;
  totalPhases: number;
  slide: Slide;
}

export function generateCapturePlan(demo: Demo): CaptureStep[] {
  const steps: CaptureStep[] = [];

  for (let i = 0; i < demo.slides.length; i++) {
    const slide = demo.slides[i];
    const phases = slide.type === 'interactive' && slide.content.visualization
      ? getPhaseCount(slide.content.visualization)
      : 1;

    for (let phase = 0; phase < phases; phase++) {
      steps.push({
        slideIndex: i,
        phase,
        totalPhases: phases,
        slide,
      });
    }
  }

  return steps;
}
