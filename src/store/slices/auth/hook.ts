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

export const useAuthId = () => {
  return useAppSelector((state) => state.auth.user?.id ?? '')
}

export const useAuthUser = () => {
  return useAppSelector((state) => state.auth.user)
}

export const useAuthSession = () => {
  return useAppSelector((state) => state.auth.session)
}

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.loading)
}

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error)
}

export const useAuthIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated)
}

export const useAuthProfile = () => {
  return useAppSelector((state) => state.auth.profile)
}

export const useAuthSignIn = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (email: string, password: string) => {
      dispatch(signIn({ email, password }))
    },
    [dispatch]
  )
}

export const useAuthSignUp = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (email: string, password: string) => {
      dispatch(signUp({ email, password }))
    },
    [dispatch]
  )
}

export const useAuthSignOut = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(signOut())
    dispatch(clearData())
  }, [dispatch])
}

export const useAuthFetchSession = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(fetchSession())
  }, [dispatch])
}

export const useAuthFetchProfile = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(fetchProfile())
  }, [dispatch])
}

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