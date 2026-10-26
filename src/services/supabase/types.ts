export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      all_ingredients: {
        Row: {
          amount: Json
          comment: Json
          id: number
          name: Json
          recipe_id: number
          url: string
        }
        Insert: {
          amount: Json
          comment: Json
          id?: number
          name: Json
          recipe_id: number
          url?: string
        }
        Update: {
          amount?: Json
          comment?: Json
          id?: number
          name?: Json
          recipe_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "all_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      all_meals: {
        Row: {
          hour_end: number | null
          hour_start: number | null
          id: number
          name: Json
          order: number
        }
        Insert: {
          hour_end?: number | null
          hour_start?: number | null
          id?: number
          name: Json
          order?: number
        }
        Update: {
          hour_end?: number | null
          hour_start?: number | null
          id?: number
          name?: Json
          order?: number
        }
        Relationships: []
      }
      all_measures: {
        Row: {
          allow_client: boolean
          description: Json | null
          id: number
          imageUrl: string | null
          name: Json | null
          units: Json | null
        }
        Insert: {
          allow_client?: boolean
          description?: Json | null
          id?: number
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Update: {
          allow_client?: boolean
          description?: Json | null
          id?: number
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Relationships: []
      }
      all_nutritionist: {
        Row: {
          created_at: string
          name: string
          nutri_id: string
        }
        Insert: {
          created_at?: string
          name?: string
          nutri_id: string
        }
        Update: {
          created_at?: string
          name?: string
          nutri_id?: string
        }
        Relationships: []
      }
      all_race_landmarks: {
        Row: {
          id: number
          name: Json
          url: string
        }
        Insert: {
          id?: number
          name: Json
          url?: string
        }
        Update: {
          id?: number
          name?: Json
          url?: string
        }
        Relationships: []
      }
      all_recipes: {
        Row: {
          description: Json | null
          id: number
          name: Json | null
          type_id: number
          url: string
        }
        Insert: {
          description?: Json | null
          id?: number
          name?: Json | null
          type_id: number
          url?: string
        }
        Update: {
          description?: Json | null
          id?: number
          name?: Json | null
          type_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "all_recipes_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
        ]
      }
      all_users: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string
          goal: string
          health_consent_at: string | null
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          prefered_language: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string
          gender?: string
          goal?: string
          health_consent_at?: string | null
          invitation_code?: string
          last_seen?: string | null
          name?: string
          nutri_id?: string | null
          phone?: string
          prefered_language?: string
          user_id?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string
          gender?: string
          goal?: string
          health_consent_at?: string | null
          invitation_code?: string
          last_seen?: string | null
          name?: string
          nutri_id?: string | null
          phone?: string
          prefered_language?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "all_users_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
        ]
      }
      all_videos: {
        Row: {
          description: string
          id: number
          name: string
          updated: string
          url: string
        }
        Insert: {
          description?: string
          id?: number
          name: string
          updated?: string
          url: string
        }
        Update: {
          description?: string
          id?: number
          name?: string
          updated?: string
          url?: string
        }
        Relationships: []
      }
      appointment_points: {
        Row: {
          appointment_id: number
          client_theme_id: number | null
          id: number
          point: string
          position: number
          theme_point_id: number | null
          treated_at: string | null
        }
        Insert: {
          appointment_id: number
          client_theme_id?: number | null
          id?: number
          point: string
          position?: number
          theme_point_id?: number | null
          treated_at?: string | null
        }
        Update: {
          appointment_id?: number
          client_theme_id?: number | null
          id?: number
          point?: string
          position?: number
          theme_point_id?: number | null
          treated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_points_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_points_client_theme_id_fkey"
            columns: ["client_theme_id"]
            isOneToOne: false
            referencedRelation: "client_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_points_theme_point_id_fkey"
            columns: ["theme_point_id"]
            isOneToOne: false
            referencedRelation: "appointment_theme_points"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_theme_points: {
        Row: {
          id: number
          in_days: number
          point: string
          theme_id: number
        }
        Insert: {
          id?: number
          in_days: number
          point: string
          theme_id: number
        }
        Update: {
          id?: number
          in_days?: number
          point?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appointment_theme_points_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointment_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: number
          note: string
          nutri_id: string
          user_id: string
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          note: string
          nutri_id?: string
          user_id: string
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          note?: string
          nutri_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "client_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      client_themes: {
        Row: {
          created_at: string
          id: number
          nutri_id: string
          start_date: string
          theme_id: number | null
          theme_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          nutri_id?: string
          start_date: string
          theme_id?: number | null
          theme_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          nutri_id?: string
          start_date?: string
          theme_id?: number | null
          theme_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_themes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "client_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointment_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      nutri_appointment_themes: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean
          name: string
          nutri_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          name: string
          nutri_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          name?: string
          nutri_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutri_appointment_themes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
        ]
      }
      nutri_appointments: {
        Row: {
          created_at: string
          description: string | null
          id: number
          nutri_id: string
          scheduled_on: string | null
          start_time: string | null
          status: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          nutri_id?: string
          scheduled_on?: string | null
          start_time?: string | null
          status?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          nutri_id?: string
          scheduled_on?: string | null
          start_time?: string | null
          status?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutri_appointments_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "nutri_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      nutri_race_ingredients: {
        Row: {
          caffeine_amount: number | null
          created_at: string
          hc_amount: number | null
          id: number
          is_deleted: boolean
          liquid_amount: number | null
          name: string
          nutri_id: string
          sodium_amount: number | null
        }
        Insert: {
          caffeine_amount?: number | null
          created_at?: string
          hc_amount?: number | null
          id?: number
          is_deleted?: boolean
          liquid_amount?: number | null
          name: string
          nutri_id?: string
          sodium_amount?: number | null
        }
        Update: {
          caffeine_amount?: number | null
          created_at?: string
          hc_amount?: number | null
          id?: number
          is_deleted?: boolean
          liquid_amount?: number | null
          name?: string
          nutri_id?: string
          sodium_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutri_race_ingredients_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
        ]
      }
      nutri_races: {
        Row: {
          created_at: string
          distance_km: number
          gpx_path: string | null
          id: number
          name: string
          nutri_id: string
          race_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distance_km: number
          gpx_path?: string | null
          id?: number
          name: string
          nutri_id?: string
          race_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          distance_km?: number
          gpx_path?: string | null
          id?: number
          name?: string
          nutri_id?: string
          race_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutri_races_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "nutri_races_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      nutri_recipe: {
        Row: {
          nutri_id: string
          rating: number
          recipe_id: number
        }
        Insert: {
          nutri_id?: string
          rating?: number
          recipe_id: number
        }
        Update: {
          nutri_id?: string
          rating?: number
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutri_recipe_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "nutri_recipe_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      race_ingredients: {
        Row: {
          amount: number
          id: number
          ingredient_id: number
          km: number
          km_span: number | null
          race_id: number
        }
        Insert: {
          amount?: number
          id?: number
          ingredient_id: number
          km: number
          km_span?: number | null
          race_id: number
        }
        Update: {
          amount?: number
          id?: number
          ingredient_id?: number
          km?: number
          km_span?: number | null
          race_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "race_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "nutri_race_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_ingredients_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "nutri_races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_landmarks: {
        Row: {
          id: number
          km: number
          landmark_id: number
          name: string
          race_id: number
        }
        Insert: {
          id?: number
          km: number
          landmark_id: number
          name?: string
          race_id: number
        }
        Update: {
          id?: number
          km?: number
          landmark_id?: number
          name?: string
          race_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "race_landmarks_landmark_id_fkey"
            columns: ["landmark_id"]
            isOneToOne: false
            referencedRelation: "all_race_landmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_landmarks_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "nutri_races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_steps: {
        Row: {
          aprox_time_start: string | null
          elevation_gain: number | null
          elevation_loss: number | null
          km_start: number
          max_altitude: number | null
          max_altitude_at: number | null
          min_altitude: number | null
          min_altitude_at: number | null
          race_id: number
        }
        Insert: {
          aprox_time_start?: string | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          km_start: number
          max_altitude?: number | null
          max_altitude_at?: number | null
          min_altitude?: number | null
          min_altitude_at?: number | null
          race_id: number
        }
        Update: {
          aprox_time_start?: string | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          km_start?: number
          max_altitude?: number | null
          max_altitude_at?: number | null
          min_altitude?: number | null
          min_altitude_at?: number | null
          race_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "race_steps_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "nutri_races"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_type: {
        Row: {
          comment: Json | null
          fat: number
          hc: number
          id: number
          kcal: number
          name: Json | null
          prot: number
        }
        Insert: {
          comment?: Json | null
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          name?: Json | null
          prot?: number
        }
        Update: {
          comment?: Json | null
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          name?: Json | null
          prot?: number
        }
        Relationships: []
      }
      recipe_type_custom: {
        Row: {
          amount: number
          relation: number
          type_id: number
        }
        Insert: {
          amount?: number
          relation: number
          type_id: number
        }
        Update: {
          amount?: number
          relation?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_type_custom_relation_fkey"
            columns: ["relation"]
            isOneToOne: false
            referencedRelation: "recipe_type_custom_relation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_type_custom_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_type_custom_ingredients: {
        Row: {
          id: number
          name: Json | null
          relation: number | null
        }
        Insert: {
          id?: number
          name?: Json | null
          relation?: number | null
        }
        Update: {
          id?: number
          name?: Json | null
          relation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_type_custom_ingredients_relation_fkey"
            columns: ["relation"]
            isOneToOne: false
            referencedRelation: "recipe_type_custom_relation"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_type_custom_relation: {
        Row: {
          id: number
          macro_type: string | null
          meal_type: string | null
        }
        Insert: {
          id?: number
          macro_type?: string | null
          meal_type?: string | null
        }
        Update: {
          id?: number
          macro_type?: string | null
          meal_type?: string | null
        }
        Relationships: []
      }
      stripe_seat_sync_queue: {
        Row: {
          attempts: number
          dirty_at: string
          next_attempt_at: string
          nutri_id: string
          request_id: number | null
          taken_at: string | null
        }
        Insert: {
          attempts?: number
          dirty_at?: string
          next_attempt_at?: string
          nutri_id: string
          request_id?: number | null
          taken_at?: string | null
        }
        Update: {
          attempts?: number
          dirty_at?: string
          next_attempt_at?: string
          nutri_id?: string
          request_id?: number | null
          taken_at?: string | null
        }
        Relationships: []
      }
      user_appointment_points: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: number
          nutri_id: string
          point: string
          position: number
          treated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          nutri_id: string
          point: string
          position?: number
          treated_at?: string | null
          user_id?: string
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          nutri_id?: string
          point?: string
          position?: number
          treated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_appointment_points_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_appointment_points_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "user_appointment_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_invitation: {
        Row: {
          client_id: string
          created_at: string
          expires_at: string
          message: string
          nutri_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          expires_at?: string
          message?: string
          nutri_id?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          expires_at?: string
          message?: string
          nutri_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitation_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_invitation_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
        ]
      }
      user_measures: {
        Row: {
          date: string
          measure_id: number
          user_id: string
          value: number
        }
        Insert: {
          date?: string
          measure_id: number
          user_id: string
          value: number
        }
        Update: {
          date?: string
          measure_id?: number
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_measures_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "all_measures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_measures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_planing: {
        Row: {
          comment: string
          date: string
          event: string
          training_hc: number[]
          training_kcal: number
          user_id: string
        }
        Insert: {
          comment?: string
          date: string
          event?: string
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Update: {
          comment?: string
          date?: string
          event?: string
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_planing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_planing_meal: {
        Row: {
          date: string
          meal_id: number
          recipe_id: number | null
          type_id: number
          user_id: string
        }
        Insert: {
          date: string
          meal_id: number
          recipe_id?: number | null
          type_id: number
          user_id: string
        }
        Update: {
          date?: string
          meal_id?: number
          recipe_id?: number | null
          type_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_planing_meal_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "all_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_meal_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_meal_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_meal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_preset: {
        Row: {
          comment: string
          id: number
          name: string
          training_hc: number[]
          user_id: string
        }
        Insert: {
          comment?: string
          id?: number
          name: string
          training_hc: number[]
          user_id: string
        }
        Update: {
          comment?: string
          id?: number
          name?: string
          training_hc?: number[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preset_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_preset_meal: {
        Row: {
          meal_id: number
          preset_id: number
          type_id: number
        }
        Insert: {
          meal_id: number
          preset_id: number
          type_id: number
        }
        Update: {
          meal_id?: number
          preset_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_preset_meal_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "all_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preset_meal_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "user_preset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preset_meal_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipe: {
        Row: {
          rating: number
          recipe_id: number
          times_interacted: number
          times_used: number
          user_id: string
        }
        Insert: {
          rating?: number
          recipe_id: number
          times_interacted?: number
          times_used?: number
          user_id?: string
        }
        Update: {
          rating?: number
          recipe_id?: number
          times_interacted?: number
          times_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recipe_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recipe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { p_nutri_id: string }
        Returns: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string
          goal: string
          health_consent_at: string | null
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          prefered_language: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "all_users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      assign_appointment_theme: {
        Args: { p_start_date: string; p_theme_id: number; p_user_id: string }
        Returns: number
      }
      clone_week_planing: {
        Args: { p_from_monday: string; p_to_monday: string; p_user_id: string }
        Returns: undefined
      }
      delete_expired_invitations: { Args: never; Returns: number }
      detach_client: {
        Args: { p_nutri_id: string; p_user_id: string }
        Returns: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string
          goal: string
          health_consent_at: string | null
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          prefered_language: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "all_users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      generate_meal_types_for_day: {
        Args: {
          p_changable_meal_ids: number[]
          p_date: string
          p_seed: number
          p_target_kcal?: number
          p_training_kcal: number
          p_user_id: string
        }
        Returns: {
          date: string
          meal_id: number
          recipe_id: number | null
          type_id: number
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "user_planing_meal"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_bmr: {
        Args: { end_date: string; start_date: string; user_uuid: string }
        Returns: number
      }
      get_top_recipes_for_type: {
        Args: {
          p_lang: string
          p_search?: string
          p_type_id: number
          p_user_id: string
        }
        Returns: {
          id: number
          name: string
          nutri_rating: number
          score: number
          times_interacted: number
          times_used: number
          type_id: number
          user_rating: number
        }[]
      }
      get_weight: {
        Args: { end_date: string; start_date: string; user_uuid: string }
        Returns: number
      }
      has_active_subscription: { Args: never; Returns: boolean }
      has_appointment_access: {
        Args: { p_appointment_id: number }
        Returns: boolean
      }
      has_nutri_race_assigned: {
        Args: { p_nutri_id: string }
        Returns: boolean
      }
      has_race_access: { Args: { p_race_id: number }; Returns: boolean }
      invite_client: {
        Args: { p_code: string; p_message: string }
        Returns: string
      }
      is_appointment_editor: {
        Args: { p_appointment_id: number }
        Returns: boolean
      }
      is_race_owner: { Args: { p_race_id: number }; Returns: boolean }
      leave_nutritionist: {
        Args: never
        Returns: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string
          goal: string
          health_consent_at: string | null
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          prefered_language: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "all_users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      nutri_active_subscriptions: {
        Args: { p_nutri_id: string }
        Returns: {
          created: number
          customer_id: string
          subscription_id: string
        }[]
      }
      nutri_has_active_subscription: {
        Args: { p_nutri_id: string }
        Returns: boolean
      }
      nutri_stripe_customer_id: {
        Args: { p_nutri_id: string }
        Returns: string
      }
      process_stripe_seat_sync_queue: { Args: never; Returns: number }
      race_image_race_id: { Args: { p_name: string }; Returns: number }
      remove_client: {
        Args: { p_user_id: string }
        Returns: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string
          goal: string
          health_consent_at: string | null
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          prefered_language: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "all_users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      save_race_plan: {
        Args: {
          p_distance_km: number
          p_gpx_path?: string
          p_id?: number
          p_ingredients?: Database["public"]["CompositeTypes"]["race_ingredient_input"][]
          p_landmarks?: Database["public"]["CompositeTypes"]["race_landmark_input"][]
          p_name: string
          p_race_date: string
          p_steps?: Database["public"]["CompositeTypes"]["race_step_input"][]
          p_user_id: string
        }
        Returns: number
      }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      race_ingredient_input: {
        ingredient_id: number | null
        km: number | null
        amount: number | null
        km_span: number | null
      }
      race_landmark_input: {
        landmark_id: number | null
        km: number | null
        name: string | null
      }
      race_step_input: {
        km_start: number | null
        min_altitude: number | null
        min_altitude_at: number | null
        max_altitude: number | null
        max_altitude_at: number | null
        elevation_gain: number | null
        elevation_loss: number | null
        aprox_time_start: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
