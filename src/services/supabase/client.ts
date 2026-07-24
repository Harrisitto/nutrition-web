import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// You need to replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
