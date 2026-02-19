'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { saveToLocalStorage, addPendingChange, isOnline, syncPendingChanges } from '@/lib/sync'
import type { Demo } from '@/types/demo'

interface UseAutoSaveOptions {
  projectId: string
  presentation: Demo | null
  isDirty: boolean
  onSave: (presentation: Demo) => Promise<void>
  onSaveStart?: () => void
  onSaveEnd?: (success: boolean) => void
}

export function useAutoSave({
  projectId,
  presentation,
  isDirty,
  onSave,
  onSaveStart,
  onSaveEnd,
}: UseAutoSaveOptions) {
  const { settings } = useAuthStore()
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Generate a hash of the presentation for comparison
  const getHash = useCallback((data: Demo | null) => {
    if (!data) return ''
    return JSON.stringify(data.slides)
  }, [])

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!presentation || !isDirty) return

    const currentHash = getHash(presentation)
    if (currentHash === lastSavedRef.current) return

    onSaveStart?.()

    // Always save to localStorage first (offline support)
    saveToLocalStorage(projectId, presentation)

    if (isOnline()) {
      try {
        await onSave(presentation)
        lastSavedRef.current = currentHash
        onSaveEnd?.(true)
      } catch (error) {
        console.error('Auto-save failed:', error)
        // Queue for later sync
        addPendingChange(projectId, 'presentation', {
          slides: presentation.slides,
          theme: presentation.theme,
          autoPlaySpeed: presentation.autoPlaySpeed,
        })
        onSaveEnd?.(false)
      }
    } else {
      // Offline - queue for later
      addPendingChange(projectId, 'presentation', {
        slides: presentation.slides,
        theme: presentation.theme,
        autoPlaySpeed: presentation.autoPlaySpeed,
      })
      onSaveEnd?.(false)
    }
  }, [projectId, presentation, isDirty, onSave, onSaveStart, onSaveEnd, getHash])

  // Setup auto-save timer
  useEffect(() => {
    if (!settings.autoSave || !isDirty) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      autoSave()
    }, settings.autoSaveInterval * 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [isDirty, settings.autoSave, settings.autoSaveInterval, autoSave])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && presentation) {
        // Save to localStorage before unload
        saveToLocalStorage(projectId, presentation)

        // Show confirmation dialog
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, presentation, projectId])

  // Sync when coming back online
  useEffect(() => {
    const handleOnline = () => {
      syncPendingChanges()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return {
    saveNow: autoSave,
  }
}
