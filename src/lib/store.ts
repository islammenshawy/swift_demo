import { Demo } from '@/types/demo';

// In-memory store that persists in the browser via localStorage
const STORAGE_KEY = 'swift-demo-store';

interface Store {
  demos: Record<string, Demo>;
  settings: Record<string, unknown>;
}

// Initialize store from localStorage or empty
function initStore(): Store {
  if (typeof window === 'undefined') {
    return { demos: {}, settings: {} };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      Object.values(parsed.demos || {}).forEach((demo: any) => {
        demo.createdAt = new Date(demo.createdAt);
        if (demo.updatedAt) demo.updatedAt = new Date(demo.updatedAt);
      });
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load store from localStorage:', e);
  }

  return { demos: {}, settings: {} };
}

let store: Store = initStore();

// Save to localStorage
function persist(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to persist store:', e);
  }
}

// Generate unique ID
function generateId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Demo operations
export function getAllDemos(): Demo[] {
  return Object.values(store.demos).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDemoById(id: string): Demo | null {
  return store.demos[id] || null;
}

export function createDemo(demo: Omit<Demo, 'id' | 'createdAt'>): Demo {
  const newDemo: Demo = {
    ...demo,
    id: generateId(),
    createdAt: new Date(),
  };

  store.demos[newDemo.id] = newDemo;
  persist();
  return newDemo;
}

export function updateDemo(id: string, updates: Partial<Demo>): Demo | null {
  const existing = store.demos[id];
  if (!existing) return null;

  const updated: Demo = {
    ...existing,
    ...updates,
    id, // Preserve ID
    updatedAt: new Date(),
  };

  store.demos[id] = updated;
  persist();
  return updated;
}

export function deleteDemo(id: string): boolean {
  if (!store.demos[id]) return false;
  delete store.demos[id];
  persist();
  return true;
}

// Settings operations
export function getSetting<T>(key: string, defaultValue?: T): T | null {
  return (store.settings[key] as T) ?? defaultValue ?? null;
}

export function setSetting<T>(key: string, value: T): void {
  store.settings[key] = value;
  persist();
}

// Import demos (for seeding)
export function importDemos(demos: Demo[]): void {
  demos.forEach((demo) => {
    if (!store.demos[demo.id]) {
      store.demos[demo.id] = demo;
    }
  });
  persist();
}

// Clear all data
export function clearStore(): void {
  store = { demos: {}, settings: {} };
  persist();
}

// Export/Import full store (for backup/restore)
export function exportStore(): string {
  return JSON.stringify(store, null, 2);
}

export function importStore(json: string): boolean {
  try {
    const imported = JSON.parse(json);
    store = imported;
    persist();
    return true;
  } catch {
    return false;
  }
}

// Initialize store on module load (client-side only)
if (typeof window !== 'undefined') {
  // Re-init on window focus to sync across tabs
  window.addEventListener('focus', () => {
    store = initStore();
  });
}
