import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { getCollection, COLLECTIONS, toObjectId, toStringId, ObjectId } from '@/lib/mongodb'
import { authOptions } from '@/lib/auth'
import { generateAIResponse, type AIProvider, type ChatContext, type ChatMessage, type SelectedElement } from '@/lib/ai'

interface Project {
  _id?: ObjectId
  userId: string
}

interface ChatHistoryDoc {
  _id?: ObjectId
  projectId: string
  slideId: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    selectedElement?: SelectedElement
    suggestedChanges?: unknown[]
  }
}

const chatMessageSchema = z.object({
  message: z.string(),
  image: z.string().optional(), // Base64 image data
  slideContent: z.object({}).passthrough().optional().default({}),
  slideType: z.string(),
  slideAnimation: z.object({}).passthrough().optional().default({}),
  selectedElement: z.object({
    type: z.string(),
    path: z.string(),
    content: z.string(),
    index: z.number().optional(),
  }).optional().nullable(),
  aiProvider: z.enum(['openai', 'anthropic']).default('openai'),
})

// GET - Get chat history for a slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, slideId } = await params

    // Verify project ownership
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const project = await projectsCollection.findOne({
      _id: toObjectId(projectId),
      userId: session.user.id,
    } as unknown as Project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const chatCollection = await getCollection<ChatHistoryDoc>(COLLECTIONS.CHAT_HISTORY)
    const messages = await chatCollection
      .find({ projectId, slideId } as unknown as ChatHistoryDoc)
      .sort({ timestamp: 1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: toStringId(msg._id!),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        suggestedChanges: msg.metadata?.suggestedChanges,
      })),
    })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}

// POST - Send a message and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, slideId } = await params
    const body = await request.json()
    const validation = chatMessageSchema.safeParse(body)

    if (!validation.success) {
      console.error('Chat validation error:', JSON.stringify(validation.error.issues, null, 2))
      console.error('Request body keys:', Object.keys(body))
      return NextResponse.json(
        { error: validation.error.issues[0].message, details: validation.error.issues },
        { status: 400 }
      )
    }

    const {
      message,
      image,
      slideContent,
      slideType,
      slideAnimation,
      selectedElement,
      aiProvider,
    } = validation.data

    // Verify project ownership
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const project = await projectsCollection.findOne({
      _id: toObjectId(projectId),
      userId: session.user.id,
    } as unknown as Project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const chatCollection = await getCollection<ChatHistoryDoc>(COLLECTIONS.CHAT_HISTORY)
    const now = new Date()

    // Save user message
    await chatCollection.insertOne({
      projectId,
      slideId,
      userId: session.user.id,
      role: 'user',
      content: message,
      timestamp: now,
      metadata: selectedElement ? { selectedElement: selectedElement as SelectedElement } : undefined,
    })

    // Get recent conversation history
    const history = await chatCollection
      .find({ projectId, slideId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    const conversationHistory: ChatMessage[] = history
      .reverse()
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }))

    // Build context for AI
    const context: ChatContext = {
      slideId,
      slideType,
      slideContent: slideContent as ChatContext['slideContent'],
      slideAnimation: slideAnimation as ChatContext['slideAnimation'],
      selectedElement: selectedElement as SelectedElement | undefined,
      conversationHistory,
    }

    // Generate AI response (with optional image for vision models)
    const aiResponse = await generateAIResponse(
      aiProvider as AIProvider,
      context,
      message,
      image
    )

    // Save assistant message
    await chatCollection.insertOne({
      projectId,
      slideId,
      userId: session.user.id,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        suggestedChanges: aiResponse.suggestedChanges,
      },
    })

    return NextResponse.json({
      message: aiResponse.content,
      suggestedChanges: aiResponse.suggestedChanges,
    })
  } catch (error) {
    console.error('Error processing chat:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
