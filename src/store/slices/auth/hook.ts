import { useCallback } from 'react'
import {
  signIn,
  signUp,
  signOut,
  fetchSession,
  clearData,
} from './store'
import { useAppDispatch, useAppSelector } from '@src/store/store'
import { fetchProfile } from './thunks/fetchProfile'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const handleSignIn = useCallback(
    (email: string, password: string) => {
      dispatch(signIn({ email, password }))
    },
    [dispatch]
  )

  const handleSignUp = useCallback(
    (email: string, password: string) => {
      dispatch(signUp({ email, password }))
    },
    [dispatch]
  )

  const handleSignOut = useCallback(() => {
    dispatch(signOut())
    dispatch(clearData())
  }, [dispatch])

  const fetchCurrentSession = useCallback(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  const fetchUserProfile = useCallback(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return {
    ...auth,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    fetchSession: fetchCurrentSession,
    fetchProfile: fetchUserProfile,
  }
}