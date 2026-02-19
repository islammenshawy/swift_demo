# SlideForge Coding Agent Architecture

## Overview

This document outlines the architecture for integrating a coding agent (Claude) into SlideForge to generate custom animated slides with React, Framer Motion, and React Three Fiber.

---

## The Challenge

**Current Limitation:** Simple prompt → JSON content → preset animations

**Goal:** Input (image/text/voice) → Coding Agent → Custom React components with rich animations

**Key Requirements:**
1. Generate custom React/TypeScript code
2. Create Framer Motion animations
3. Build React Three Fiber 3D elements
4. Execute generated code safely
5. Fast iteration cycle for users

---

## Architecture Options Evaluated

| Option | Security | Speed | Flexibility | Complexity |
|--------|----------|-------|-------------|------------|
| Server-side compilation | Low | Slow | High | High |
| Client-side eval | Very Low | Fast | High | Medium |
| Template + Config | High | Fast | Medium | Low |
| Sandboxed iframe | High | Medium | High | High |
| Sandpack runtime | High | Fast | High | Medium |

**Recommended: Hybrid approach with Sandpack + Template Library**

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SlideForge Frontend                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Chat Panel  │───▶│ Slide Editor │───▶│  Sandpack Runtime    │  │
│  │  (Input)     │    │  (Preview)   │    │  (Code Execution)    │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                   ▲                       ▲               │
│         │                   │                       │               │
│         ▼                   │                       │               │
│  ┌──────────────────────────┴───────────────────────┘               │
│  │                    WebSocket Connection                          │
│  └──────────────────────────┬───────────────────────                │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         SlideForge Backend                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐    ┌─────────────────┐    ┌──────────────────┐  │
│  │  API Gateway   │───▶│  Agent Router   │───▶│  Code Validator  │  │
│  │  (Next.js)     │    │                 │    │  (AST/ESLint)    │  │
│  └────────────────┘    └────────┬────────┘    └────────┬─────────┘  │
│                                 │                      │             │
│                                 ▼                      │             │
│  ┌──────────────────────────────────────────┐         │             │
│  │           Coding Agent (Claude)          │         │             │
│  │                                          │         │             │
│  │  ┌─────────────────────────────────────┐ │         │             │
│  │  │  System Prompt + Component Library  │ │         │             │
│  │  │  + Animation Patterns + Examples    │ │         │             │
│  │  └─────────────────────────────────────┘ │         │             │
│  │                                          │         │             │
│  │  Input: Image/Text + Slide Context       │◀────────┘             │
│  │  Output: React Component Code            │                       │
│  │                                          │                       │
│  └──────────────────────────────────────────┘                       │
│                                                                      │
│  ┌────────────────┐    ┌─────────────────┐    ┌──────────────────┐  │
│  │  Template DB   │    │  Component      │    │  Asset Storage   │  │
│  │  (MongoDB)     │    │  Registry       │    │  (S3/R2)         │  │
│  └────────────────┘    └─────────────────┘    └──────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Coding Agent (Claude)

**Purpose:** Generate custom React components with animations

**System Prompt Structure:**
```typescript
const CODING_AGENT_PROMPT = `
You are SlideForge's coding agent. You generate React components for presentation slides.

AVAILABLE LIBRARIES:
- React 18
- Framer Motion (motion, AnimatePresence, useAnimation, variants)
- React Three Fiber (@react-three/fiber, @react-three/drei)
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)

COMPONENT STRUCTURE:
- Export a default functional component
- Accept 'data' prop for dynamic content
- Use TypeScript
- Include animation variants
- Be self-contained (no external imports beyond allowed libraries)

ANIMATION PATTERNS:
${ANIMATION_EXAMPLES}

SLIDE TEMPLATES:
${TEMPLATE_EXAMPLES}

OUTPUT FORMAT:
\`\`\`tsx
// SlideForge Generated Component
import { motion } from 'framer-motion'
// ... component code
\`\`\`
`;
```

**Input/Output:**
```typescript
interface AgentInput {
  type: 'image' | 'text' | 'modify'
  content: string | ImageData
  currentSlide?: SlideComponent
  userMessage: string
  slideType?: 'title' | 'content' | 'chart' | 'timeline' | 'custom'
}

interface AgentOutput {
  componentCode: string      // Generated React/TSX code
  componentName: string      // e.g., "ELCTransformationSlide"
  dependencies: string[]     // Required npm packages
  dataSchema: object        // Shape of the data prop
  previewData: object       // Sample data for preview
  explanation: string       // What was generated
}
```

### 2. Code Validator

**Purpose:** Ensure generated code is safe and valid

**Checks:**
```typescript
interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  sanitizedCode?: string
}

