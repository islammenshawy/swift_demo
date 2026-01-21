import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AnimationStyle } from '@/types/demo';

interface LandingState {
  animationStyle: AnimationStyle;
  isTransitioning: boolean;
  mousePosition: { x: number; y: number };
  shouldExit: boolean;

  setAnimationStyle: (style: AnimationStyle) => void;
  setMousePosition: (pos: { x: number; y: number }) => void;
  triggerExit: () => void;
  resetExit: () => void;
}

export const useLandingStore = create<LandingState>()(
  devtools(
    persist(
      (set) => ({
        animationStyle: 'globe',
        isTransitioning: false,
        mousePosition: { x: 0, y: 0 },
        shouldExit: false,

        setAnimationStyle: (style) => set({ animationStyle: style }),

        setMousePosition: (pos) => set({ mousePosition: pos }),

        triggerExit: () => set({ shouldExit: true, isTransitioning: true }),

        resetExit: () => set({ shouldExit: false, isTransitioning: false }),
      }),
      { name: 'landing-store', partialize: (state) => ({ animationStyle: state.animationStyle }) }
    ),
    { name: 'landing-store' }
  )
);
