'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export interface Project {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  createdAt: string | Date
  updatedAt?: string | Date
  slideCount?: number
}

interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const updatedAt = project.updatedAt || project.createdAt
  const timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true })

  return (
    <div className="group relative bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all">
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-700/50 relative">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={`/projects/${project._id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Edit
          </Link>
          <Link
            href={`/demo/${project._id}`}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition"
          >
            Present
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{project.title}</h3>
            {project.description && (
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{project.description}</p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onDelete(project._id)
              }}
              className="p-1.5 text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
              title="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeAgo}
          </span>
          {project.slideCount !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {project.slideCount} slides
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
