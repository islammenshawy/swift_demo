import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { generateSlideComponent, type GenerateSlideInput } from '@/lib/coding-agent'
import { validateCode, formatValidationResult } from '@/lib/code-validator'
import { getCollection, COLLECTIONS, toObjectId, ObjectId } from '@/lib/mongodb'

interface Project {
  _id?: ObjectId
  userId: string
}

interface GeneratedSlideDoc {
  _id?: ObjectId
  projectId: string
  slideId: string
  userId: string
  componentCode: string
  componentName: string
  data: Record<string, unknown>
  dataSchema: Record<string, string>
  slideType: 'one-animation' | 'multi-step'
  totalPhases: number
  explanation: string
  createdAt: Date
  updatedAt: Date
}

// Request validation schema
const generateRequestSchema = z.object({
  projectId: z.string(),
  slideId: z.string(),
  input: z.object({
    type: z.enum(['image', 'text', 'modify']),
    content: z.string(),
    message: z.string(),
  }),
  preferences: z
    .object({
      style: z.enum(['minimal', 'corporate', 'creative', 'dark']).default('dark'),
      animationLevel: z.enum(['subtle', 'moderate', 'dynamic']).default('moderate'),
    })
    .optional(),
})

// POST - Generate a slide component
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request
    const body = await request.json()
    const validation = generateRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { projectId, slideId, input, preferences } = validation.data

    // Verify project ownership
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS)
    const project = await projectsCollection.findOne({
      _id: toObjectId(projectId),
      userId: session.user.id,
    } as unknown as Project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Build coding agent input
    const agentInput: GenerateSlideInput = {
      type: input.type,
      content: input.content,
      userMessage: input.message,
      preferences: preferences,
    }

    // Generate the slide component
    console.log(`[Coding Agent] Generating slide for project ${projectId}, slide ${slideId}`)
    const result = await generateSlideComponent(agentInput)

    if (!result.success) {
      console.error('[Coding Agent] Generation failed:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to generate slide' },
        { status: 500 }
      )
    }

    // Validate the generated code
    console.log('[Coding Agent] Validating generated code...')
    const validationResult = validateCode(result.componentCode)

    if (!validationResult.valid) {
      console.error('[Coding Agent] Code validation failed:')
      console.error(formatValidationResult(validationResult))

      return NextResponse.json(
        {
          error: 'Generated code failed validation',
          validationErrors: validationResult.errors,
        },
        { status: 422 }
      )
    }

    if (validationResult.warnings.length > 0) {
      console.warn('[Coding Agent] Validation warnings:', validationResult.warnings)
    }

    // Store the generated component in the database
    const generatedSlidesCollection = await getCollection<GeneratedSlideDoc>(COLLECTIONS.GENERATED_SLIDES)
    await generatedSlidesCollection.updateOne(
      { projectId, slideId },
      {
        $set: {
          projectId,
          slideId,
          userId: session.user.id,
          componentCode: result.componentCode,
          componentName: result.componentName,
          data: result.data,
          dataSchema: result.dataSchema,
          slideType: result.slideType,
          totalPhases: result.totalPhases,
          explanation: result.explanation,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    const generationTime = Date.now() - startTime

    console.log(`[Coding Agent] Successfully generated ${result.componentName} in ${generationTime}ms`)

    return NextResponse.json({
      success: true,
      slide: {
        id: slideId,
        componentCode: result.componentCode,
        componentName: result.componentName,
        data: result.data,
        dataSchema: result.dataSchema,
        slideType: result.slideType,
        totalPhases: result.totalPhases,
        explanation: result.explanation,
      },
      validation: {
        valid: true,
        warnings: validationResult.warnings,
      },
      usage: {
        generationTime,
      },
    })
  } catch (error) {
    console.error('[Coding Agent] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve a previously generated slide
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const slideId = searchParams.get('slideId')

    if (!projectId || !slideId) {
      return NextResponse.json(
        { error: 'projectId and slideId are required' },
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

    // Get the generated slide
    const generatedSlidesCollection = await getCollection<GeneratedSlideDoc>(COLLECTIONS.GENERATED_SLIDES)
    const generatedSlide = await generatedSlidesCollection.findOne({
      projectId,
      slideId,
      userId: session.user.id,
    } as Partial<GeneratedSlideDoc>)

    if (!generatedSlide) {
      return NextResponse.json({ error: 'Generated slide not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      slide: {
        id: slideId,
        componentCode: generatedSlide.componentCode,
        componentName: generatedSlide.componentName,
        data: generatedSlide.data,
        dataSchema: generatedSlide.dataSchema,
        slideType: generatedSlide.slideType || 'one-animation',
        totalPhases: generatedSlide.totalPhases || 1,
        explanation: generatedSlide.explanation,
      },
    })
  } catch (error) {
    console.error('[Coding Agent] Error fetching slide:', error)
    return NextResponse.json(
      { error: 'Failed to fetch generated slide' },
      { status: 500 }
    )
  }
}
