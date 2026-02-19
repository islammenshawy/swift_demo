import { create } from 'zustand'

export type AIProvider = 'openai' | 'anthropic'

interface UserSettings {
  aiProvider: AIProvider
  autoSave: boolean
  autoSaveInterval: number // in seconds
}

interface AuthStore {
  settings: UserSettings
  setAIProvider: (provider: AIProvider) => void
  setAutoSave: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  updateSettings: (settings: Partial<UserSettings>) => void
}

const defaultSettings: UserSettings = {
  aiProvider: 'openai',
  autoSave: true,
  autoSaveInterval: 30,
}

export const useAuthStore = create<AuthStore>((set) => ({
  settings: defaultSettings,

  setAIProvider: (provider) =>
    set((state) => ({
      settings: { ...state.settings, aiProvider: provider },
    })),

  setAutoSave: (enabled) =>
    set((state) => ({
      settings: { ...state.settings, autoSave: enabled },
    })),

  setAutoSaveInterval: (interval) =>
    set((state) => ({
      settings: { ...state.settings, autoSaveInterval: interval },
    })),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}))
