'use client'

import { useEditorStore } from '@/stores/editorStore'
import type { Slide } from '@/types/demo'

interface SlidePanelProps {
  slides: Slide[]
  currentIndex: number
}

export function SlidePanel({ slides, currentIndex }: SlidePanelProps) {
  const { setCurrentSlide, addSlide, deleteSlide, duplicateSlide, reorderSlides } = useEditorStore()

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      order: slides.length + 1,
      type: 'content',
      content: {
        title: 'New Slide',
        bullets: ['Click to edit'],
      },
      animation: {
        type: 'fadeIn',
        duration: 500,
        delay: 0,
      },
    }
    addSlide(newSlide)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (fromIndex !== toIndex) {
      reorderSlides(fromIndex, toIndex)
    }
  }

  return (
    <div className="w-56 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Slides</span>
        <button
          onClick={handleAddSlide}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
          title="Add slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => setCurrentSlide(index)}
            className={`group relative cursor-pointer rounded-lg overflow-hidden border-2 transition ${
              index === currentIndex
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Slide number */}
            <div className="absolute top-1 left-1 z-10 w-5 h-5 bg-black/60 rounded text-xs text-white flex items-center justify-center">
              {index + 1}
            </div>

            {/* Slide preview */}
            <div className="aspect-video bg-slate-700/50 flex items-center justify-center p-2">
              <div className="text-center">
                <p className="text-[8px] text-white font-medium truncate max-w-full">
                  {slide.content.title || 'Untitled'}
                </p>
                <p className="text-[6px] text-slate-400 mt-0.5">
                  {slide.type}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition flex gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateSlide(slide.id)
                }}
                className="p-1 bg-black/60 text-white hover:bg-blue-600 rounded text-xs"
                title="Duplicate"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSlide(slide.id)
                  }}
                  className="p-1 bg-black/60 text-white hover:bg-red-600 rounded text-xs"
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
