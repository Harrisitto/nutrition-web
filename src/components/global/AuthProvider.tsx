import { useEffect } from 'react'
import { setSession, getCurrentSession } from '../../store/slices/auth/store'
import { supabase } from '../../services/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useAppDispatch } from '@src/store/store'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Get initial session
    dispatch(getCurrentSession())

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session)
      dispatch(setSession({
        user: session?.user ?? null,
        session: session ?? null,
      }))
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider