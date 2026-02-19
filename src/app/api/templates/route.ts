import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Import existing demos as templates
import { swiftInitiativesDemo } from '@/data/swift-demos/swift-initiatives'
import { tradeFinance101Demo } from '@/data/swift-demos/trade-finance-101'
import { tradeTemplatingDemo } from '@/data/swift-demos/trade-templating'
import { evalioDemo } from '@/data/swift-demos/evalio-demo'
import { tradeReimaginedDemo } from '@/data/swift-demos/trade-reimagined'

// Template definitions using existing demos
const TEMPLATES = [
  {
    id: 'swift-initiatives',
    name: 'Supply Chain Finance',
    description: 'Professional presentation for supply chain and trade finance initiatives',
    category: 'Business',
    thumbnail: '/templates/supply-chain.png',
    featured: true,
    usageCount: 1250,
    presentation: swiftInitiativesDemo,
  },
  {
    id: 'trade-finance-101',
    name: 'Trade Finance 101',
    description: 'Introduction to trade finance concepts and workflows',
    category: 'Education',
    thumbnail: '/templates/trade-finance.png',
    featured: true,
    usageCount: 980,
    presentation: tradeFinance101Demo,
  },
  {
    id: 'trade-templating',
    name: 'Trade Templating',
    description: 'Template-based approach to trade documentation',
    category: 'Business',
    thumbnail: '/templates/templating.png',
    featured: false,
    usageCount: 650,
    presentation: tradeTemplatingDemo,
  },
  {
    id: 'evalio-demo',
    name: 'Evalio Platform',
    description: 'Product demo presentation with interactive elements',
    category: 'Product',
    thumbnail: '/templates/evalio.png',
    featured: true,
    usageCount: 820,
    presentation: evalioDemo,
  },
  {
    id: 'trade-reimagined',
    name: 'Trade Reimagined',
    description: 'Future of trade with innovative visualizations',
    category: 'Innovation',
    thumbnail: '/templates/reimagined.png',
    featured: false,
    usageCount: 540,
    presentation: tradeReimaginedDemo,
  },
  {
    id: 'blank',
    name: 'Blank Presentation',
    description: 'Start with a clean slate',
    category: 'Basic',
    thumbnail: '/templates/blank.png',
    featured: false,
    usageCount: 3200,
    presentation: {
      id: 'blank',
      title: 'Untitled Presentation',
      slides: [
        {
          id: 'slide-1',
          order: 1,
          type: 'title',
          content: {
            title: 'Untitled Presentation',
            subtitle: 'Click to add subtitle',
          },
          animation: {
            type: 'fadeIn',
            duration: 500,
            delay: 0,
          },
        },
      ],
      theme: 'swift-dark',
      autoPlaySpeed: 5000,
      createdAt: new Date(),
    },
  },
]

// GET - List templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let templates = TEMPLATES.map(({ presentation, ...template }) => ({
      ...template,
      slideCount: presentation.slides?.length || 0,
    }))

    // Filter by category
    if (category && category !== 'all') {
      templates = templates.filter(t => t.category.toLowerCase() === category.toLowerCase())
    }

    // Filter featured
    if (featured === 'true') {
      templates = templates.filter(t => t.featured)
    }

    // Sort by usage count (most popular first)
    templates.sort((a, b) => b.usageCount - a.usageCount)

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// GET template by ID - used when creating project from template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId } = await request.json()

    const template = TEMPLATES.find(t => t.id === templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        presentation: template.presentation,
      },
    })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}
