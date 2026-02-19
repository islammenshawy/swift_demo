import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { getCollection, COLLECTIONS, toObjectId, toStringId, ObjectId } from '@/lib/mongodb'
import { authOptions } from '@/lib/auth'

// Project schema
interface Project {
  _id?: ObjectId
  userId: string
  title: string
  description?: string
  thumbnail?: string
  createdAt: Date
  updatedAt: Date
  isTemplate: boolean
}

interface Presentation {
  projectId: string
  version: number
  slides: unknown[]
  theme: string
  autoPlaySpeed: number
  createdAt: Date
  updatedAt: Date
}

interface Template {
  _id?: ObjectId
  presentation?: {
    slides: unknown[]
  }
}

// Validation schema
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  templateId: z.string().optional(), // If creating from template
})

// GET - List user's projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''

    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [projects, total] = await Promise.all([
      projectsCollection
        .find(query)
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      projectsCollection.countDocuments(query),
    ])

    // Get slide counts for each project
    const presentationsCollection = await getCollection<Presentation>(COLLECTIONS.PRESENTATIONS)
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const presentation = await presentationsCollection.findOne({
          projectId: toStringId(project._id!),
        })
        return {
          ...project,
          _id: toStringId(project._id!),
          slideCount: presentation?.slides?.length || 0,
        }
      })
    )

    return NextResponse.json({
      projects: projectsWithCounts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createProjectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, description, templateId } = validation.data
    const now = new Date()

    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const presentationsCollection = await getCollection<Presentation>(COLLECTIONS.PRESENTATIONS)

    // Create project
    const newProject: Omit<Project, '_id'> = {
      userId: session.user.id,
      title,
      description,
      createdAt: now,
      updatedAt: now,
      isTemplate: false,
    }

    const result = await projectsCollection.insertOne(newProject as Project)
    const projectId = toStringId(result.insertedId)

    // Initialize presentation
    let slides: unknown[] = [
      {
        id: 'slide-1',
        order: 1,
        type: 'title',
        content: {
          title: title,
          subtitle: description || 'Created with SlideForge',
        },
        animation: {
          type: 'fadeIn',
          duration: 500,
          delay: 0,
        },
      },
    ]

    // If creating from template, copy slides from template
    if (templateId) {
      const templatesCollection = await getCollection<Template>(COLLECTIONS.TEMPLATES)
      const template = await templatesCollection.findOne({ _id: toObjectId(templateId) })
      if (template?.presentation?.slides) {
        slides = template.presentation.slides
      }
    }

    // Create presentation
    await presentationsCollection.insertOne({
      projectId,
      version: 1,
      slides,
      theme: 'swift-dark',
      autoPlaySpeed: 5000,
      createdAt: now,
      updatedAt: now,
    } as Presentation)

    return NextResponse.json({
      success: true,
      project: {
        _id: projectId,
        ...newProject,
      },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
