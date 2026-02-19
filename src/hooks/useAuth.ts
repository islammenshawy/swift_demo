'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return result
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Registration failed')
    }

    // Auto-login after registration
    return login(email, password)
  }, [login])

  const logout = useCallback(() => {
    return signOut({ callbackUrl: '/login' })
  }, [])

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    register,
    logout,
  }
}
