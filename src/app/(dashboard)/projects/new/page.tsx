'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a project title')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
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

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/projects"
          className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
        <h1 className="text-2xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-slate-400 mb-8">
          Start with a blank presentation or browse templates
        </p>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Presentation"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your presentation"
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Create Project
                </>
              )}
            </button>

            <Link
              href="/templates"
              className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
            >
              Use Template
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
