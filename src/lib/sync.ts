import type { Demo } from '@/types/demo'

// Sync states
export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error' | 'offline'

interface SyncState {
  status: SyncStatus
  lastSynced: Date | null
  pendingChanges: PendingChange[]
  error: string | null
}

interface PendingChange {
  id: string
  projectId: string
  type: 'presentation' | 'project' | 'chat'
  data: unknown
  timestamp: Date
}

// Local storage keys
const SYNC_STATE_KEY = 'slideforge_sync_state'
const PENDING_CHANGES_KEY = 'slideforge_pending_changes'

// Get current sync state
export function getSyncState(): SyncState {
  if (typeof window === 'undefined') {
    return {
      status: 'synced',
      lastSynced: null,
      pendingChanges: [],
      error: null,
    }
  }

  try {
    const stored = localStorage.getItem(SYNC_STATE_KEY)
    if (stored) {
      const state = JSON.parse(stored)
      return {
        ...state,
        lastSynced: state.lastSynced ? new Date(state.lastSynced) : null,
        pendingChanges: state.pendingChanges.map((c: PendingChange) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        })),
      }
    }
  } catch {
    // Ignore parse errors
  }

  return {
    status: 'synced',
    lastSynced: null,
    pendingChanges: [],
    error: null,
  }
}

// Save sync state
function saveSyncState(state: SyncState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state))
}

// Add a pending change (for offline support)
export function addPendingChange(
  projectId: string,
  type: PendingChange['type'],
  data: unknown
) {
  const state = getSyncState()
  const newChange: PendingChange = {
    id: `change-${Date.now()}`,
    projectId,
    type,
    data,
    timestamp: new Date(),
  }

  state.pendingChanges.push(newChange)
  state.status = 'pending'
  saveSyncState(state)

  return newChange.id
}

// Remove a pending change after successful sync
export function removePendingChange(changeId: string) {
  const state = getSyncState()
  state.pendingChanges = state.pendingChanges.filter((c) => c.id !== changeId)
  if (state.pendingChanges.length === 0) {
    state.status = 'synced'
    state.lastSynced = new Date()
  }
  saveSyncState(state)
}

// Sync pending changes to server
export async function syncPendingChanges(): Promise<boolean> {
  const state = getSyncState()
  if (state.pendingChanges.length === 0) return true

  state.status = 'syncing'
  saveSyncState(state)

  let allSuccess = true

  for (const change of state.pendingChanges) {
    try {
      let response: Response

      switch (change.type) {
        case 'presentation':
          response = await fetch(`/api/presentations/${change.projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change.data),
          })
          break
        case 'project':
          response = await fetch(`/api/projects/${change.projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change.data),
          })
          break
        default:
          continue
      }

      if (response.ok) {
        removePendingChange(change.id)
      } else {
        allSuccess = false
      }
    } catch {
      allSuccess = false
    }
  }

  const updatedState = getSyncState()
  if (allSuccess) {
    updatedState.status = 'synced'
    updatedState.lastSynced = new Date()
    updatedState.error = null
  } else {
    updatedState.status = 'error'
    updatedState.error = 'Some changes failed to sync'
  }
  saveSyncState(updatedState)

  return allSuccess
}

// Check if online
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

// Save presentation to localStorage (for offline support)
export function saveToLocalStorage(projectId: string, presentation: Demo) {
  if (typeof window === 'undefined') return
  const key = `slideforge_presentation_${projectId}`
  localStorage.setItem(key, JSON.stringify(presentation))
}

// Load presentation from localStorage
export function loadFromLocalStorage(projectId: string): Demo | null {
  if (typeof window === 'undefined') return null
  try {
    const key = `slideforge_presentation_${projectId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

// Clear local storage for a project
export function clearLocalStorage(projectId: string) {
  if (typeof window === 'undefined') return
  const key = `slideforge_presentation_${projectId}`
  localStorage.removeItem(key)
}

// Setup online/offline event listeners
export function setupSyncListeners(onStatusChange: (status: SyncStatus) => void) {
  if (typeof window === 'undefined') return () => {}

  const handleOnline = () => {
    // Try to sync pending changes when coming back online
    syncPendingChanges().then((success) => {
      onStatusChange(success ? 'synced' : 'error')
    })
  }

  const handleOffline = () => {
    onStatusChange('offline')
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Check initial state
  if (!navigator.onLine) {
    onStatusChange('offline')
  }

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}
