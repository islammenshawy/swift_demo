import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Types
export interface GenerateSlideInput {
  type: 'image' | 'text' | 'modify'
  content: string // Base64 image or text content
  userMessage: string
  currentSlide?: {
    componentCode?: string
    data?: Record<string, unknown>
  }
  preferences?: {
    style: 'minimal' | 'corporate' | 'creative' | 'dark'
    animationLevel: 'subtle' | 'moderate' | 'dynamic'
  }
}

export interface GenerateSlideOutput {
  success: boolean
  componentCode: string
  componentName: string
  data: Record<string, unknown>
  dataSchema: Record<string, string>
  slideType: 'one-animation' | 'multi-step'
  totalPhases: number
  explanation: string
  error?: string
}

// Advanced animation patterns - PHASE-BASED SEQUENTIAL REVEALS
const ANIMATION_EXAMPLES = `
## CRITICAL: Phase-Based Animation Pattern
The most important pattern for professional slides. Use useState + useEffect to create sequential reveals:

\`\`\`tsx
const [animPhase, setAnimPhase] = useState(0);

useEffect(() => {
  const timers = [
    setTimeout(() => setAnimPhase(1), 400),
    setTimeout(() => setAnimPhase(2), 800),
    setTimeout(() => setAnimPhase(3), 1200),
    setTimeout(() => setAnimPhase(4), 1600),
    setTimeout(() => setAnimPhase(5), 2000),
  ];
  return () => timers.forEach(clearTimeout);
}, []);

// Then use in components:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: animPhase >= 1 ? 1 : 0, y: animPhase >= 1 ? 0 : 20 }}
  transition={{ duration: 0.4 }}
>
  Content appears in phase 1
</motion.div>
\`\`\`

## Staggered Children Pattern
\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
\`\`\`

## SVG Path Drawing
\`\`\`tsx
<motion.path
  d="M 10 50 L 100 50"
  stroke="#9333ea"
  strokeWidth="2"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: animPhase >= 2 ? 1 : 0 }}
  transition={{ duration: 0.8 }}
/>
\`\`\`

## 3D Block Component (CSS)
\`\`\`tsx
const Block3D = ({ children, visible }: { children: React.ReactNode; visible: boolean }) => (
  <div
    className="transition-all duration-400 ease-out"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
    }}
  >
    <div className="relative" style={{ perspective: '1000px' }}>
      {/* Top face */}
      <div className="absolute -top-3 left-2 right-2 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-t"
           style={{ transform: 'perspective(500px) rotateX(45deg)', transformOrigin: 'bottom' }}/>
      {/* Front face */}
      <div className="relative bg-gradient-to-b from-purple-500 to-purple-700 rounded-lg px-4 py-3 shadow-xl">
        {children}
      </div>
      {/* Right face */}
      <div className="absolute -right-2 top-2 bottom-1 w-3 bg-purple-800 rounded-r"
           style={{ transform: 'perspective(500px) rotateY(-45deg)', transformOrigin: 'left' }}/>
    </div>
  </div>
);
\`\`\`

## Animated Arrow Component
\`\`\`tsx
const Arrow = ({ delay, direction = 'down' }: { delay: number; direction?: 'down' | 'right' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: animPhase >= delay ? 1 : 0, scale: animPhase >= delay ? 1 : 0 }}
    transition={{ duration: 0.3, type: 'spring' }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24">
      {direction === 'down' ? (
        <path d="M12 4 L12 16 M7 12 L12 18 L17 12" stroke="#9333ea" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M4 12 L16 12 M12 7 L18 12 L12 17" stroke="#9333ea" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      )}
    </svg>
  </motion.div>
);
\`\`\`

## Pulsing Indicator
\`\`\`tsx
<motion.div
  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="w-3 h-3 rounded-full bg-emerald-500"
/>
\`\`\`

## Counter Animation
\`\`\`tsx
const [count, setCount] = useState(0);
const targetValue = 85;

useEffect(() => {
  if (animPhase >= 2) {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= targetValue) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }
}, [animPhase]);
\`\`\`
`

