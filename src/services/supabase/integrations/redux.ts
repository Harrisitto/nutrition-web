import { createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from './client'

// Async thunks for authentication actions
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return { user: data.user, session: data.session }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return { user: data.user, session: data.session }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return rejectWithValue(error.message)
      }

      return null
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)

export const getCurrentSession = createAsyncThunk(
  'auth/getCurrentSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        return rejectWithValue(error.message)
      }

      return { user: session?.user || null, session }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return { message: 'Password reset email sent successfully' }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return { user: data.user }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }
)