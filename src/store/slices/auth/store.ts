import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, Session } from '@supabase/supabase-js'
import { signIn } from './thunks/signIn'
import { signUp } from './thunks/signUp'
import { signOut } from './thunks/signOut'
import { fetchSession } from './thunks/fetchSession'




export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user
      state.session = action.payload.session
      state.isAuthenticated = !!action.payload.user?.email_confirmed_at
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.isAuthenticated = !!action.payload.user?.email_confirmed_at
        state.error = null
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.session = null
        state.isAuthenticated = false
      })

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.isAuthenticated = !!action.payload.user
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.session = null
        state.isAuthenticated = false
      })

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.session = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Session
    builder
      .addCase(fetchSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.isAuthenticated = !!action.payload.user
        state.error = null
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.session = null
        state.isAuthenticated = false
      })
  },
})

// Export actions
export const { clearError, setSession, setLoading } = authSlice.actions

// Export async thunks
export {
  signUp,
  signIn,
  signOut,
  fetchSession,
}

// Export reducer
export default authSlice.reducer
