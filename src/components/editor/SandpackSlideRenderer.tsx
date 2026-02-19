'use client'

import { useState, useMemo } from 'react'
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { nightOwl } from '@codesandbox/sandpack-themes'

interface SandpackSlideRendererProps {
  componentCode: string
  componentName: string
  data: Record<string, unknown>
  showEditor?: boolean
  onCodeChange?: (code: string) => void
  onError?: (error: string) => void
}

// Custom styles as fallback for common Tailwind classes
const customStyles = `
/* Base styles */
body {
  margin: 0;
  padding: 0;
  background: #0f172a;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}
* { box-sizing: border-box; }
#root {
  width: 100%;
  height: 100vh;
  background: #0f172a;
}

/* Fallback colors for Tailwind classes */
.bg-slate-900 { background-color: #0f172a !important; }
.bg-slate-800 { background-color: #1e293b !important; }
.bg-slate-700 { background-color: #334155 !important; }
.bg-slate-800\\/50 { background-color: rgba(30, 41, 59, 0.5) !important; }
.text-white { color: #ffffff !important; }
.text-slate-300 { color: #cbd5e1 !important; }
.text-slate-400 { color: #94a3b8 !important; }
.text-blue-400 { color: #60a5fa !important; }
.text-blue-500 { color: #3b82f6 !important; }
.text-purple-400 { color: #c084fc !important; }
.text-emerald-400 { color: #34d399 !important; }
.text-amber-400 { color: #fbbf24 !important; }
.border-slate-700 { border-color: #334155 !important; }
.from-slate-900 { --tw-gradient-from: #0f172a; }
.via-slate-800 { --tw-gradient-stops: var(--tw-gradient-from), #1e293b, var(--tw-gradient-to); }
.to-slate-900 { --tw-gradient-to: #0f172a; }
.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }

/* Animation utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`

// Custom index.html to ensure Tailwind loads before React
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SlideForge Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body style="margin:0;padding:0;background:#0f172a;">
    <div id="root"></div>
  </body>
</html>`

// Wrapper component for the generated slide
function createAppCode(data: Record<string, unknown>): string {
  return `import './styles.css'
import SlideComponent from './SlideComponent'

const data = ${JSON.stringify(data, null, 2)}

export default function App() {
  return (
    <div className="w-full h-screen bg-slate-900 overflow-hidden" style={{ background: '#0f172a' }}>
      <SlideComponent data={data} />
    </div>
  )
}
`
}

export function SandpackSlideRenderer({
  componentCode,
  componentName,
  data,
  showEditor = false,
  onCodeChange,
  onError,
}: SandpackSlideRendererProps) {
  const [key, setKey] = useState(0)

  // Memoize files to prevent unnecessary re-renders
  const files = useMemo(() => ({
    '/index.html': indexHtml,
    '/styles.css': customStyles,
    '/App.tsx': createAppCode(data),
    '/SlideComponent.tsx': componentCode,
  }), [componentCode, data])

  // Dependencies for the sandbox
  const customSetup = useMemo(() => ({
    dependencies: {
      'framer-motion': '10.16.4',
    },
  }), [])

  return (
    <div className="h-full w-full relative bg-slate-900">
      <SandpackProvider
        key={key}
        template="react-ts"
        theme={nightOwl}
        files={files}
        customSetup={customSetup}
        options={{
          recompileMode: 'delayed',
          recompileDelay: 300,
          autorun: true,
          autoReload: true,
          externalResources: ['https://cdn.tailwindcss.com'],
        }}
      >
        <div className="h-full flex flex-col">
          {/* Preview area */}
          <div className={`flex-1 relative ${showEditor ? 'h-1/2' : 'h-full'}`}>
            <SandpackPreview
              showNavigator={false}
              showRefreshButton={false}
              showOpenInCodeSandbox={false}
              showSandpackErrorOverlay={true}
              style={{ height: '100%' }}
            />
            {/* Replay button */}
            <button
              onClick={() => setKey(k => k + 1)}
              className="absolute top-2 right-2 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded flex items-center gap-1"
              title="Replay animations"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Replay
            </button>
          </div>

          {/* Optional code editor */}
          {showEditor && (
            <div className="h-1/2 border-t border-slate-700">
              <SandpackCodeEditor
                showTabs
                showLineNumbers
                showInlineErrors
                wrapContent
                style={{ height: '100%' }}
              />
            </div>
          )}
        </div>
      </SandpackProvider>
    </div>
  )
}

// Loading placeholder
export function SandpackLoadingPlaceholder() {
  return (
    <div className="h-full w-full bg-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading slide renderer...</p>
      </div>
    </div>
  )
}

export default SandpackSlideRenderer
