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

// jsonb text of public_recipes (recipes, ingredients, units, cooking methods), one entry per language
export type LocalizedText = Partial<Record<'es' | 'en' | 'fr' | 'de' | 'pt', string>>

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
            // Views of nutrition-proton/supabase/migrations/20261115190000_schema_recipes_user_recipes.sql.
            // Text columns are jsonb by language ({ es, en, fr, de, pt }); amounts are raw, in unit_id
            user_recipes: {
                Row: {
                    id: number; user_id: string; name: LocalizedText; description: LocalizedText | null
                    url: string | null; is_global: boolean; revised_at: string | null; approved_at: string | null
                }
                Insert: {
                    user_id?: string; name: LocalizedText; description?: LocalizedText | null
                    url?: string | null; is_global?: boolean
                }
                Update: { name?: LocalizedText; description?: LocalizedText | null; url?: string | null; is_global?: boolean }
            }
            user_recipe_ingredients: {
                Row: {
                    recipe_id: number; ingredient_id: number; amount: number; unit_id: number
                    // NULL = to taste (does not scale)
                    scale_factor: number | null
                    weight_factor: number | null; cooking_method_id: number; comment: LocalizedText | null
                }
                Insert: {
                    recipe_id: number; ingredient_id: number; amount: number; unit_id?: number
                    scale_factor?: number | null; weight_factor?: number | null; cooking_method_id?: number
                    comment?: LocalizedText | null
                }
                Update: {
                    amount?: number; unit_id?: number; scale_factor?: number | null; weight_factor?: number | null
                    cooking_method_id?: number; comment?: LocalizedText | null
                }
            }
            // Macros per 100 g (the columns have no NOT NULL)
            catalog_ingredients: {
                Row: {
                    id: number; name: LocalizedText; kcal: number | null; protein: number | null
                    carbs: number | null; sugars: number | null; fat: number | null
                    fat_saturated: number | null; fiber: number | null; salt: number | null
                }
            }
            catalog_units: {
                Row: { id: number; name: LocalizedText }
            }
            // grams of 1 unit of that ingredient; min_scale = smallest fraction that can be planned
            catalog_ingredient_units: {
                Row: { ingredient_id: number; unit_id: number; grams: number | null; min_scale: number | null }
            }
            // weight_factor = cooked / raw weight
            catalog_cooking_methods: {
                Row: { id: number; name: LocalizedText; weight_factor: number | null }
            }
            // Views of nutrition-proton/supabase/migrations/20261119120100_schema_planning.sql and
            // 20261119120200_schema_planning_recipes.sql. Written through INSTEAD OF triggers and the
            // user_planning_*_upsert RPC (no upsert on the views)
            catalog_meals: {
                Row: { id: number; name: LocalizedText; position: number; hour_start: number | null; hour_end: number | null }
            }
            catalog_recipes: {
                Row: { id: number; name: LocalizedText; description: LocalizedText | null; url: string | null }
            }
            catalog_recipe_ingredients: {
                Row: {
                    recipe_id: number; ingredient_id: number; amount: number; unit_id: number
                    scale_factor: number | null; weight_factor: number | null; cooking_method_id: number
                    comment: LocalizedText | null
                }
            }
            user_planning_days: {
                Row: {
                    client_id: string; date: string; training_hc: number[]; training_kcal: number
                    comment: string; event: string; custom_url: string | null; document_id: string | null
                }
            }
            user_planning_meals: {
                Row: {
                    client_id: string; date: string; meal_id: number; type_id: number
                    recipe_id: number | null; is_fixed_recipe: boolean; recipe_comment: string | null
                }
            }
            // amount in unit_id of that ingredient (catalog_ingredient_units)
            user_planning_meal_ingredients: {
                Row: {
                    client_id: string; date: string; meal_id: number; ingredient_id: number
                    amount: number; unit_id: number; cooking_method_id: number
                }
                Insert: {
                    client_id: string; date: string; meal_id: number; ingredient_id: number
                    amount: number; unit_id?: number; cooking_method_id?: number
                }
                Update: { amount?: number; unit_id?: number; cooking_method_id?: number }
            }
            nutri_predefined_days: {
                Row: {
                    id: number; nutri_id: string; client_id: string | null; name: string
                    comment: string | null; training_hc: number[]
                }
                Insert: {
                    name: string; client_id?: string | null; comment?: string | null; training_hc?: number[]
                }
                Update: { name?: string; comment?: string | null; training_hc?: number[] }
            }
            nutri_predefined_meals: {
                Row: { day_id: number; meal_id: number; type_id: number }
                Insert: { day_id: number; meal_id: number; type_id: number }
                Update: { type_id?: number }
            }
            nutri_recipe_ratings: {
                Row: { nutri_id: string; recipe_id: number; rating: number }
                Insert: { recipe_id: number; rating: number; nutri_id?: string }
                Update: { rating?: number }
            }
            // Views of nutrition-proton/supabase/migrations/20261119200000_schema_appointments.sql, added by hand
            // (not generated yet: regenerate with the pinned CLI when the migration is in remote). Written
            // through INSTEAD OF triggers; nutritionist writes without subscription give 55000. Themes are
            // assigned with the RPC nutri_client_themes_assign. nutri_* only show accepted clients
            nutri_themes: {
                Row: { id: number; nutri_id: string; name: string; is_deleted: boolean; created_at: string }
                Insert: { nutri_id?: string; name: string; is_deleted?: boolean }
                Update: { name?: string; is_deleted?: boolean }
                Relationships: []
            }
            nutri_theme_points: {
                Row: {
                    id: number; theme_id: number; point: string; in_days: number
                    group_name: string | null; document_id: string | null
                }
                Insert: {
                    theme_id: number; point: string; in_days: number
                    group_name?: string | null; document_id?: string | null
                }
                Update: { point?: string; in_days?: number; group_name?: string | null; document_id?: string | null }
                Relationships: [
                    { foreignKeyName: "theme_points_theme_id_fkey"; columns: ["theme_id"]; isOneToOne: false
                      referencedRelation: "nutri_themes"; referencedColumns: ["id"] },
                    { foreignKeyName: "theme_points_document_id_fkey"; columns: ["document_id"]; isOneToOne: false
                      referencedRelation: "nutri_documents"; referencedColumns: ["id"] },
                ]
            }
            nutri_client_themes: {
                Row: {
                    id: number; nutri_id: string; client_id: string; theme_id: number | null
                    theme_name: string; start_date: string; created_at: string
                }
                Insert: never
                Update: never
                Relationships: [
                    { foreignKeyName: "client_themes_theme_id_fkey"; columns: ["theme_id"]; isOneToOne: false
                      referencedRelation: "nutri_themes"; referencedColumns: ["id"] },
                    { foreignKeyName: "client_themes_client_id_fkey"; columns: ["client_id"]; isOneToOne: false
                      referencedRelation: "nutri_clients"; referencedColumns: ["id"] },
                ]
            }
            user_appointments: {
                Row: {
                    id: number; nutri_id: string; nutri_name: string; client_id: string
                    scheduled_on: string | null; start_time: string | null; video_url: string | null
                    description: string | null; status: string; created_at: string
                }
                Insert: {
                    nutri_id?: string; client_id: string; scheduled_on?: string | null; start_time?: string | null
                    video_url?: string | null; description?: string | null; status?: string
                }
                Update: {
                    scheduled_on?: string | null; start_time?: string | null; video_url?: string | null
                    description?: string | null; status?: string
                }
                Relationships: [
                    { foreignKeyName: "appointments_client_id_fkey"; columns: ["client_id"]; isOneToOne: false
                      referencedRelation: "nutri_clients"; referencedColumns: ["id"] },
                ]
            }
            // theme_name, group_name and document_id come from the assigned theme and its template point
            user_appointment_nutri_points: {
                Row: {
                    id: number; appointment_id: number; client_theme_id: number | null; theme_point_id: number | null
                    point: string; position: number; treated_at: string | null
                    theme_name: string | null; group_name: string | null; document_id: string | null
                }
                Insert: {
                    appointment_id: number; client_theme_id?: number | null; theme_point_id?: number | null
                    point: string; position?: number; treated_at?: string | null
                }
                Update: { appointment_id?: number; point?: string; position?: number; treated_at?: string | null }
                Relationships: [
                    { foreignKeyName: "nutri_points_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false
                      referencedRelation: "user_appointments"; referencedColumns: ["id"] },
                    { foreignKeyName: "nutri_points_client_theme_id_fkey"; columns: ["client_theme_id"]; isOneToOne: false
                      referencedRelation: "nutri_client_themes"; referencedColumns: ["id"] },
                    { foreignKeyName: "nutri_points_theme_point_id_fkey"; columns: ["theme_point_id"]; isOneToOne: false
                      referencedRelation: "nutri_theme_points"; referencedColumns: ["id"] },
                ]
            }
            user_appointment_client_points: {
                Row: {
                    id: number; nutri_id: string; client_id: string; appointment_id: number | null
                    point: string; position: number; treated_at: string | null; created_at: string
                }
                Insert: {
                    nutri_id?: string; client_id?: string; appointment_id?: number | null; point: string; position?: number
                }
                Update: { appointment_id?: number | null; point?: string; position?: number; treated_at?: string | null }
                Relationships: [
                    { foreignKeyName: "client_points_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false
                      referencedRelation: "user_appointments"; referencedColumns: ["id"] },
                ]
            }
            // status: null = note; "pending" or "done" = task
            nutri_client_notes: {
                Row: {
                    id: number; nutri_id: string; client_id: string; appointment_id: number | null; note: string
                    scheduled_date: string | null; priority: number; status: string | null; created_at: string
                }
                Insert: {
                    nutri_id?: string; client_id: string; appointment_id?: number | null; note: string
                    scheduled_date?: string | null; priority?: number; status?: string | null
                }
                Update: {
                    appointment_id?: number | null; note?: string; scheduled_date?: string | null
                    priority?: number; status?: string | null
                }
                Relationships: [
                    { foreignKeyName: "notes_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false
                      referencedRelation: "user_appointments"; referencedColumns: ["id"] },
                    { foreignKeyName: "notes_client_id_fkey"; columns: ["client_id"]; isOneToOne: false
                      referencedRelation: "nutri_clients"; referencedColumns: ["id"] },
                ]
            }
            user_appointment_documents: {
                Row: { appointment_id: number; document_id: string; created_at: string }
                Insert: { appointment_id: number; document_id: string }
                Update: never
                Relationships: [
                    { foreignKeyName: "documents_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false
                      referencedRelation: "user_appointments"; referencedColumns: ["id"] },
                    { foreignKeyName: "documents_document_id_fkey"; columns: ["document_id"]; isOneToOne: false
                      referencedRelation: "nutri_documents"; referencedColumns: ["id"] },
                ]
            }
        }
    }
}

// supabase gen types never marks function args as nullable. Args can't be widened by intersection
// (string & (string | null) is string), so these functions replace the generated ones
type GeneratedFunctions = GeneratedDatabase['public']['Functions']

type FunctionOverrides = {
    // 20261119200000_schema_appointments.sql (by hand, not generated yet): assigns a theme from p_start_date,
    // creates the missing appointments and copies its points. Returns the nutri_client_themes id
    nutri_client_themes_assign: {
        Args: { p_client_id: string; p_theme_id: number; p_start_date: string }
        Returns: number
    }
    // nutrition-proton 20261113120000_scored_search_recipe_types_nullable_client.sql: p_client_id NULL
    // returns every type with score 0. The name is in the nutritionist's language_code (nutri_profile).
    // 20261113130000_scored_search_recipe_types_meal.sql: with p_meal_id the score only counts that meal
    scored_search_recipe_types_for_client: {
        Args: { p_client_id: string | null; p_search_text: string | null; p_meal_id?: number | null }
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
