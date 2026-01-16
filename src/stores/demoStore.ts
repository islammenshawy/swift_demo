import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Demo } from '@/types/demo';
import { swiftInitiativesDemo } from '@/data/swift-demos/swift-initiatives';
import { tradeFinance101Demo } from '@/data/swift-demos/trade-finance-101';
import { tradeTemplatingDemo } from '@/data/swift-demos/trade-templating';
import { evalioDemo } from '@/data/swift-demos/evalio-demo';
import { tradeReimaginedDemo } from '@/data/swift-demos/trade-reimagined';

interface DemoState {
  demos: Demo[];
  isInitialized: boolean;

  // Actions
  initializeDemos: () => void;
  addDemo: (demo: Omit<Demo, 'id' | 'createdAt'>) => Demo;
  updateDemo: (id: string, updates: Partial<Demo>) => void;
  deleteDemo: (id: string) => void;
  getDemoById: (id: string) => Demo | undefined;
  importDemos: (demos: Demo[]) => void;
  clearAllDemos: () => void;
}

// Pre-built demos with static IDs for consistent URLs
const defaultDemos: Demo[] = [
  { ...swiftInitiativesDemo, id: 'swift-initiatives' },
  { ...tradeFinance101Demo, id: 'trade-finance-101' },
  { ...tradeTemplatingDemo, id: 'trade-templating' },
  { ...evalioDemo, id: 'evalio-demo' },
  { ...tradeReimaginedDemo, id: 'trade-reimagined' },
];

function generateId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      demos: [],
      isInitialized: false,

      initializeDemos: () => {
        const state = get();

        // Always check for missing default demos (even if already initialized)
        const existingIds = new Set(state.demos.map((d) => d.id));
        const demosToAdd = defaultDemos.filter((d) => !existingIds.has(d.id));

        if (demosToAdd.length > 0 || !state.isInitialized) {
          set({
            demos: [...state.demos, ...demosToAdd],
            isInitialized: true,
          });
        }
      },

      addDemo: (demoData) => {
        const newDemo: Demo = {
          ...demoData,
          id: generateId(),
          createdAt: new Date(),
        };

        set((state) => ({
          demos: [newDemo, ...state.demos],
        }));

        return newDemo;
      },

      updateDemo: (id, updates) => {
        set((state) => ({
          demos: state.demos.map((demo) =>
            demo.id === id
              ? { ...demo, ...updates, updatedAt: new Date() }
              : demo
          ),
        }));
      },

      deleteDemo: (id) => {
        // Prevent deleting default demos
        if (defaultDemos.some((d) => d.id === id)) {
          console.warn('Cannot delete default demos');
          return;
        }

        set((state) => ({
          demos: state.demos.filter((demo) => demo.id !== id),
        }));
      },

      getDemoById: (id) => {
        // For default demos, always return the latest version from code
        const defaultDemo = defaultDemos.find((d) => d.id === id);
        if (defaultDemo) return defaultDemo;

        // For user-created demos, check stored demos
        const state = get();
        return state.demos.find((d) => d.id === id);
      },

      importDemos: (demos) => {
        set((state) => {
          const existingIds = new Set(state.demos.map((d) => d.id));
          const newDemos = demos.filter((d) => !existingIds.has(d.id));
          return {
            demos: [...state.demos, ...newDemos],
          };
        });
      },

      clearAllDemos: () => {
        // Keep only default demos
        set({
          demos: defaultDemos,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'swift-demo-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        demos: state.demos,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize with default demos after rehydration
        if (state) {
          state.initializeDemos();
        }
      },
    }
  )
);
