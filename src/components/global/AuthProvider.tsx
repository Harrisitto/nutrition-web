import { useEffect } from 'react'
import { setSession, fetchSession } from '../../store/slices/auth/store'
import type { Session } from '@supabase/supabase-js'
import { useAppDispatch, useAppSelector } from '@src/store/store'
import { supabase } from '@src/services/supabase/client'
import { fetchProfile } from '@src/store/slices/auth/thunks/fetchProfile'
import { useNotification } from '@src/store/slices/notification/hook'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const { addErrorIcon } = useNotification();

  /** Listen for auth state changes and fetch session on mount */
  useEffect(() => {
    dispatch(fetchSession())
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
      dispatch(setSession({
        user: session?.user ?? null,
        session: session ?? null,
      }))
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  /** Fetch user profile when authenticated */
  useEffect(() => {
    if (
      auth.user && 
      auth.isAuthenticated && 
      !auth.profile
    ) {
      console.log('Fetching user profile for:', auth.user.email)
      dispatch(fetchProfile());
    }
  }, [auth.isAuthenticated, auth.user, auth.profile, dispatch]);

  /** Show error notification if there's an authentication error */
  useEffect(() => {
    if (auth.error) {
      addErrorIcon();
    }
  }, [auth.error, auth.loading, addErrorIcon]);

  return children
}

export default AuthProvider