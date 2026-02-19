import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getCollection, COLLECTIONS, toStringId } from './mongodb'

export interface User {
  _id?: string
  id: string
  email: string
  name: string
  avatar?: string
  authProvider: 'credentials' | 'google'
  passwordHash?: string
  googleId?: string
  createdAt: Date
  aiProvider?: 'openai' | 'anthropic'
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      aiProvider?: 'openai' | 'anthropic'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    aiProvider?: 'openai' | 'anthropic'
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const usersCollection = await getCollection<User>(COLLECTIONS.USERS)
        const user = await usersCollection.findOne({ email: credentials.email })

        if (!user) {
          throw new Error('No user found with this email')
        }

        if (!user.passwordHash) {
          throw new Error('Please use Google login for this account')
        }

        const isValid = await compare(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: toStringId(user._id!),
          email: user.email,
          name: user.name,
          image: user.avatar,
        }
      },
    }),
    // Google OAuth will be added in Phase 2
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      // Fetch user settings from DB if needed
      if (token.id && !token.aiProvider) {
        try {
          const usersCollection = await getCollection<User>(COLLECTIONS.USERS)
          const dbUser = await usersCollection.findOne({ _id: token.id })
          if (dbUser) {
            token.aiProvider = dbUser.aiProvider
          }
        } catch {
          // Ignore errors in callback
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.aiProvider = token.aiProvider
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
