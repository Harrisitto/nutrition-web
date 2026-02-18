import { useCallback, useEffect } from 'react'
import {
  signIn,
  signUp,
  clearError,
  signOut,
  fetchSession,
} from './store'
import { useAppDispatch, useAppSelector } from '@src/store/store'
import { useNotification } from '../notification/hook'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const { addErrorIcon, addSuccessIcon } = useNotification();

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
  }, [dispatch])

  const fetchCurrentSession = useCallback(() => {
    dispatch(fetchSession());
  }, [dispatch]);


  useEffect(() => {
    if (auth.error) {
      addErrorIcon();
      dispatch(clearError());
    }
  }, [auth.error, auth.loading, addErrorIcon, addSuccessIcon, dispatch]);


    

  return {
    ...auth,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    fetchSession: fetchCurrentSession,
  }
}