import { useEffect } from 'react'
import { setLoading, setProfile, setSession } from '../../store/slices/auth/store'
import type { Session } from '@supabase/supabase-js'
import { useAppDispatch, useAppSelector } from '@src/store/store'
import { supabase } from '@src/services/supabase/client'
import { useNotification } from '@src/store/slices/notification/hook'
import { TABLE_ALL_NUTRITIONISTS } from '@src/services/supabase/definitions'
import { setError } from '../../store/slices/error/store'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../hooks/navigation/routes'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const { addErrorIcon } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      dispatch(setLoading(true))

      try {
        const { data, error } = await supabase.auth.getSession()

        if (!isMounted) return

        if (error) {
          dispatch(setError({
            message: error.message,
            action: 'syncSession',
            component: 'AuthProvider',
            severity: 'high',
          }))
          return
        }

        dispatch(setSession({
          user: data.session?.user ?? null,
          session: data.session ?? null,
        }))
      } catch (error) {
        if (!isMounted) return
        dispatch(setError({
          message: error instanceof Error ? error.message : 'Unable to load session',
          action: 'syncSession',
          component: 'AuthProvider',
          severity: 'high',
        }))
      } finally {
        if (isMounted) {
          dispatch(setLoading(false))
        }
      }
    }

    void syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
      dispatch(setSession({
        user: session?.user ?? null,
        session: session ?? null,
      }))
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [dispatch])

  useEffect(() => {
    if (!auth.user || !auth.session) {
      return
    }

    if (auth.profile) {
      navigate(APP_ROUTES.DASHBOARD)
      return
    }

    const fetchProfile = async () => {
      dispatch(setLoading(true))

      try {
        const { data: user, error: userError } = await supabase.auth.getUser()

        if (userError || !user.user?.id) {
          dispatch(setError({
            message: userError?.message || 'Unable to fetch user',
            action: 'fetchProfile',
            component: 'AuthProvider',
            severity: 'high',
          }))
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from(TABLE_ALL_NUTRITIONISTS.NAME)
          .select('*')
          .eq(TABLE_ALL_NUTRITIONISTS.COLS.USER_ID, user.user.id)
          .limit(1)
          .maybeSingle()

        if (profileError) {
          dispatch(setError({
            message: profileError.message,
            action: 'fetchProfile',
            component: 'AuthProvider',
            severity: 'high',
          }))
          return
        }

        if (!profile) {
          navigate(APP_ROUTES.COMPLETE_PROFILE)
          return
        }

        dispatch(setProfile(profile))
        navigate(APP_ROUTES.DASHBOARD)
      } catch (error) {
        dispatch(setError({
          message: error instanceof Error ? error.message : 'Unable to fetch profile',
          action: 'fetchProfile',
          component: 'AuthProvider',
          severity: 'high',
        }))
      } finally {
        dispatch(setLoading(false))
      }
    }

    void fetchProfile()
  }, [auth.profile, auth.session, auth.user, dispatch])

  useEffect(() => {
    if (auth.error) {
      addErrorIcon();
    }
  }, [auth.error, auth.loading, addErrorIcon]);

  return children
}

export default AuthProvider