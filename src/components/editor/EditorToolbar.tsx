'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/stores/editorStore'

interface EditorToolbarProps {
  projectTitle: string
  isDirty: boolean
  isSaving: boolean
  onSave: () => void
  isPreviewMode: boolean
}

export function EditorToolbar({
  projectTitle,
  isDirty,
  isSaving,
  onSave,
  isPreviewMode,
}: EditorToolbarProps) {
  const router = useRouter()
  const { setPreviewMode, presentation, projectId } = useEditorStore()

  const handleExport = () => {
    // Open export dialog or navigate to export
    if (projectId) {
      window.open(`/demo/${projectId}?export=true`, '_blank')
    }
  }

  const handlePresent = () => {
    if (projectId) {
      window.open(`/demo/${projectId}`, '_blank')
    }
  }

  return (
    <div className="h-14 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between px-4">
      {/* Left: Back and title */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-white font-medium">{projectTitle}</h1>
          {isDirty && (
            <span className="text-xs text-amber-400">(unsaved)</span>
          )}
        </div>
      </div>

      {/* Center: View controls */}
      <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
        <button
          onClick={() => setPreviewMode(false)}
          className={`px-3 py-1.5 text-sm rounded transition ${
            !isPreviewMode
              ? 'bg-slate-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          className={`px-3 py-1.5 text-sm rounded transition ${
            isPreviewMode
              ? 'bg-slate-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Slide count */}
        <span className="text-xs text-slate-500 mr-2">
          {presentation?.slides.length || 0} slides
        </span>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:text-slate-500 text-white rounded-lg transition"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </>
          )}
        </button>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export
        </button>

        {/* Present button */}
        <button
          onClick={handlePresent}
          className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Present
        </button>
      </div>
    </div>
  )
}
