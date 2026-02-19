'use client'

import { useEffect, useCallback } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { SlidePanel } from './SlidePanel'
import { SlideCanvas } from './SlideCanvas'
import { ChatPanel } from './ChatPanel'
import { EditorToolbar } from './EditorToolbar'
import { PropertiesPanel } from './PropertiesPanel'
import type { Demo } from '@/types/demo'

interface SlideEditorProps {
  projectId: string
  projectTitle: string
  presentation: Demo
  onSave: (presentation: Demo) => Promise<void>
}

export function SlideEditor({
  projectId,
  projectTitle,
  presentation: initialPresentation,
  onSave,
}: SlideEditorProps) {
  const {
    presentation,
    isDirty,
    isSaving,
    currentSlideIndex,
    selectedElement,
    isPreviewMode,
    setProject,
    markSaved,
    setSaving,
  } = useEditorStore()

  // Initialize editor with project data
  useEffect(() => {
    setProject(projectId, projectTitle, initialPresentation)
  }, [projectId, projectTitle, initialPresentation, setProject])

  // Auto-save functionality
  const handleSave = useCallback(async () => {
    if (!presentation || isSaving) return

    setSaving(true)
    try {
      await onSave(presentation)
      markSaved()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }, [presentation, isSaving, onSave, markSaved, setSaving])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!isDirty) return

    const timer = setTimeout(() => {
      handleSave()
    }, 30000) // Auto-save every 30 seconds if dirty

    return () => clearTimeout(timer)
  }, [isDirty, handleSave])

  if (!presentation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const currentSlide = presentation.slides[currentSlideIndex]

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Toolbar */}
      <EditorToolbar
        projectTitle={projectTitle}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        isPreviewMode={isPreviewMode}
      />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Slide thumbnails */}
        <SlidePanel
          slides={presentation.slides}
          currentIndex={currentSlideIndex}
        />

        {/* Center: Slide canvas */}
        <div className="flex-1 flex flex-col">
          <SlideCanvas
            slide={currentSlide}
            isPreviewMode={isPreviewMode}
            selectedElement={selectedElement}
          />
        </div>

        {/* Right: Properties or Chat panel */}
        <div className="w-80 border-l border-slate-700/50 flex flex-col">
          {selectedElement ? (
            <PropertiesPanel
              slide={currentSlide}
              selectedElement={selectedElement}
            />
          ) : (
            <ChatPanel
              projectId={projectId}
              slide={currentSlide}
            />
          )}
        </div>
      </div>
    </div>
  )
}
