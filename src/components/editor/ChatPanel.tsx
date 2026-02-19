'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/stores/authStore'
import { useEditorStore, type GeneratedSlide } from '@/stores/editorStore'
import type { Slide } from '@/types/demo'

const SandpackSlideRenderer = dynamic(
  () => import('./SandpackSlideRenderer').then((mod) => mod.SandpackSlideRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    ),
  }
)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  image?: string
  generatedSlide?: GeneratedSlide
}

interface ChatPanelProps {
  projectId: string
  slide: Slide
  onSlideGenerated?: (slide: GeneratedSlide) => void
}

type Mode = 'generate' | 'chat'

export function ChatPanel({ projectId, slide, onSlideGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pastedImage, setPastedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('generate')
  const [showPreview, setShowPreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { settings } = useAuthStore()
  const { updateSlideContent, setGeneratedSlide } = useEditorStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            setPastedImage(event.target?.result as string)
            setMode('generate')
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPastedImage(event.target?.result as string)
        setMode('generate')
      }
      reader.readAsDataURL(file)
    }
  }

  async function sendMessage(content: string, image?: string | null) {
    if ((!content.trim() && !image) || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content || 'Generate slide from image',
      timestamp: new Date(),
      image: image || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setPastedImage(null)
    setIsLoading(true)

    try {
      if (mode === 'generate') {
        await generateSlide(userMessage, image)
      } else {
        await chatWithAssistant(userMessage)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  async function generateSlide(userMessage: ChatMessage, image?: string | null) {
    const response = await fetch('/api/slides/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        slideId: slide.id,
        input: {
          type: image ? 'image' : 'text',
          content: image || userMessage.content,
          message: userMessage.content,
        },
        preferences: { style: 'dark', animationLevel: 'moderate' },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate slide')
    }

    const data = await response.json()

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: data.slide.explanation,
      timestamp: new Date(),
      generatedSlide: {
        componentCode: data.slide.componentCode,
        componentName: data.slide.componentName,
        data: data.slide.data,
        dataSchema: data.slide.dataSchema,
        slideType: data.slide.slideType || 'one-animation',
        totalPhases: data.slide.totalPhases || 1,
        explanation: data.slide.explanation,
      },
    }

    setMessages((prev) => [...prev, assistantMessage])
    setShowPreview(assistantMessage.id)

    if (onSlideGenerated) {
      onSlideGenerated(assistantMessage.generatedSlide!)
    }
  }

  async function chatWithAssistant(userMessage: ChatMessage) {
    const response = await fetch(`/api/chat/${projectId}/${slide.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage.content,
        slideContent: slide.content || {},
        slideType: slide.type,
        slideAnimation: slide.animation || {},
        aiProvider: settings.aiProvider,
      }),
    })

    if (!response.ok) throw new Error('Failed to get response')

    const data = await response.json()
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: data.message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  function handleApplySlide(generatedSlide: GeneratedSlide) {
    setGeneratedSlide(slide.id, generatedSlide)
    if (generatedSlide.data) {
      const newContent = { ...slide.content }
      if (generatedSlide.data.title) newContent.title = generatedSlide.data.title as string
      if (generatedSlide.data.subtitle) newContent.subtitle = generatedSlide.data.subtitle as string
      if (generatedSlide.data.bullets) newContent.bullets = generatedSlide.data.bullets as string[]
      updateSlideContent(slide.id, newContent)
    }
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}-success`,
      role: 'assistant',
      content: `Applied "${generatedSlide.componentName}" to slide`,
      timestamp: new Date(),
    }])
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input, pastedImage)
    }
  }

  const quickActions = [
    { icon: '◆', label: 'Title', prompt: 'Create an impactful title slide with gradient text and subtle animation' },
    { icon: '●', label: 'Bullets', prompt: 'Create a slide with animated bullet points that reveal sequentially' },
    { icon: '◧', label: 'Compare', prompt: 'Create a two-column comparison slide showing before vs after' },
    { icon: '◔', label: 'Metrics', prompt: 'Create a metrics dashboard slide with animated counters' },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-white">AI Studio</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'generate'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'chat'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Create Slides with AI</h4>
            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
              Paste an image or describe your slide to generate animated components
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.role === 'user' ? '' : ''}`}>
              {/* Avatar + Message */}
              <div className="flex gap-2">
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                <div className={`rounded-2xl px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-200'
                }`}>
                  {message.image && (
                    <img src={message.image} alt="" className="max-h-24 rounded-lg mb-2" />
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>

              {/* Generated Slide Actions */}
              {message.generatedSlide && (
                <div className="mt-2 ml-8 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(showPreview === message.id ? null : message.id)}
                      className="flex-1 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {showPreview === message.id ? 'Hide' : 'Preview'}
                    </button>
                    <button
                      onClick={() => handleApplySlide(message.generatedSlide!)}
                      className="flex-1 py-2 text-xs font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Apply
                    </button>
                  </div>

                  {showPreview === message.id && (
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                      <div className="h-[400px]">
                        <SandpackSlideRenderer
                          componentCode={message.generatedSlide.componentCode}
                          componentName={message.generatedSlide.componentName}
                          data={message.generatedSlide.data}
                          showEditor={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-slate-800 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {mode === 'generate' && messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt, null)}
                disabled={isLoading}
                className="py-2 px-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-left flex items-center gap-2"
              >
                <span className="text-purple-400">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {pastedImage && (
        <div className="px-4 py-2 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg">
            <img src={pastedImage} alt="" className="h-12 w-12 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Image ready</p>
              <p className="text-[10px] text-slate-500">Press Enter to generate</p>
            </div>
            <button
              onClick={() => setPastedImage(null)}
              className="p-1 hover:bg-slate-700 rounded transition"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={mode === 'generate' ? 'Describe or paste image...' : 'Ask anything...'}
              rows={1}
              className="w-full px-4 py-2.5 bg-slate-800 border-0 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>
          <button
            onClick={() => sendMessage(input, pastedImage)}
            disabled={(!input.trim() && !pastedImage) || isLoading}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-xl transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
