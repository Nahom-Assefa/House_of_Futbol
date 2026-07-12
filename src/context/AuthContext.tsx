import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  profile: Profile | null
  role: 'admin' | 'captain' | null
  isAdmin: boolean
  isCaptain: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Fast initial load from local storage — keeps loading=true until profile resolves
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          .then(({ data }) => {
            if (!mounted) return
            setProfile(data ?? null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    // Handle all subsequent auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return // already handled by getSession above
      if (!mounted) return

      setSession(session)
      if (session) {
        setLoading(true)
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          .then(({ data }) => {
            if (!mounted) return
            setProfile(data ?? null)
            setLoading(false)
          })
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const role = profile?.role ?? null

  const value = useMemo(() => ({
    isAuthenticated: session !== null,
    loading,
    profile,
    role,
    isAdmin: role === 'admin',
    isCaptain: role === 'captain',
    logout,
  }), [session, loading, profile, role, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