// Component templates for reference - PROFESSIONAL GRADE
const COMPONENT_TEMPLATES = `
## ARCHITECTURE COMPARISON SLIDE
Two-column layout comparing current vs proposed:
- Left side: Red/orange tones for legacy (TENET APPROACH label)
- Right side: Purple/blue tones for new (REIMAGINE APPROACH label)
- Use 3D blocks for tech stack layers
- Animated arrows showing data flow
- Phase-based reveals (5-6 phases)
- Include tech logos as SVGs (React, Java, Oracle, etc.)

## TRANSFORMATION METRICS SLIDE
Grid of metric cards with:
- Large animated numbers (count up effect)
- Progress bars that fill on reveal
- Before/After comparisons
- Color-coded status indicators (red → green)
- Icons for each metric category

## ROADMAP/TIMELINE SLIDE
Horizontal or vertical timeline:
- Connected nodes with animated path
- Phase labels (Q1, Q2, Phase 1, etc.)
- Milestone cards that appear sequentially
- Status indicators (complete/in-progress/planned)
- Connecting lines that draw in

## FLOW DIAGRAM SLIDE
Process flow visualization:
- Boxes/nodes for each step
- Animated connecting arrows
- Data flow indicators
- Technology badges on nodes
- Highlight active step

## COMPARISON TABLE SLIDE
Side-by-side feature comparison:
- Two columns with headers
- Row-by-row reveal
- Check/cross icons for features
- Highlight key differences
- Summary row at bottom

## VALUE PROPOSITION SLIDE
Key benefits layout:
- Large title with gradient text
- 3-4 benefit cards in grid
- Icon + title + description per card
- Staggered reveal animation
- Optional metrics/stats
`

