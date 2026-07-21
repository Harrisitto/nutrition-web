import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, Session } from '@supabase/supabase-js'
import { signIn } from './thunks/signIn'
import { signOut } from './thunks/signOut'
import { fetchSession } from './thunks/fetchSession'
import type { Database } from '@src/services/supabase/types'
import { fetchProfile } from './thunks/fetchProfile'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  profile: Database['public']['Tables']['all_nutritionist']['Row'] | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  profile: null,
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
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearData: (state) => {
      Object.assign(state, initialState)
    },
    setProfile: (state, action: PayloadAction<Database['public']['Tables']['all_nutritionist']['Row']>) => {
      state.profile = action.payload
    }
  },
  extraReducers: (builder) => {
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
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.session = null
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
        state.error = null
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.session = null
      })

    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.profile = null
      })
  },
})

// Export actions
export const { clearError, setSession, setLoading, clearData, setProfile } = authSlice.actions

// Export async thunks
export {
  signIn,
  signOut,
  fetchSession,
}

// Export reducer
export default authSlice.reducer
