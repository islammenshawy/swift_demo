import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { getCollection, COLLECTIONS, toStringId } from '@/lib/mongodb'
import type { User } from '@/lib/auth'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    const usersCollection = await getCollection<User>(COLLECTIONS.USERS)

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create user
    const newUser: Omit<User, 'id'> = {
      email,
      name,
      passwordHash,
      authProvider: 'credentials',
      createdAt: new Date(),
      aiProvider: 'openai', // Default AI provider
    }

    const result = await usersCollection.insertOne(newUser as User)

    return NextResponse.json({
      success: true,
      user: {
        id: toStringId(result.insertedId),
        email,
        name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
