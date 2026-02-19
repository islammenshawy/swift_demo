import OpenAI, { AzureOpenAI } from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type { Slide, SlideContent, SlideAnimation } from '@/types/demo'

export type AIProvider = 'openai' | 'anthropic'

// Check if Azure OpenAI is configured
const isAzureOpenAI = process.env.AZURE_OPENAI_ENABLED === 'true' && process.env.AZURE_OPENAI_API_KEY

// Initialize clients
const openai = isAzureOpenAI
  ? new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
    })
  : process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

// Azure deployment name for model selection
const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Element selection context for user highlighting
export interface SelectedElement {
  type: 'title' | 'subtitle' | 'text' | 'bullet' | 'image' | 'chart' | 'speaker' | 'timeline-item'
  path: string // CSS selector or path to element
  content: string // Current content of the element
  index?: number // For arrays like bullets
  styles?: Record<string, string> // Current styles
}

// Chat context for AI
export interface ChatContext {
  slideId: string
  slideType: string
  slideContent: SlideContent | Record<string, unknown>
  slideAnimation: SlideAnimation | Record<string, unknown>
  selectedElement?: SelectedElement
  projectContext?: string // Description of the overall project
  conversationHistory: ChatMessage[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    selectedElement?: SelectedElement
    suggestedChanges?: SlideChange[]
  }
}

export interface SlideChange {
  type: 'content' | 'animation' | 'style' | 'layout'
  field: string
  oldValue: unknown
  newValue: unknown
  description: string
}

// Animation presets for non-tech users
export const ANIMATION_PRESETS = {
  'none': { type: 'none', duration: 0, delay: 0 },
  'fade-in': { type: 'fadeIn', duration: 500, delay: 0 },
  'slide-left': { type: 'slideLeft', duration: 600, delay: 0 },
  'slide-right': { type: 'slideRight', duration: 600, delay: 0 },
  'slide-up': { type: 'slideUp', duration: 600, delay: 0 },
  'scale': { type: 'scale', duration: 500, delay: 0 },
  'blur': { type: 'blur', duration: 400, delay: 0 },
  'bounce': { type: 'scale', duration: 600, delay: 0, easing: 'spring' },
} as const

// System prompt for slide generation
const SYSTEM_PROMPT = `You are SlideForge AI - a slide content generator that creates animated presentation slides from any input (images, text, documents).

YOUR PRIMARY TASK: Generate ready-to-use slide content, NOT recommendations or suggestions.

When given an image or content:
1. EXTRACT the key information, data points, and structure
2. GENERATE a complete slide with title, content, and animations
3. OUTPUT the slide content as JSON that can be directly applied

RESPONSE FORMAT - Always respond with a brief description followed by the generated content in this exact JSON structure:

\`\`\`json
{
  "changes": [
    {
      "type": "content",
      "field": "title",
      "oldValue": "",
      "newValue": "Your Generated Title Here",
      "description": "Set slide title"
    },
    {
      "type": "content",
      "field": "subtitle",
      "oldValue": "",
      "newValue": "Optional subtitle",
      "description": "Set subtitle"
    },
    {
      "type": "content",
      "field": "bullets",
      "oldValue": [],
      "newValue": ["Bullet 1", "Bullet 2", "Bullet 3"],
      "description": "Set bullet points"
    },
    {
      "type": "animation",
      "field": "type",
      "oldValue": "none",
      "newValue": "fadeIn",
      "description": "Set animation"
    }
  ]
}
\`\`\`

CONTENT EXTRACTION RULES:
- From images: Extract text, data, key points, metrics, and structure
- Condense verbose content into concise bullet points (max 6-8 words each)
- Identify the main topic for the title
- Pick relevant subtitle if applicable
- Choose appropriate animation based on content type

ANIMATION OPTIONS: none, fadeIn, slideLeft, slideRight, slideUp, scale, blur

BE DIRECT: Generate the content immediately. Do not ask clarifying questions or give tutorials.`

// Generate AI response
export async function generateAIResponse(
  provider: AIProvider,
  context: ChatContext,
  userMessage: string,
  image?: string // Base64 image data URL
): Promise<{ content: string; suggestedChanges?: SlideChange[] }> {
  const contextPrompt = buildContextPrompt(context)
  const fullPrompt = `${contextPrompt}\n\nUser message: ${userMessage}`

  if (provider === 'openai' && openai) {
    return generateOpenAIResponse(fullPrompt, context.conversationHistory, image)
  } else if (provider === 'anthropic' && anthropic) {
    return generateAnthropicResponse(fullPrompt, context.conversationHistory, image)
  }

  throw new Error(`AI provider ${provider} is not configured`)
}

