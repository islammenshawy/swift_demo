import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { getCollection, COLLECTIONS, toObjectId, toStringId, ObjectId } from '@/lib/mongodb'
import { authOptions } from '@/lib/auth'

interface Project {
  _id?: ObjectId
  userId: string
}

interface Presentation {
  _id?: ObjectId
  projectId: string
  version: number
  slides: unknown[]
  theme: string
  autoPlaySpeed: number
  createdAt: Date
  updatedAt: Date
}

// Slide validation
const slideSchema = z.object({
  id: z.string(),
  order: z.number(),
  type: z.enum(['title', 'content', 'chart', 'image', 'speaker', 'timeline', 'comparison', 'interactive']),
  content: z.object({}).passthrough(),
  animation: z.object({
    type: z.string(),
    duration: z.number(),
    delay: z.number(),
  }).passthrough(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  hidden: z.boolean().optional(),
})

const updatePresentationSchema = z.object({
  slides: z.array(slideSchema).optional(),
  theme: z.enum(['swift-dark', 'swift-light']).optional(),
  autoPlaySpeed: z.number().min(1000).max(30000).optional(),
})

// GET - Get presentation by project ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await params

    // Verify project ownership
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const project = await projectsCollection.findOne({
      _id: toObjectId(projectId),
      userId: session.user.id,
    } as unknown as Project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const presentationsCollection = await getCollection<Presentation>(COLLECTIONS.PRESENTATIONS)
    const presentation = await presentationsCollection.findOne({ projectId } as unknown as Presentation)

    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
    }

    return NextResponse.json({
      presentation: {
        ...presentation,
        _id: toStringId(presentation._id!),
      },
    })
  } catch (error) {
    console.error('Error fetching presentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    )
  }
}

// PUT - Update presentation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await params
    const body = await request.json()
    const validation = updatePresentationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    // Verify project ownership
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const project = await projectsCollection.findOne({
      _id: toObjectId(projectId),
      userId: session.user.id,
    } as unknown as Project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const presentationsCollection = await getCollection<Presentation>(COLLECTIONS.PRESENTATIONS)
    const now = new Date()

    const updateData = {
      ...validation.data,
      updatedAt: now,
    }

    await presentationsCollection.updateOne(
      { projectId } as unknown as Presentation,
      {
        $set: updateData,
        $inc: { version: 1 },
      }
    )

    // Also update project's updatedAt
    await projectsCollection.updateOne(
      { _id: toObjectId(projectId) } as unknown as Project,
      { $set: { updatedAt: now } }
    )

    // Fetch updated presentation
    const presentation = await presentationsCollection.findOne({ projectId } as unknown as Presentation)

    return NextResponse.json({
      success: true,
      presentation: {
        ...presentation,
        _id: toStringId(presentation!._id!),
      },
    })
  } catch (error) {
    console.error('Error updating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    )
  }
}
