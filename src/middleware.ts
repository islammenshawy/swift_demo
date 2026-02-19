import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow authenticated users to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Protected routes that require authentication
        const protectedPaths = ['/dashboard', '/projects', '/editor']
        const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

        // If it's a protected path, require authentication
        if (isProtectedPath) {
          return !!token
        }

        // Allow public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/editor/:path*',
  ],
}