const validator = {
  // Security checks
  noEval: true,
  noFetch: true,           // No network calls
  noLocalStorage: true,    // No storage access
  noWindowAccess: true,    // Limited window API

  // Quality checks
  hasDefaultExport: true,
  hasTypeScript: true,
  maxFileSize: 50000,      // 50KB limit

  // Allowed imports
  allowedImports: [
    'react',
    'framer-motion',
    '@react-three/fiber',
    '@react-three/drei',
    'recharts',
    'lucide-react',
  ]
}
```

### 3. Sandpack Runtime (Frontend)

**Purpose:** Safely execute generated React code in the browser

```typescript
import { Sandpack } from '@codesandbox/sandpack-react'

interface SlideRendererProps {
  componentCode: string
  data: object
}

export function SlideRenderer({ componentCode, data }: SlideRendererProps) {
  const files = {
    '/App.tsx': componentCode,
    '/data.json': JSON.stringify(data),
  }

  return (
    <Sandpack
      template="react-ts"
      files={files}
      customSetup={{
        dependencies: {
          'framer-motion': '^10.0.0',
          '@react-three/fiber': '^8.0.0',
          '@react-three/drei': '^9.0.0',
          'recharts': '^2.0.0',
          'lucide-react': '^0.300.0',
        }
      }}
      options={{
        showNavigator: false,
        showTabs: false,
        editorHeight: 0,  // Hide editor, show only preview
      }}
    />
  )
}
```

### 4. Template Library

**Purpose:** Pre-built components for common patterns (fast path)

```typescript
const TEMPLATE_REGISTRY = {
  'title-slide': {
    component: TitleSlideTemplate,
    schema: { title: 'string', subtitle: 'string' },
    animations: ['fadeIn', 'typewriter', 'glitch'],
  },
  'bullet-slide': {
    component: BulletSlideTemplate,
    schema: { title: 'string', bullets: 'string[]' },
    animations: ['staggerFade', 'slideIn', 'bounce'],
  },
  'chart-slide': {
    component: ChartSlideTemplate,
    schema: { title: 'string', data: 'ChartData[]', chartType: 'bar|line|pie' },
    animations: ['drawIn', 'growUp', 'countUp'],
  },
  'timeline-slide': {
    component: TimelineSlideTemplate,
    schema: { title: 'string', events: 'TimelineEvent[]' },
    animations: ['sequential', 'parallel', 'zoom'],
  },
  'comparison-slide': {
    component: ComparisonSlideTemplate,
    schema: { title: 'string', before: 'object', after: 'object' },
    animations: ['splitReveal', 'morphTransform'],
  },
  'flow-diagram': {
    component: FlowDiagramTemplate,
    schema: { nodes: 'Node[]', edges: 'Edge[]' },
    animations: ['pathDraw', 'nodeReveal'],
  },
  '3d-visualization': {
    component: ThreeDTemplate,
    schema: { scene: 'SceneConfig' },
    animations: ['orbit', 'explode', 'morph'],
  },
}
```

---

## API Design

### Generate Slide Endpoint

```typescript
// POST /api/slides/generate
interface GenerateRequest {
  projectId: string
  slideId: string
  input: {
    type: 'image' | 'text' | 'modify'
    content: string  // Base64 image or text
    message: string  // User's instruction
  }
  preferences?: {
    style: 'minimal' | 'corporate' | 'creative'
    animationLevel: 'subtle' | 'moderate' | 'dynamic'
  }
}

interface GenerateResponse {
  success: boolean
  slide: {
    id: string
    componentCode: string
    componentName: string
    data: object
    thumbnail?: string
  }
  usage: {
    tokensUsed: number
    generationTime: number
  }
}
```

### WebSocket for Streaming

```typescript
// Real-time code generation feedback
interface WSMessage {
  type: 'thinking' | 'generating' | 'validating' | 'complete' | 'error'
  payload: {
    progress?: number
    partialCode?: string
    message?: string
    result?: GenerateResponse
  }
}
```

---

## Data Flow

### Flow 1: Image to Slide

```
1. User pastes screenshot
2. Frontend sends to /api/slides/generate
3. Backend:
   a. Extracts content from image (Claude Vision)
   b. Determines best template or custom generation
   c. If template: populate with extracted data
   d. If custom: generate React component
   e. Validate generated code
   f. Return component + data
