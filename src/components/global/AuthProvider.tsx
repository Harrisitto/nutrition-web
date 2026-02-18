import { useEffect } from 'react'
import { setSession, fetchSession } from '../../store/slices/auth/store'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useAppDispatch } from '@src/store/store'
import { supabase } from '@src/services/supabase/client'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Get initial session
    dispatch(fetchSession())

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      dispatch(setSession({
        user: session?.user ?? null,
        session: session ?? null,
      }))
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return children
}

export default AuthProvider