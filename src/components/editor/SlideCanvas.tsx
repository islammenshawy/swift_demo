'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useEditorStore, SelectedElement } from '@/stores/editorStore'
import SlideRenderer from '@/components/presentation/SlideRenderer'
import { SandpackSlideRenderer } from '@/components/editor/SandpackSlideRenderer'
import type { Slide } from '@/types/demo'

interface SlideCanvasProps {
  slide: Slide
  isPreviewMode: boolean
  selectedElement: SelectedElement | null
}

export function SlideCanvas({ slide, isPreviewMode, selectedElement }: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { zoom, setZoom, selectElement, generatedSlides } = useEditorStore()

  // Check if this slide has a generated component
  const generatedSlide = generatedSlides[slide.id]

  // Handle element selection when clicking on the canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return

    const target = e.target as HTMLElement

    // Find selectable element
    const selectableElement = target.closest('[data-selectable]') as HTMLElement
    if (selectableElement) {
      const elementType = selectableElement.dataset.elementType as SelectedElement['type']
      const elementPath = selectableElement.dataset.elementPath || ''
      const elementIndex = selectableElement.dataset.elementIndex
        ? parseInt(selectableElement.dataset.elementIndex)
        : undefined

      selectElement({
        type: elementType,
        path: elementPath,
        content: selectableElement.textContent || '',
        index: elementIndex,
      })
    } else {
      selectElement(null)
    }
  }

  const handleZoomIn = () => setZoom(zoom + 10)
  const handleZoomOut = () => setZoom(zoom - 10)
  const handleZoomReset = () => setZoom(100)

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Zoom controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
            disabled={zoom <= 25}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition min-w-[50px]"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
            disabled={zoom >= 200}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {generatedSlide && (
            <button
              onClick={() => {
                console.log('Generated Code:', generatedSlide.componentCode)
                console.log('Generated Data:', generatedSlide.data)
                alert('Code logged to browser console (F12 > Console)')
              }}
              className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              View Code
            </button>
          )}
          <span className="text-xs text-slate-500">
            {isPreviewMode ? 'Preview Mode' : generatedSlide ? 'AI Generated' : 'Click elements to edit'}
          </span>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto p-8 flex items-center justify-center"
        onClick={handleCanvasClick}
      >
        <motion.div
          style={{ scale: zoom / 100 }}
          className="relative bg-slate-950 rounded-lg shadow-2xl overflow-hidden"
          animate={{ scale: zoom / 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Slide container with 16:9 aspect ratio */}
          <div
            className={`w-[960px] h-[540px] relative ${
              !isPreviewMode ? 'slide-editor-mode' : ''
            }`}
          >
            {/* Render generated slide component or fallback to standard renderer */}
            {generatedSlide ? (
              <SandpackSlideRenderer
                componentCode={generatedSlide.componentCode}
                componentName={generatedSlide.componentName}
                data={generatedSlide.data}
              />
            ) : (
              <SlideRenderer
                slide={slide}
                navigationKey={0}
              />
            )}

            {/* Selection overlay for edit mode (only for standard slides) */}
            {!isPreviewMode && !generatedSlide && (
              <SelectionOverlay
                slide={slide}
                selectedElement={selectedElement}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Overlay to highlight selectable elements
function SelectionOverlay({
  slide,
  selectedElement,
}: {
  slide: Slide
  selectedElement: SelectedElement | null
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Title highlight */}
      {slide.content.title && (
        <div
          data-selectable
          data-element-type="title"
          data-element-path="content.title"
          className={`absolute pointer-events-auto cursor-pointer transition-all ${
            selectedElement?.type === 'title'
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded'
              : 'hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 hover:ring-offset-slate-950 rounded'
          }`}
          style={{
            top: slide.type === 'title' ? '35%' : '5%',
            left: '5%',
            right: '5%',
            height: slide.type === 'title' ? '15%' : '10%',
          }}
        />
      )}

      {/* Subtitle highlight */}
      {slide.content.subtitle && (
        <div
          data-selectable
          data-element-type="subtitle"
          data-element-path="content.subtitle"
          className={`absolute pointer-events-auto cursor-pointer transition-all ${
            selectedElement?.type === 'subtitle'
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded'
              : 'hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 hover:ring-offset-slate-950 rounded'
          }`}
          style={{
            top: slide.type === 'title' ? '52%' : '15%',
            left: '10%',
            right: '10%',
            height: '8%',
          }}
        />
      )}

      {/* Bullets highlight */}
      {slide.content.bullets?.map((_, index) => (
        <div
          key={index}
          data-selectable
          data-element-type="bullet"
          data-element-path={`content.bullets[${index}]`}
          data-element-index={index}
          className={`absolute pointer-events-auto cursor-pointer transition-all ${
            selectedElement?.type === 'bullet' && selectedElement?.index === index
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded'
              : 'hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 hover:ring-offset-slate-950 rounded'
          }`}
          style={{
            top: `${25 + index * 12}%`,
            left: '8%',
            right: '8%',
            height: '10%',
          }}
        />
      ))}

      {/* Visualization highlight for interactive slides */}
      {slide.type === 'interactive' && slide.content.visualization && (
        <div
          data-selectable
          data-element-type="visualization"
          data-element-path="content.visualization"
          className={`absolute pointer-events-auto cursor-pointer transition-all ${
            selectedElement?.type === 'visualization'
              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-950 rounded'
              : 'hover:ring-2 hover:ring-purple-500/50 hover:ring-offset-2 hover:ring-offset-slate-950 rounded'
          }`}
          style={{
            top: '15%',
            left: '5%',
            right: '5%',
            bottom: '5%',
          }}
        />
      )}
    </div>
  )
}
