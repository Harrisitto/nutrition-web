import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../store'
import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  clearError,
} from '../../../store/slices/auth'
import { useAppSelector } from '..'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.auth)

  const handleSignIn = async (email: string, password: string) => {
    return await dispatch(signIn({ email, password }))
  }

  const handleSignUp = async (email: string, password: string) => {
    return await dispatch(signUp({ email, password }))
  }

  const handleSignOut = async () => {
    return await dispatch(signOut())
  }

  const handleResetPassword = async (email: string) => {
    return await dispatch(resetPassword(email))
  }

  const handleUpdatePassword = async (password: string) => {
    return await dispatch(updatePassword(password))
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  return {
    ...auth,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    clearError: handleClearError,
  }
}