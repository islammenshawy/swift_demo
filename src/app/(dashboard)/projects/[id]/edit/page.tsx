'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SlideEditor } from '@/components/editor'
import type { Demo } from '@/types/demo'

interface ProjectData {
  _id: string
  title: string
  description?: string
}

export default function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [presentation, setPresentation] = useState<Demo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Project not found')
          } else {
            setError('Failed to load project')
          }
          return
        }

        const data = await response.json()
        setProject(data.project)

        // Transform presentation data to Demo format
        if (data.presentation) {
          setPresentation({
            id: data.presentation.projectId,
            title: data.project.title,
            description: data.project.description,
            slides: data.presentation.slides,
            theme: data.presentation.theme || 'swift-dark',
            autoPlaySpeed: data.presentation.autoPlaySpeed || 5000,
            createdAt: new Date(data.presentation.createdAt),
            updatedAt: new Date(data.presentation.updatedAt),
          })
        }
      } catch (err) {
        console.error('Error loading project:', err)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [id])

  const handleSave = async (updatedPresentation: Demo) => {
    try {
      const response = await fetch(`/api/presentations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: updatedPresentation.slides,
          theme: updatedPresentation.theme,
          autoPlaySpeed: updatedPresentation.autoPlaySpeed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast.success('Changes saved')
    } catch (err) {
      console.error('Error saving:', err)
      toast.error('Failed to save changes')
      throw err
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project || !presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">{error || 'Something went wrong'}</h2>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <SlideEditor
      projectId={id}
      projectTitle={project.title}
      presentation={presentation}
      onSave={handleSave}
    />
  )
}
