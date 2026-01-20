import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Demo } from '@/types/demo';

// Phase counts for interactive visualizations
const VISUALIZATION_PHASE_COUNTS: Record<string, number> = {
  'module-consolidation': 6,
  'legacy-problems': 8,        // 8 problems to cycle through
  'technical-challenges': 5,   // 5 challenges to cycle through
  'product-opportunities': 6,  // 6 opportunities to cycle through
  'transformation-goals': 1,
  'elc-reimagination': 1,
  'transformation-metrics': 1,
  'trade-architecture': 1,
  'engineering-score-journey': 5, // 5 phases: 0=question, 1=metrics, 2=types, 3=levels, 4=fair
};

function getPhaseCount(demo: Demo | null, slideIndex: number): number {
  if (!demo || slideIndex >= demo.slides.length) return 1;
  const slide = demo.slides[slideIndex];
  if (slide.type === 'interactive' && slide.content.visualization) {
    return VISUALIZATION_PHASE_COUNTS[slide.content.visualization] || 1;
  }
  return 1;
}

interface PresentationState {
  currentDemo: Demo | null;
  currentSlideIndex: number;
  currentPhase: number;
  isPlaying: boolean;
  playbackSpeed: number;
  direction: number;
  isFullscreen: boolean;
  // Navigation key increments on every slide change to force animation remount
  navigationKey: number;

  setDemo: (demo: Demo) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  setPhase: (phase: number) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleFullscreen: () => void;
  reset: () => void;
  getCurrentPhaseCount: () => number;
}

export const usePresentationStore = create<PresentationState>()(
  devtools(
    (set, get) => ({
      currentDemo: null,
      currentSlideIndex: 0,
      currentPhase: 0,
      isPlaying: false,
      playbackSpeed: 5,
      direction: 1,
      isFullscreen: false,
      navigationKey: 0,

      setDemo: (demo) => {
        // Filter out hidden slides and re-index orders
        const visibleSlides = demo.slides
          .filter(slide => !slide.hidden)
          .map((slide, index) => ({ ...slide, order: index }));
        const filteredDemo = { ...demo, slides: visibleSlides };
        set({ currentDemo: filteredDemo, currentSlideIndex: 0, currentPhase: 0, isPlaying: false, navigationKey: 0 });
      },

      nextSlide: () => {
        const { currentDemo, currentSlideIndex, currentPhase, isPlaying, navigationKey } = get();
        if (!currentDemo) return;

        const totalPhases = getPhaseCount(currentDemo, currentSlideIndex);

        // If there are more phases in current slide, advance phase
        if (currentPhase < totalPhases - 1) {
          set({
            currentPhase: currentPhase + 1,
            direction: 1,
          });
        }
        // Otherwise, move to next slide
        else if (currentSlideIndex < currentDemo.slides.length - 1) {
          set({
            currentSlideIndex: currentSlideIndex + 1,
            currentPhase: 0,
            direction: 1,
            navigationKey: navigationKey + 1,
          });
        } else if (isPlaying) {
          set({ isPlaying: false });
        }
      },

      prevSlide: () => {
        const { currentDemo, currentSlideIndex, currentPhase, navigationKey } = get();
        if (!currentDemo) return;

        // If there are previous phases in current slide, go back
        if (currentPhase > 0) {
          set({
            currentPhase: currentPhase - 1,
            direction: -1,
          });
        }
        // Otherwise, move to previous slide (at its last phase)
        else if (currentSlideIndex > 0) {
          const prevSlidePhases = getPhaseCount(currentDemo, currentSlideIndex - 1);
          set({
            currentSlideIndex: currentSlideIndex - 1,
            currentPhase: prevSlidePhases - 1,
            direction: -1,
            navigationKey: navigationKey + 1,
          });
        }
      },

      goToSlide: (index) => {
        const { currentSlideIndex, currentDemo, navigationKey } = get();
        if (currentDemo && index >= 0 && index < currentDemo.slides.length) {
          set({
            currentSlideIndex: index,
            currentPhase: 0,
            direction: index > currentSlideIndex ? 1 : -1,
            navigationKey: navigationKey + 1,
          });
        }
      },

      setPhase: (phase) => {
        const { currentDemo, currentSlideIndex, currentPhase } = get();
        const totalPhases = getPhaseCount(currentDemo, currentSlideIndex);
        if (phase >= 0 && phase < totalPhases && phase !== currentPhase) {
          set({
            currentPhase: phase,
            direction: phase > currentPhase ? 1 : -1,
          });
        }
      },

      togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

      toggleFullscreen: () =>
        set((state) => ({ isFullscreen: !state.isFullscreen })),

      reset: () =>
        set({
          currentDemo: null,
          currentSlideIndex: 0,
          currentPhase: 0,
          isPlaying: false,
          direction: 1,
          navigationKey: 0,
        }),

      getCurrentPhaseCount: () => {
        const { currentDemo, currentSlideIndex } = get();
        return getPhaseCount(currentDemo, currentSlideIndex);
      },
    }),
    { name: 'presentation-store' }
  )
);