// System prompt for the coding agent
const CODING_AGENT_SYSTEM_PROMPT = `You are SlideForge's coding agent. You generate PREMIUM, PRESENTATION-GRADE React components with sophisticated animations.

## YOUR ROLE
Generate complete, self-contained React components that create STUNNING animated slides. Your output should match the quality of professional keynote presentations with smooth, sequential animations.

## AVAILABLE LIBRARIES (use these imports exactly)
\`\`\`tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
\`\`\`

## TWO TYPES OF SLIDES

### TYPE 1: ONE-ANIMATION SLIDE (Default)
All content animates in automatically on load. Best for: architecture diagrams, comparisons, metrics displays.

\`\`\`tsx
// Auto-playing sequential reveals
const [animPhase, setAnimPhase] = useState(0);

useEffect(() => {
  const timers = [
    setTimeout(() => setAnimPhase(1), 400),
    setTimeout(() => setAnimPhase(2), 800),
    setTimeout(() => setAnimPhase(3), 1200),
    setTimeout(() => setAnimPhase(4), 1600),
    setTimeout(() => setAnimPhase(5), 2000),
  ];
  return () => timers.forEach(clearTimeout);
}, []);

// Animate based on phase
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{
    opacity: animPhase >= 1 ? 1 : 0,
    y: animPhase >= 1 ? 0 : 20
  }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
\`\`\`

### TYPE 2: MULTI-STEP SLIDE (Interactive)
User navigates between content sections with arrow keys. Best for: lists of problems, feature deep-dives, step-by-step processes.

\`\`\`tsx
interface Props {
  data: {...};
  forcePhase?: number;  // Controlled from outside
  onPhaseChange?: (phase: number) => void;
}

export default function MultiStepSlide({ data, forcePhase, onPhaseChange }: Props) {
  const [internalPhase, setInternalPhase] = useState(0);
  const currentPhase = forcePhase !== undefined ? forcePhase : internalPhase;
  const totalPhases = data.items.length;

  // Keyboard navigation (only when not externally controlled)
  useEffect(() => {
    if (forcePhase !== undefined) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setInternalPhase(p => Math.min(p + 1, totalPhases - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setInternalPhase(p => Math.max(p - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPhases, forcePhase]);

  // Entry animations
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimPhase(1), 300),
      setTimeout(() => setAnimPhase(2), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full w-full">
      {/* Left: Navigation dots or list */}
      {data.items.map((item, i) => (
        <div
          key={i}
          onClick={() => onPhaseChange ? onPhaseChange(i) : setInternalPhase(i)}
          className={currentPhase === i ? 'active' : ''}
        >
          {item.title}
        </div>
      ))}
      {/* Right: Detail view for currentPhase */}
      <AnimatePresence mode="wait">
        <motion.div key={currentPhase}>
          {data.items[currentPhase].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
\`\`\`
\`\`\`

## STYLING REQUIREMENTS
- Use Tailwind CSS classes
- ALWAYS use dark background: bg-slate-900 or bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
- Use inline style={{ background: '#0f172a' }} as fallback
- Professional color palette:
  - Purple/violet for primary accents (#9333ea, #7c3aed)
  - Blue/cyan for secondary (#3b82f6, #06b6d4)
  - Emerald for success/positive (#10b981)
  - Red/orange for legacy/warnings (#ef4444, #f97316)
  - White/slate for text (#ffffff, #cbd5e1, #94a3b8)

## ADVANCED PATTERNS
${ANIMATION_EXAMPLES}

## VISUALIZATION TEMPLATES
${COMPONENT_TEMPLATES}

## OUTPUT REQUIREMENTS

1. **Component Structure**
   - Default export a functional component
   - Accept a single \`data\` prop with typed interface
   - Component MUST be self-contained
   - Use TypeScript with proper interfaces

2. **Animation Requirements (CRITICAL)**
   - MUST use phase-based sequential reveals (useState + useEffect with timers)
   - Use 5-7 animation phases for complex slides
   - Each major element should appear in its own phase
   - Use motion.div with conditional animate based on animPhase
   - Include smooth transitions (duration: 0.4, ease: "easeOut")
   - Add visual interest: gradients, shadows, 3D-like elements

3. **Visual Quality**
   - Use SVG icons and graphics where appropriate
   - Include gradient text for titles: bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent
   - Add subtle borders: border border-purple-500/30
   - Use backdrop blur: backdrop-blur
   - Create depth with shadows: shadow-xl, shadow-2xl

4. **Layout**
   - Component fills container: h-full w-full
   - Use flex/grid for layouts
   - Proper padding: p-8 or p-12
   - Maximum width constraints where needed

## OUTPUT FORMAT

You must respond with ONLY a JSON object (no markdown, no explanation outside JSON):

\`\`\`json
{
  "componentName": "DescriptiveSlideNameSlide",
  "componentCode": "// Full TSX code here as a string",
  "data": { /* Sample data matching the component's expected props */ },
  "dataSchema": { /* Field descriptions */ },
  "slideType": "one-animation" | "multi-step",
  "totalPhases": 1,  // For multi-step slides, number of navigable phases
  "explanation": "Brief description of what was generated"
}
\`\`\`

- Use **"one-animation"** for slides that animate in once (architecture, metrics, comparisons)
- Use **"multi-step"** for slides with navigable content sections (problem lists, feature details)
- For one-animation, totalPhases is always 1
- For multi-step, totalPhases is the number of phases the user can navigate through

## EXAMPLE OUTPUT

For an input image showing an architecture comparison:

{
  "componentName": "ArchitectureComparisonSlide",
  "componentCode": "import { motion } from 'framer-motion'\\nimport { useState, useEffect } from 'react'\\n\\ninterface Props {\\n  data: {\\n    title: string\\n    leftApproach: { name: string; color: string; layers: string[] }\\n    rightApproach: { name: string; color: string; layers: string[] }\\n  }\\n}\\n\\nexport default function ArchitectureComparisonSlide({ data }: Props) {\\n  const [animPhase, setAnimPhase] = useState(0);\\n\\n  useEffect(() => {\\n    const timers = [\\n      setTimeout(() => setAnimPhase(1), 400),\\n      setTimeout(() => setAnimPhase(2), 800),\\n      setTimeout(() => setAnimPhase(3), 1200),\\n      setTimeout(() => setAnimPhase(4), 1600),\\n      setTimeout(() => setAnimPhase(5), 2000),\\n    ];\\n    return () => timers.forEach(clearTimeout);\\n  }, []);\\n\\n  return (\\n    <div className=\\"h-full w-full p-8 flex flex-col\\" style={{ background: '#0f172a' }}>\\n      {/* Title */}\\n      <motion.div\\n        initial={{ opacity: 0, y: -20 }}\\n        animate={{ opacity: 1, y: 0 }}\\n        className=\\"text-center mb-8\\"\\n      >\\n        <h1 className=\\"text-4xl font-bold text-white\\">{data.title}</h1>\\n      </motion.div>\\n\\n      {/* Two columns */}\\n      <div className=\\"flex-1 flex gap-8\\">\\n        {/* Left approach */}\\n        <div className=\\"flex-1 flex flex-col items-center\\">\\n          <motion.div\\n            initial={{ opacity: 0 }}\\n            animate={{ opacity: animPhase >= 1 ? 1 : 0 }}\\n            className=\\"mb-4\\"\\n          >\\n            <span className=\\"text-xl font-bold text-red-400 uppercase tracking-wider\\">{data.leftApproach.name}</span>\\n            <div className=\\"h-0.5 mt-1 bg-gradient-to-r from-transparent via-red-500 to-transparent\\"/>\\n          </motion.div>\\n          <div className=\\"space-y-4 w-full max-w-xs\\">\\n            {data.leftApproach.layers.map((layer, i) => (\\n              <motion.div\\n                key={i}\\n                initial={{ opacity: 0, x: -30 }}\\n                animate={{\\n                  opacity: animPhase >= i + 2 ? 1 : 0,\\n                  x: animPhase >= i + 2 ? 0 : -30\\n                }}\\n                transition={{ duration: 0.4 }}\\n                className=\\"bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-500/40 rounded-xl p-4 text-center\\"\\n              >\\n                <span className=\\"text-white font-semibold\\">{layer}</span>\\n              </motion.div>\\n            ))}\\n          </div>\\n        </div>\\n\\n        {/* Right approach */}\\n        <div className=\\"flex-1 flex flex-col items-center\\">\\n          <motion.div\\n            initial={{ opacity: 0 }}\\n            animate={{ opacity: animPhase >= 1 ? 1 : 0 }}\\n            className=\\"mb-4\\"\\n          >\\n            <span className=\\"text-xl font-bold text-purple-400 uppercase tracking-wider\\">{data.rightApproach.name}</span>\\n            <div className=\\"h-0.5 mt-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent\\"/>\\n          </motion.div>\\n          <div className=\\"space-y-4 w-full max-w-xs\\">\\n            {data.rightApproach.layers.map((layer, i) => (\\n              <motion.div\\n                key={i}\\n                initial={{ opacity: 0, x: 30 }}\\n                animate={{\\n                  opacity: animPhase >= i + 2 ? 1 : 0,\\n                  x: animPhase >= i + 2 ? 0 : 30\\n                }}\\n                transition={{ duration: 0.4 }}\\n                className=\\"bg-gradient-to-r from-purple-900/50 to-purple-800/30 border border-purple-500/40 rounded-xl p-4 text-center\\"\\n              >\\n                <span className=\\"text-white font-semibold\\">{layer}</span>\\n              </motion.div>\\n            ))}\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n  )\\n}",
  "data": {
    "title": "Current Architecture / Proposed",
    "leftApproach": {
      "name": "Legacy Approach",
      "color": "red",
      "layers": ["UI Layer", "API Gateway", "Business Logic", "Database"]
    },
    "rightApproach": {
      "name": "Modern Approach",
      "color": "purple",
      "layers": ["React UI", "GraphQL API", "Microservices", "Cloud Native DB"]
    }
  },
  "dataSchema": {
    "title": "Main slide title",
    "leftApproach": "Object with name, color, and layers array for left side",
    "rightApproach": "Object with name, color, and layers array for right side"
  },
  "explanation": "Generated a two-column architecture comparison with phase-based sequential reveals for each layer"
}

## IMPORTANT RULES
1. NEVER include markdown formatting in your response - output ONLY valid JSON
2. The componentCode must be a valid string (escape quotes, newlines, etc.)
3. Always include realistic sample data that matches the component's Props interface exactly
4. Make animations smooth and professional
5. Extract key information from images - don't just describe them
6. For modification requests, preserve existing structure and enhance specific aspects

## CODE QUALITY REQUIREMENTS (CRITICAL)
1. **Always use explicit heights** - never rely on flex-grow alone, use min-h-full or explicit h-[value]
2. **Keep layouts simple** - prefer simple flex column/row over complex nested grids
3. **Test data must match Props** - ensure sample data exactly matches the TypeScript interface
4. **Avoid optional chaining in JSX** - check data exists before mapping
5. **Use safe array access** - always check array length before accessing elements
6. **Limit animation phases to 5** - don't create animations that take too long
7. **Use overflow-auto on scrollable content** - prevent content from being cut off
8. **Always wrap content in a div with h-full w-full** - ensure component fills container

## EXAMPLE SAFE PATTERN
\`\`\`tsx
export default function SafeSlide({ data }: Props) {
  // Safe defaults
  const title = data?.title || 'Untitled';
  const items = data?.items || [];

  // Phase animation
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimPhase(1), 400),
      setTimeout(() => setAnimPhase(2), 800),
      setTimeout(() => setAnimPhase(3), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full w-full min-h-[400px] p-8 overflow-auto" style={{ background: '#0f172a' }}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {title}
      </motion.h1>
      {items.length > 0 && items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }}>
          {item}
        </motion.div>
      ))}
    </div>
  );
}
\`\`\``

