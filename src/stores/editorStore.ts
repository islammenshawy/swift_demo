import { create } from 'zustand'
import type { Slide, SlideContent, SlideAnimation, Demo } from '@/types/demo'

export interface SelectedElement {
  type: 'title' | 'subtitle' | 'text' | 'bullet' | 'image' | 'chart' | 'speaker' | 'timeline-item' | 'visualization'
  path: string
  content: string
  index?: number
  styles?: Record<string, string>
}

// Custom animation code for Framer Motion / React Three Fiber
export interface CustomAnimation {
  id: string
  name: string
  type: 'framer-motion' | 'react-three-fiber' | 'css'
  code: string // Actual animation code
  config?: Record<string, unknown> // Animation configuration
}

// Generated slide from coding agent
export interface GeneratedSlide {
  componentCode: string
  componentName: string
  data: Record<string, unknown>
  dataSchema: Record<string, string>
  slideType: 'one-animation' | 'multi-step'
  totalPhases: number
  explanation: string
}

interface EditorState {
  // Project state
  projectId: string | null
  projectTitle: string
  presentation: Demo | null
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null

  // Editor state
  currentSlideIndex: number
  selectedElement: SelectedElement | null
  isPreviewMode: boolean
  zoom: number

  // Custom animations library
  customAnimations: CustomAnimation[]

  // Generated slides from coding agent (keyed by slideId)
  generatedSlides: Record<string, GeneratedSlide>

  // Actions
  setProject: (projectId: string, title: string, presentation: Demo) => void
  setPresentation: (presentation: Demo) => void
  setCurrentSlide: (index: number) => void
  selectElement: (element: SelectedElement | null) => void
  setPreviewMode: (preview: boolean) => void
  setZoom: (zoom: number) => void

  // Slide operations
  updateSlide: (slideId: string, updates: Partial<Slide>) => void
  updateSlideContent: (slideId: string, content: Partial<SlideContent>) => void
  updateSlideAnimation: (slideId: string, animation: Partial<SlideAnimation>) => void
  addSlide: (slide: Slide, afterIndex?: number) => void
  deleteSlide: (slideId: string) => void
  reorderSlides: (fromIndex: number, toIndex: number) => void
  duplicateSlide: (slideId: string) => void

  // Custom animation operations
  addCustomAnimation: (animation: CustomAnimation) => void
  updateCustomAnimation: (id: string, updates: Partial<CustomAnimation>) => void
  deleteCustomAnimation: (id: string) => void
  applyCustomAnimation: (slideId: string, animationId: string) => void

  // Generated slides operations
  setGeneratedSlide: (slideId: string, generated: GeneratedSlide) => void
  getGeneratedSlide: (slideId: string) => GeneratedSlide | undefined
  clearGeneratedSlide: (slideId: string) => void

  // Persistence
  markDirty: () => void
  markSaved: () => void
  setSaving: (saving: boolean) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  projectId: null,
  projectTitle: '',
  presentation: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,

  currentSlideIndex: 0,
  selectedElement: null,
  isPreviewMode: false,
  zoom: 100,

  customAnimations: [],
  generatedSlides: {},

  // Project actions
  setProject: (projectId, title, presentation) =>
    set({
      projectId,
      projectTitle: title,
      presentation,
      isDirty: false,
      currentSlideIndex: 0,
    }),

  setPresentation: (presentation) =>
    set({ presentation, isDirty: true }),

  setCurrentSlide: (index) =>
    set({ currentSlideIndex: index, selectedElement: null }),

  selectElement: (element) =>
    set({ selectedElement: element }),

  setPreviewMode: (preview) =>
    set({ isPreviewMode: preview }),

  setZoom: (zoom) =>
    set({ zoom: Math.max(25, Math.min(200, zoom)) }),

  // Slide operations
  updateSlide: (slideId, updates) => {
    const { presentation } = get()
    if (!presentation) return

    const newSlides = presentation.slides.map((slide) =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    )

    set({
      presentation: { ...presentation, slides: newSlides },
      isDirty: true,
    })
  },

