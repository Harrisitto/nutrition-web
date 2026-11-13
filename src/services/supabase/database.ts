import type { Database as GeneratedDatabase, Json } from './types'

// jsonb columns of nutri_race_plans, ordered by km (the same fields save_race_plan takes)
export type RacePlanStep = {
    km_start: number
    min_altitude: number | null
    min_altitude_at: number | null
    max_altitude: number | null
    max_altitude_at: number | null
    elevation_gain: number | null
    elevation_loss: number | null
    aprox_time_start: string | null
}
export type RacePlanIntake = { ingredient_id: number; km: number; amount: number; km_span: number | null }
export type RacePlanLandmark = { landmark_id: number; km: number; name: string }

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
            // language_code: 20261113120000_scored_search_recipe_types_nullable_client.sql
            nutri_profile: {
                Row: { id: string; name: string; created_at: string; updated_at: string; language_code: string }
                Insert: { id?: string; name: string }
                Update: { name?: string; language_code?: string }
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
            // Views of nutrition-proton/supabase/migrations/20261112130000_schema_documents.sql. Documents are
            // uploaded and deleted through Storage (triggers on storage.objects); the view only renames
            nutri_documents: {
                Row: {
                    id: string; nutri_id: string; name: string; mime_type: string; document_type: string
                    extension: string | null; size_bytes: number; path: string; created_at: string; updated_at: string
                }
                Insert: never
                Update: { name?: string }
            }
            // Views of nutrition-proton/supabase/migrations/20261112130100_schema_races.sql. Races are created
            // and edited with the RPC save_race_plan; nutri_client_races only deletes
            nutri_client_races: {
                Row: {
                    id: number; nutri_id: string; client_id: string; client_name: string; client_language: string
                    name: string; race_date: string; distance_km: number; gpx_path: string | null
                    total_hc: number; total_kcal: number; image_path: string; created_at: string
                }
                Insert: never
                Update: never
            }
            nutri_race_plans: {
                Row: {
                    id: number; nutri_id: string; client_id: string; name: string; race_date: string
                    distance_km: number; gpx_path: string | null
                    steps: RacePlanStep[]; intakes: RacePlanIntake[]; landmarks: RacePlanLandmark[]
                }
                Insert: never
                Update: never
            }
            nutri_race_foods: {
                Row: {
                    id: number; nutri_id: string; name: string; hc_amount: number | null; sodium_amount: number | null
                    caffeine_amount: number | null; liquid_amount: number | null; is_deleted: boolean
                    image_path: string; created_at: string
                }
                Insert: {
                    nutri_id?: string; name: string; hc_amount?: number | null; sodium_amount?: number | null
                    caffeine_amount?: number | null; liquid_amount?: number | null; is_deleted?: boolean
                }
                Update: {
                    name?: string; hc_amount?: number | null; sodium_amount?: number | null
                    caffeine_amount?: number | null; liquid_amount?: number | null; is_deleted?: boolean
                }
            }
            catalog_race_landmarks: {
                Row: { id: number; name: Json; url: string }
            }
        }
    }
}

// supabase gen types never marks function args as nullable. Args can't be widened by intersection
// (string & (string | null) is string), so these functions replace the generated ones
type GeneratedFunctions = GeneratedDatabase['public']['Functions']

type FunctionOverrides = {
    // nutrition-proton 20261113120000_scored_search_recipe_types_nullable_client.sql: p_client_id NULL
    // returns every type with score 0. The name is in the nutritionist's language_code (nutri_profile)
    scored_search_recipe_types_for_client: {
        Args: { p_client_id: string | null; p_search_text: string | null }
        Returns: {
            id: number; name: string; comment: string | null
            kcal: number; hc: number; prot: number; fat: number; score: number
        }[]
    }
    // 20261113121000_scored_search_race_ingredients_nullable_user.sql: p_user_id NULL searches without a
    // client. Every NULL amount neither filters nor scores
    scored_search_race_ingredients_for_user: {
        Args: {
            p_user_id: string | null; p_search_text: string | null
            p_carbs_amount: number | null; p_sodium_amount: number | null
            p_caffeine_amount: number | null; p_liquid_amount: number | null
        }
        Returns: {
            id: number; name: string; image_path: string
            // NULL if the ingredient has no amount (it still scores as 0)
            carbs_amount: number | null; sodium_amount: number | null
            caffeine_amount: number | null; liquid_amount: number | null
            score: number
        }[]
    }
}

type FunctionsWithOverrides = Omit<GeneratedFunctions, keyof FunctionOverrides> & FunctionOverrides

export type Database = Omit<GeneratedDatabase, 'public'> & {
    public: Omit<GeneratedDatabase['public'], 'Functions'> & { Functions: FunctionsWithOverrides }
} & ViewOverrides

export type ViewRow<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
export type ViewInsert<T extends keyof Database['public']['Views']> =
    Database['public']['Views'][T] extends { Insert: infer I } ? I : never
