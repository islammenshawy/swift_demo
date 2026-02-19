'use client'

import { useState, useEffect } from 'react'
import { useEditorStore, SelectedElement } from '@/stores/editorStore'
import type { Slide, SlideAnimation, VisualizationType } from '@/types/demo'

// Animation presets with Framer Motion configurations
const ANIMATION_PRESETS = [
  { id: 'none', name: 'None', config: { type: 'none', duration: 0, delay: 0 } },
  { id: 'fadeIn', name: 'Fade In', config: { type: 'fadeIn', duration: 500, delay: 0 } },
  { id: 'slideLeft', name: 'Slide Left', config: { type: 'slideLeft', duration: 600, delay: 0 } },
  { id: 'slideRight', name: 'Slide Right', config: { type: 'slideRight', duration: 600, delay: 0 } },
  { id: 'slideUp', name: 'Slide Up', config: { type: 'slideUp', duration: 600, delay: 0 } },
  { id: 'scale', name: 'Scale', config: { type: 'scale', duration: 500, delay: 0 } },
  { id: 'blur', name: 'Blur In', config: { type: 'blur', duration: 400, delay: 0 } },
  { id: 'spring', name: 'Spring Bounce', config: { type: 'scale', duration: 800, delay: 0, stiffness: 260, damping: 20 } },
]

// Available visualizations from the existing codebase
const VISUALIZATION_OPTIONS: { id: VisualizationType; name: string; category: string }[] = [
  { id: 'message-inbox', name: 'Message Inbox', category: 'Interactive' },
  { id: 'template-comparison', name: 'Template Comparison', category: 'Comparison' },
  { id: 'memory-train', name: 'Memory Train', category: 'Animation' },
  { id: 'elc-architecture', name: 'ELC Architecture', category: 'Diagrams' },
  { id: 'elc-integration-patterns', name: 'ELC Integration', category: 'Diagrams' },
  { id: 'elc-roadmap', name: 'ELC Roadmap', category: 'Timeline' },
  { id: 'engineering-score-journey', name: 'Engineering Score', category: 'Charts' },
  { id: 'elc-deliverables-heatmap', name: 'Deliverables Heatmap', category: 'Charts' },
  // Add more from the existing types
]

interface PropertiesPanelProps {
  slide: Slide
  selectedElement: SelectedElement
}

export function PropertiesPanel({ slide, selectedElement }: PropertiesPanelProps) {
  const { updateSlideContent, updateSlideAnimation, selectElement } = useEditorStore()
  const [editValue, setEditValue] = useState(selectedElement.content)

  useEffect(() => {
    setEditValue(selectedElement.content)
  }, [selectedElement])

  const handleContentChange = (value: string) => {
    setEditValue(value)

    // Update based on element type
    switch (selectedElement.type) {
      case 'title':
        updateSlideContent(slide.id, { title: value })
        break
      case 'subtitle':
        updateSlideContent(slide.id, { subtitle: value })
        break
      case 'text':
        updateSlideContent(slide.id, { text: value })
        break
      case 'bullet':
        if (selectedElement.index !== undefined && slide.content.bullets) {
          const newBullets = [...slide.content.bullets]
          newBullets[selectedElement.index] = value
          updateSlideContent(slide.id, { bullets: newBullets })
        }
        break
    }
  }

  const handleAnimationChange = (preset: typeof ANIMATION_PRESETS[0]) => {
    updateSlideAnimation(slide.id, preset.config as SlideAnimation)
  }

  const handleVisualizationChange = (vizId: VisualizationType) => {
    updateSlideContent(slide.id, { visualization: vizId })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Properties</h3>
          <p className="text-xs text-slate-400 capitalize">{selectedElement.type}</p>
        </div>
        <button
          onClick={() => selectElement(null)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content editor */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Text content */}
        {(selectedElement.type === 'title' ||
          selectedElement.type === 'subtitle' ||
          selectedElement.type === 'text' ||
          selectedElement.type === 'bullet') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            {selectedElement.type === 'text' ? (
              <textarea
                value={editValue}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        )}

        {/* Visualization selector for interactive slides */}
        {selectedElement.type === 'visualization' && slide.type === 'interactive' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Visualization Type
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {VISUALIZATION_OPTIONS.map((viz) => (
                <button
                  key={viz.id}
                  onClick={() => handleVisualizationChange(viz.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    slide.content.visualization === viz.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-medium">{viz.name}</div>
                  <div className="text-xs opacity-70">{viz.category}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Animation settings */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Animation
          </label>
          <div className="space-y-2">
            {ANIMATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleAnimationChange(preset)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  slide.animation.type === preset.config.type
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Animation timing */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Duration (ms)
          </label>
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={slide.animation.duration}
            onChange={(e) =>
              updateSlideAnimation(slide.id, { duration: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-xs text-slate-400 text-right">{slide.animation.duration}ms</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Delay (ms)
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={slide.animation.delay}
            onChange={(e) =>
              updateSlideAnimation(slide.id, { delay: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-xs text-slate-400 text-right">{slide.animation.delay}ms</div>
        </div>
      </div>
    </div>
  )
}
