import { supabase } from './client'

// Auth helper functions
export const authService = {
  // Confirm email verification
  verifyEmail: async (token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Email verification error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
}