  updateSlideContent: (slideId, content) => {
    const { presentation } = get()
    if (!presentation) return

    const newSlides = presentation.slides.map((slide) =>
      slide.id === slideId
        ? { ...slide, content: { ...slide.content, ...content } }
        : slide
    )

    set({
      presentation: { ...presentation, slides: newSlides },
      isDirty: true,
    })
  },

  updateSlideAnimation: (slideId, animation) => {
    const { presentation } = get()
    if (!presentation) return

    const newSlides = presentation.slides.map((slide) =>
      slide.id === slideId
        ? { ...slide, animation: { ...slide.animation, ...animation } }
        : slide
    )

    set({
      presentation: { ...presentation, slides: newSlides },
      isDirty: true,
    })
  },

  addSlide: (slide, afterIndex) => {
    const { presentation, currentSlideIndex } = get()
    if (!presentation) return

    const insertIndex = afterIndex ?? currentSlideIndex
    const newSlides = [...presentation.slides]
    newSlides.splice(insertIndex + 1, 0, slide)

    // Update order numbers
    newSlides.forEach((s, i) => {
      s.order = i + 1
    })

    set({
      presentation: { ...presentation, slides: newSlides },
      currentSlideIndex: insertIndex + 1,
      isDirty: true,
    })
  },

  deleteSlide: (slideId) => {
    const { presentation, currentSlideIndex } = get()
    if (!presentation || presentation.slides.length <= 1) return

    const newSlides = presentation.slides.filter((s) => s.id !== slideId)
    newSlides.forEach((s, i) => {
      s.order = i + 1
    })

    const newIndex = Math.min(currentSlideIndex, newSlides.length - 1)

    set({
      presentation: { ...presentation, slides: newSlides },
      currentSlideIndex: newIndex,
      isDirty: true,
    })
  },

  reorderSlides: (fromIndex, toIndex) => {
    const { presentation } = get()
    if (!presentation) return

    const newSlides = [...presentation.slides]
    const [removed] = newSlides.splice(fromIndex, 1)
    newSlides.splice(toIndex, 0, removed)

    newSlides.forEach((s, i) => {
      s.order = i + 1
    })

    set({
      presentation: { ...presentation, slides: newSlides },
      currentSlideIndex: toIndex,
      isDirty: true,
    })
  },

  duplicateSlide: (slideId) => {
    const { presentation, currentSlideIndex } = get()
    if (!presentation) return

    const slideIndex = presentation.slides.findIndex((s) => s.id === slideId)
    if (slideIndex === -1) return

    const originalSlide = presentation.slides[slideIndex]
    const newSlide: Slide = {
      ...JSON.parse(JSON.stringify(originalSlide)),
      id: `slide-${Date.now()}`,
    }

    const { addSlide } = get()
    addSlide(newSlide, slideIndex)
  },

  // Custom animation operations
  addCustomAnimation: (animation) => {
    set((state) => ({
      customAnimations: [...state.customAnimations, animation],
    }))
  },

  updateCustomAnimation: (id, updates) => {
    set((state) => ({
      customAnimations: state.customAnimations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }))
  },

  deleteCustomAnimation: (id) => {
    set((state) => ({
      customAnimations: state.customAnimations.filter((a) => a.id !== id),
    }))
  },

  applyCustomAnimation: (slideId, animationId) => {
    const { customAnimations, updateSlideAnimation } = get()
    const animation = customAnimations.find((a) => a.id === animationId)
    if (!animation) return

    updateSlideAnimation(slideId, {
      type: 'custom',
      customAnimationId: animationId,
      customCode: animation.code,
      customConfig: animation.config,
    } as Partial<SlideAnimation>)
  },

  // Generated slides operations
  setGeneratedSlide: (slideId, generated) => {
    set((state) => ({
      generatedSlides: {
        ...state.generatedSlides,
        [slideId]: generated,
      },
      isDirty: true,
    }))
  },

  getGeneratedSlide: (slideId) => {
    return get().generatedSlides[slideId]
  },

  clearGeneratedSlide: (slideId) => {
    set((state) => {
      const { [slideId]: _, ...rest } = state.generatedSlides
      return { generatedSlides: rest }
    })
  },

  // Persistence
  markDirty: () => set({ isDirty: true }),
  markSaved: () => set({ isDirty: false, lastSaved: new Date() }),
  setSaving: (saving) => set({ isSaving: saving }),
}))
