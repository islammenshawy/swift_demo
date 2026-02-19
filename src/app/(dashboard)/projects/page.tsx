'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ProjectGrid, SearchBar, type Project } from '@/components/dashboard'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [search])

  async function fetchProjects() {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const response = await fetch(`/api/projects${params}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateProject() {
    setIsCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Presentation',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const { project } = await response.json()
      toast.success('Project created!')
      router.push(`/projects/${project._id}/edit`)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(projects.filter(p => p._id !== id))
      toast.success('Project deleted')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-2 text-slate-400">
            Manage your presentations
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />
      </div>

      {/* Projects grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl animate-pulse">
              <div className="aspect-video bg-slate-700/50" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                <div className="h-3 bg-slate-700/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          onDelete={handleDeleteProject}
          emptyMessage={search ? 'No projects match your search' : 'Create your first project to get started'}
        />
      )}
    </div>
  )
}
