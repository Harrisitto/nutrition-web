import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { setSession, getCurrentSession } from '../../store/slices/auth'
import { supabase } from '../../services/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()

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