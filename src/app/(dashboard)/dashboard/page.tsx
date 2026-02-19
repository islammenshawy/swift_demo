'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ProjectGrid, type Project } from '@/components/dashboard'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects?limit=4')
        if (response.ok) {
          const data = await response.json()
          setRecentProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="p-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-2 text-slate-400">
          Create stunning presentations with AI assistance
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link
          href="/projects/new"
          className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-400 transition group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">New Project</h3>
            <p className="text-sm text-blue-100">Start from scratch</p>
          </div>
        </Link>

        <Link
          href="/templates"
          className="flex items-center gap-4 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition group"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">Use Template</h3>
            <p className="text-sm text-slate-400">Browse gallery</p>
          </div>
        </Link>

        <Link
          href="/projects"
          className="flex items-center gap-4 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-emerald-500/50 transition group"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">All Projects</h3>
            <p className="text-sm text-slate-400">View your work</p>
          </div>
        </Link>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 transition">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            projects={recentProjects}
            emptyMessage="Create your first project to get started"
          />
        )}
      </div>
    </div>
  )
}
