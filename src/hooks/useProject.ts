'use client'

import { useState, useCallback } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/sync'
import type { Demo } from '@/types/demo'

interface Project {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

interface UseProjectResult {
  project: Project | null
  presentation: Demo | null
  isLoading: boolean
  error: string | null
  loadProject: (id: string) => Promise<void>
  updateProject: (updates: Partial<Project>) => Promise<void>
  updatePresentation: (updates: Partial<Demo>) => Promise<void>
  deleteProject: () => Promise<void>
}

export function useProject(projectId?: string): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null)
  const [presentation, setPresentation] = useState<Demo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to load from localStorage first (for offline support)
      const cachedPresentation = loadFromLocalStorage(id)

      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) {
        throw new Error('Failed to load project')
      }

      const data = await response.json()
      setProject(data.project)

      if (data.presentation) {
        const presentationData: Demo = {
          id: data.presentation.projectId,
          title: data.project.title,
          description: data.project.description,
          slides: data.presentation.slides,
          theme: data.presentation.theme || 'swift-dark',
          autoPlaySpeed: data.presentation.autoPlaySpeed || 5000,
          createdAt: new Date(data.presentation.createdAt),
          updatedAt: new Date(data.presentation.updatedAt),
        }

        // Use server data, but merge with any locally cached changes if newer
        if (cachedPresentation && cachedPresentation.updatedAt) {
          const serverDate = new Date(data.presentation.updatedAt)
          const localDate = new Date(cachedPresentation.updatedAt)
          if (localDate > serverDate) {
            setPresentation(cachedPresentation)
            return
          }
        }

        setPresentation(presentationData)
        saveToLocalStorage(id, presentationData)
      }
    } catch (err) {
      console.error('Error loading project:', err)
      setError('Failed to load project')

      // Fall back to cached data if available
      const cachedPresentation = loadFromLocalStorage(id)
      if (cachedPresentation) {
        setPresentation(cachedPresentation)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProject = useCallback(async (updates: Partial<Project>) => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      const data = await response.json()
      setProject(data.project)
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }, [project])

  const updatePresentation = useCallback(async (updates: Partial<Demo>) => {
    if (!project || !presentation) return

    const updatedPresentation = { ...presentation, ...updates }
    setPresentation(updatedPresentation)
    saveToLocalStorage(project._id, updatedPresentation)

    try {
      const response = await fetch(`/api/presentations/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: updatedPresentation.slides,
          theme: updatedPresentation.theme,
          autoPlaySpeed: updatedPresentation.autoPlaySpeed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update presentation')
      }
    } catch (err) {
      console.error('Error updating presentation:', err)
      throw err
    }
  }, [project, presentation])

  const deleteProject = useCallback(async () => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProject(null)
      setPresentation(null)
    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }, [project])

  return {
    project,
    presentation,
    isLoading,
    error,
    loadProject,
    updateProject,
    updatePresentation,
    deleteProject,
  }
}