// Main function to generate slide component
export async function generateSlideComponent(
  input: GenerateSlideInput
): Promise<GenerateSlideOutput> {
  if (!anthropic) {
    throw new Error('Anthropic client not initialized - check ANTHROPIC_API_KEY')
  }

  // Build the user message based on input type
  let userPrompt = ''
  const messageContent: Anthropic.MessageParam['content'] = []

  if (input.type === 'image') {
    // Extract base64 data and media type
    const match = input.content.match(/^data:([^;]+);base64,(.+)$/)
    if (match) {
      const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      const base64Data = match[2]

      messageContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      })
    }
    userPrompt = `Generate a React slide component from this image. Extract all key information, text, data points, and structure. ${input.userMessage || 'Create an engaging animated slide.'}`
  } else if (input.type === 'text') {
    userPrompt = `Generate a React slide component from this content:\n\n${input.content}\n\n${input.userMessage || 'Create an engaging animated slide.'}`
  } else if (input.type === 'modify' && input.currentSlide?.componentCode) {
    userPrompt = `Modify this existing slide component:\n\n\`\`\`tsx\n${input.currentSlide.componentCode}\n\`\`\`\n\nCurrent data: ${JSON.stringify(input.currentSlide.data)}\n\nModification request: ${input.userMessage}`
  } else {
    userPrompt = input.userMessage
  }

  // Add style preferences
  if (input.preferences) {
    userPrompt += `\n\nStyle preferences:\n- Visual style: ${input.preferences.style}\n- Animation level: ${input.preferences.animationLevel}`
  }

  messageContent.push({ type: 'text', text: userPrompt })

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: CODING_AGENT_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: messageContent,
        },
      ],
    })

    // Check if response was truncated
    if (response.stop_reason === 'max_tokens') {
      console.error('[Coding Agent] WARNING: Response was truncated due to max_tokens limit')
    }

    // Extract the text response
    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Parse the JSON response
    let parsed: {
      componentName: string
      componentCode: string
      data: Record<string, unknown>
      dataSchema: Record<string, string>
      slideType?: 'one-animation' | 'multi-step'
      totalPhases?: number
      explanation: string
    }

    try {
      // Try to extract JSON from the response (handle potential markdown wrapping)
      let jsonStr = textContent.text.trim()

      // Remove markdown code blocks if present
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      parsed = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', textContent.text)
      throw new Error('Failed to parse component from Claude response')
    }

    return {
      success: true,
      componentCode: parsed.componentCode,
      componentName: parsed.componentName,
      data: parsed.data,
      dataSchema: parsed.dataSchema,
      slideType: parsed.slideType || 'one-animation',
      totalPhases: parsed.totalPhases || 1,
      explanation: parsed.explanation,
    }
  } catch (error) {
    console.error('Coding agent error:', error)
    return {
      success: false,
      componentCode: '',
      componentName: '',
      data: {},
      dataSchema: {},
      slideType: 'one-animation',
      totalPhases: 1,
      explanation: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Helper to modify an existing component
export async function modifySlideComponent(
  componentCode: string,
  data: Record<string, unknown>,
  modificationRequest: string
): Promise<GenerateSlideOutput> {
  return generateSlideComponent({
    type: 'modify',
    content: '',
    userMessage: modificationRequest,
    currentSlide: { componentCode, data },
  })
}
