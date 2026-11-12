import type { Database as GeneratedDatabase } from './types'

// supabase gen types marks every view column as nullable and gives no Update type to views written
// through INSTEAD OF triggers (user_measurements). These overrides restore the NOT NULL columns of the
// underlying public_users tables and limit Insert/Update to the columns the view lets you write.
// Intersecting with the generated types narrows `string | null` to `string`.

type Views = GeneratedDatabase['public']['Views']

type NutriClientsRow = {
    id: string
    name: string
    goal: string
    gender: string
    email: string
    phone: string
    prefered_language: string
    nutri_id: string
    accepted_at: string
    created_at: string
    updated_at: string
}

// Columns the nutritionist can change (GRANT UPDATE ... ON public.nutri_clients)
type NutriClientsUpdate = Partial<Pick<Views['nutri_clients']['Row'],
    'name' | 'goal' | 'birth_date' | 'gender' | 'email' | 'phone' | 'prefered_language'>>

type ViewOverrides = {
    public: {
        Views: {
            nutri_clients: {
                Row: NutriClientsRow
                Insert: never
                Update: NutriClientsUpdate
            }
            // Views of nutrition-proton/supabase/migrations/20261112120000_schema_users_views.sql.
            // Insert/Update follow the GRANTs of each view (id and nutri_id default to auth.uid())
            nutri_profile: {
                Row: { id: string; name: string; created_at: string; updated_at: string }
                Insert: { id?: string; name: string }
                Update: { name?: string }
            }
            nutri_videos: {
                Row: { id: number; nutri_id: string; url: string; name: string; description: string; updated_at: string }
                Insert: { nutri_id?: string; url: string; name: string; description?: string }
                Update: { url?: string; name?: string; description?: string }
            }
            nutri_invitations: {
                Row: { nutri_id: string; client_id: string; message: string; created_at: string; expires_at: string }
                Insert: never
                Update: never
            }
            catalog_measurements: {
                Row: { id: number; allow_client: boolean }
            }
            user_measurements: {
                Row: { client_id: string; measure_id: number; value: number; date: string; allow_client: boolean }
                Insert: { client_id?: string; measure_id: number; value: number; date?: string }
                Update: { value?: number }
            }
        }
    }
}

export type Database = GeneratedDatabase & ViewOverrides

export type ViewRow<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
export type ViewInsert<T extends keyof Database['public']['Views']> =
    Database['public']['Views'][T] extends { Insert: infer I } ? I : never
