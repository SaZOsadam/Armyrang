import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) await fetchProfile(session.user.id)
        else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (existing) {
      setProfile(existing)
      setLoading(false)
      return
    }

    // Trigger didn't run — create profile client-side
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const meta = authUser.user_metadata || {}
      const username = meta.username || authUser.email?.split('@')[0] || `user_${userId.slice(0, 8)}`
      const { data: created } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username,
          display_name: meta.display_name || username,
          role: meta.role || 'observer',
        })
        .select()
        .single()
      setProfile(created)
    }
    setLoading(false)
  }

  async function signUp(email, password, username, role) {
    if (!isConfigured) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username, role },
      },
    })
    return { error }
  }

  async function signIn(email, password) {
    if (!isConfigured) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    if (!isConfigured) return
    await supabase.auth.signOut()
  }

  const isAnalyst = profile?.role === 'analyst' || profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, isAnalyst }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
