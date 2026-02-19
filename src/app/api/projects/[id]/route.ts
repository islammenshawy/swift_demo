import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { getCollection, COLLECTIONS, toObjectId, toStringId, ObjectId } from '@/lib/mongodb'
import { authOptions } from '@/lib/auth'

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

const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  thumbnail: z.string().optional(),
})

// GET - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const presentationsCollection = await getCollection(COLLECTIONS.PRESENTATIONS)

    const project = await projectsCollection.findOne({
      _id: toObjectId(id),
      userId: session.user.id,
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get presentation
    const presentation = await presentationsCollection.findOne({
      projectId: id,
    })

    return NextResponse.json({
      project: {
        ...project,
        _id: toStringId(project._id!),
      },
      presentation,
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validation = updateProjectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)

    // Verify ownership
    const existing = await projectsCollection.findOne({
      _id: toObjectId(id),
      userId: session.user.id,
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updateData = {
      ...validation.data,
      updatedAt: new Date(),
    }

    await projectsCollection.updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    )

    return NextResponse.json({
      success: true,
      project: {
        ...existing,
        ...updateData,
        _id: id,
      },
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const presentationsCollection = await getCollection(COLLECTIONS.PRESENTATIONS)
    const chatCollection = await getCollection(COLLECTIONS.CHAT_HISTORY)

    // Verify ownership
    const existing = await projectsCollection.findOne({
      _id: toObjectId(id),
      userId: session.user.id,
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete project and related data
    await Promise.all([
      projectsCollection.deleteOne({ _id: toObjectId(id) }),
      presentationsCollection.deleteMany({ projectId: id }),
      chatCollection.deleteMany({ projectId: id }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
