'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  featured: boolean
  usageCount: number
  slideCount: number
}

const CATEGORIES = ['All', 'Business', 'Education', 'Product', 'Innovation', 'Basic']

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isCreating, setIsCreating] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const params = selectedCategory !== 'All' ? `?category=${selectedCategory.toLowerCase()}` : ''
        const response = await fetch(`/api/templates${params}`)
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || [])
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Failed to load templates')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTemplates()
  }, [selectedCategory])

  const handleUseTemplate = async (templateId: string, templateName: string) => {
    setIsCreating(templateId)
    try {
      // First, get template data
      const templateResponse = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (!templateResponse.ok) {
        throw new Error('Failed to fetch template')
      }

      const { template } = await templateResponse.json()

      // Create project from template
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${templateName} Copy`,
          description: template.description,
          templateId,
        }),
      })

      if (!projectResponse.ok) {
        throw new Error('Failed to create project')
      }

      const { project } = await projectResponse.json()
      toast.success('Project created from template!')
      router.push(`/projects/${project._id}/edit`)
    } catch (error) {
      console.error('Error creating from template:', error)
      toast.error('Failed to create project')
    } finally {
      setIsCreating(null)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Template Gallery</h1>
        <p className="mt-2 text-slate-400">
          Choose a template to get started quickly
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl animate-pulse">
              <div className="aspect-video bg-slate-700/50" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-700/50 rounded w-3/4" />
                <div className="h-4 bg-slate-700/50 rounded w-full" />
                <div className="h-4 bg-slate-700/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400">No templates found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all"
            >
              {/* Featured badge */}
              {template.featured && (
                <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded">
                  Featured
                </div>
              )}

              {/* Thumbnail */}
              <div className="aspect-video bg-slate-700/50 relative">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleUseTemplate(template.id, template.name)}
                    disabled={isCreating === template.id}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition flex items-center gap-2"
                  >
                    {isCreating === template.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Use Template
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">{template.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="px-2 py-1 bg-slate-700/50 rounded">{template.category}</span>
                  <span>{template.slideCount} slides</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {template.usageCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