4. Frontend renders in Sandpack
5. User can edit data or request modifications
```

### Flow 2: Iterative Refinement

```
1. User: "Make the animation more dramatic"
2. Backend:
   a. Loads current component code
   b. Sends to coding agent with modification request
   c. Agent modifies animation variants
   d. Validates new code
   e. Returns updated component
3. Frontend hot-reloads in Sandpack
```

---

## Security Considerations

### Code Sandboxing
- Sandpack runs in iframe with `sandbox` attribute
- No access to parent window
- No network requests from generated code
- Limited DOM API

### Validation Pipeline
```
Generated Code
     │
     ▼
┌─────────────┐
│ AST Parser  │ → Check for forbidden patterns
└─────────────┘
     │
     ▼
┌─────────────┐
│ ESLint      │ → Security rules + code quality
└─────────────┘
     │
     ▼
┌─────────────┐
│ TypeScript  │ → Type checking
└─────────────┘
     │
     ▼
┌─────────────┐
│ Size Check  │ → Max 50KB
└─────────────┘
     │
     ▼
  Approved ✓
```

### Rate Limiting
- Max 10 generations per minute per user
- Max 100 generations per day per user (free tier)
- Queue system for high load

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Sandpack integration
- [ ] Create coding agent prompt
- [ ] Build code validator
- [ ] Basic API endpoint

### Phase 2: Template Library (Week 2-3)
- [ ] Port existing demo slides as templates
- [ ] Create template registry
- [ ] Implement template selection logic
- [ ] Data extraction from images

### Phase 3: Custom Generation (Week 3-4)
- [ ] Full coding agent integration
- [ ] WebSocket streaming
- [ ] Iterative refinement flow
- [ ] Error recovery

### Phase 4: Polish (Week 4-5)
- [ ] Performance optimization
- [ ] Caching layer
- [ ] Usage analytics
- [ ] Rate limiting

---

## Example: Generated Component

**Input:** Screenshot of ELC transformation roadmap

**Generated Output:**
```tsx
// SlideForge Generated: ELCTransformationSlide
import { motion } from 'framer-motion'

interface Props {
  data: {
    title: string
    currentState: { accuracy: number; availability: number }
    targetState: { accuracy: number; availability: number }
    focusAreas: string[]
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ELCTransformationSlide({ data }: Props) {
  return (
    <motion.div
      className="h-full bg-gradient-to-br from-slate-900 to-slate-800 p-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        className="text-4xl font-bold text-white mb-8"
        variants={item}
      >
        {data.title}
      </motion.h1>

      <div className="grid grid-cols-2 gap-8">
        <motion.div variants={item} className="bg-red-500/20 rounded-xl p-6">
          <h3 className="text-red-400 font-semibold mb-4">Current State</h3>
          <MetricBar label="Accuracy" value={data.currentState.accuracy} color="red" />
          <MetricBar label="Availability" value={data.currentState.availability} color="red" />
        </motion.div>

        <motion.div variants={item} className="bg-green-500/20 rounded-xl p-6">
          <h3 className="text-green-400 font-semibold mb-4">Target State</h3>
          <MetricBar label="Accuracy" value={data.targetState.accuracy} color="green" />
          <MetricBar label="Availability" value={data.targetState.availability} color="green" />
        </motion.div>
      </div>

      <motion.div variants={item} className="mt-8">
        <h3 className="text-white font-semibold mb-4">Focus Areas</h3>
        <div className="flex flex-wrap gap-3">
          {data.focusAreas.map((area, i) => (
            <motion.span
              key={i}
              className="px-4 py-2 bg-blue-500/30 rounded-full text-blue-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {area}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={`text-${color}-400`}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
```

---

## Cost Estimation

| Operation | Claude Tokens | Cost (approx) |
|-----------|---------------|---------------|
| Image analysis | ~2000 | $0.02 |
| Code generation | ~4000 | $0.04 |
| Refinement | ~2000 | $0.02 |
| **Per slide (avg)** | ~6000 | **$0.06** |

For a 20-slide presentation: ~$1.20

---

## Next Steps

1. **Approve architecture** - Review and confirm approach
2. **Install Sandpack** - Add to frontend
3. **Create coding agent prompt** - Design system prompt with examples
4. **Build validator** - Implement security checks
5. **Port templates** - Convert existing demos to template format
6. **Integrate** - Wire everything together

---

## Questions to Resolve

1. Should we allow users to edit generated code directly?
2. How to handle 3D content (React Three Fiber) in Sandpack?
3. Caching strategy for generated components?
4. How to handle component versioning?
5. Export format - bundle components or keep as code?