async function generateOpenAIResponse(
  prompt: string,
  history: ChatMessage[],
  image?: string
): Promise<{ content: string; suggestedChanges?: SlideChange[] }> {
  if (!openai) throw new Error('OpenAI client not initialized')

  // Build message content - if image provided, use vision model format
  let userContent: OpenAI.Chat.ChatCompletionContentPart[] | string = prompt

  if (image) {
    userContent = [
      { type: 'text', text: prompt },
      {
        type: 'image_url',
        image_url: {
          url: image, // Base64 data URL like "data:image/png;base64,..."
          detail: 'high',
        },
      },
    ]
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userContent },
  ]

  // Use Azure deployment name if configured, otherwise standard OpenAI models
  const model = isAzureOpenAI
    ? azureDeployment
    : (image ? 'gpt-4o' : 'gpt-4-turbo-preview')

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content || ''
  const suggestedChanges = extractChangesFromResponse(content)

  return { content, suggestedChanges }
}

async function generateAnthropicResponse(
  prompt: string,
  history: ChatMessage[],
  image?: string
): Promise<{ content: string; suggestedChanges?: SlideChange[] }> {
  if (!anthropic) throw new Error('Anthropic client not initialized')

  const messages: Anthropic.MessageParam[] = history.slice(-10).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Build user message content - if image provided, use vision format
  if (image) {
    // Extract base64 data and media type from data URL
    const match = image.match(/^data:([^;]+);base64,(.+)$/)
    if (match) {
      const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      const base64Data = match[2]

      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      })
    } else {
      // Fallback to text-only if image format is invalid
      messages.push({ role: 'user', content: prompt })
    }
  } else {
    messages.push({ role: 'user', content: prompt })
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages,
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  const suggestedChanges = extractChangesFromResponse(content)

  return { content, suggestedChanges }
}

function buildContextPrompt(context: ChatContext): string {
  const content = context.slideContent as Record<string, unknown>
  let prompt = `Current slide information:
- Slide ID: ${context.slideId}
- Slide Type: ${context.slideType}
- Current Animation: ${JSON.stringify(context.slideAnimation)}
`

  if (content.title) {
    prompt += `- Title: "${content.title}"\n`
  }
  if (content.subtitle) {
    prompt += `- Subtitle: "${content.subtitle}"\n`
  }
  if (content.text) {
    prompt += `- Text: "${content.text}"\n`
  }
  if (Array.isArray(content.bullets) && content.bullets.length) {
    prompt += `- Bullets: ${JSON.stringify(content.bullets)}\n`
  }

  if (context.selectedElement) {
    prompt += `\nUser has selected this element:
- Element Type: ${context.selectedElement.type}
- Current Content: "${context.selectedElement.content}"
- Element Path: ${context.selectedElement.path}
`
    if (context.selectedElement.index !== undefined) {
      prompt += `- Index in list: ${context.selectedElement.index}\n`
    }
  }

  if (context.projectContext) {
    prompt += `\nProject Context: ${context.projectContext}\n`
  }

  return prompt
}

function extractChangesFromResponse(content: string): SlideChange[] | undefined {
  // Try to extract JSON changes from the response
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1])
      if (Array.isArray(parsed.changes)) {
        return parsed.changes
      }
    } catch {
      // Not valid JSON, return undefined
    }
  }
  return undefined
}

// Apply changes to a slide
export function applyChangesToSlide(
  slide: Slide,
  changes: SlideChange[]
): Slide {
  const newSlide = { ...slide, content: { ...slide.content }, animation: { ...slide.animation } }

  for (const change of changes) {
    switch (change.type) {
      case 'content':
        if (change.field in newSlide.content) {
          (newSlide.content as Record<string, unknown>)[change.field] = change.newValue
        }
        break
      case 'animation':
        if (change.field in newSlide.animation) {
          (newSlide.animation as Record<string, unknown>)[change.field] = change.newValue
        }
        break
      case 'style':
        // Handle style changes
        if (change.field === 'backgroundColor') {
          newSlide.backgroundColor = change.newValue as string
        } else if (change.field === 'backgroundImage') {
          newSlide.backgroundImage = change.newValue as string
        }
        break
    }
  }

  return newSlide
}

// Suggest improvements for a slide
export async function suggestSlideImprovements(
  provider: AIProvider,
  slide: Slide
): Promise<string[]> {
  const prompt = `Analyze this slide and suggest 3-5 quick improvements:

Type: ${slide.type}
Title: ${slide.content.title || 'None'}
Content: ${JSON.stringify(slide.content)}

Provide brief, actionable suggestions.`

  const response = await generateAIResponse(provider, {
    slideId: slide.id,
    slideType: slide.type,
    slideContent: slide.content,
    slideAnimation: slide.animation,
    conversationHistory: [],
  }, prompt)

  // Parse suggestions from response
  const lines = response.content.split('\n').filter(line => line.trim().match(/^[\d\-\*]/))
  return lines.slice(0, 5)
}
