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
          cooked_amount: Json | null
          id: number
          name: Json
          recipe_id: number
          url: string
        }
        Insert: {
          amount: Json
          comment: Json
          cooked_amount?: Json | null
          id?: number
          name: Json
          recipe_id: number
          url?: string
        }
        Update: {
          amount?: Json
          comment?: Json
          cooked_amount?: Json | null
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
      all_recipe_groups: {
        Row: {
          comment: Json
          id: number
        }
        Insert: {
          comment?: Json
          id?: number
        }
        Update: {
          comment?: Json
          id?: number
        }
        Relationships: []
      }
      all_recipe_tags: {
        Row: {
          id: number
          recipe_description: Json
          recipe_name: Json
          user_description: Json
          user_name: Json
        }
        Insert: {
          id?: number
          recipe_description: Json
          recipe_name: Json
          user_description: Json
          user_name: Json
        }
        Update: {
          id?: number
          recipe_description?: Json
          recipe_name?: Json
          user_description?: Json
          user_name?: Json
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
          document_id: string | null
          group_name: string | null
          id: number
          in_days: number
          point: string
          theme_id: number
        }
        Insert: {
          document_id?: string | null
          group_name?: string | null
          id?: number
          in_days: number
          point: string
          theme_id: number
        }
        Update: {
          document_id?: string | null
          group_name?: string | null
          id?: number
          in_days?: number
          point?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appointment_theme_points_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "client_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_theme_points_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutri_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_theme_points_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutritionist_documents"
            referencedColumns: ["id"]
          },
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
          priority: number
          scheduled_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          note: string
          nutri_id?: string
          priority?: number
          scheduled_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          note?: string
          nutri_id?: string
          priority?: number
          scheduled_date?: string | null
          status?: string | null
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
            foreignKeyName: "client_notes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "client_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
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
            foreignKeyName: "client_themes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "client_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_recipe_ingredients: {
        Row: {
          amount: number
          custom_recipe_id: number
          ingredient_id: number
        }
        Insert: {
          amount?: number
          custom_recipe_id: number
          ingredient_id: number
        }
        Update: {
          amount?: number
          custom_recipe_id?: number
          ingredient_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "custom_recipe_ingredients_custom_recipe_id_fkey"
            columns: ["custom_recipe_id"]
            isOneToOne: false
            referencedRelation: "custom_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "recipe_type_custom_ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_recipes: {
        Row: {
          description: string | null
          id: number
          name: string
          owner_id: string
          type_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          owner_id?: string
          type_id?: number
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          owner_id?: string
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "custom_recipes_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
        ]
      }
      nutri_appointment_documents: {
        Row: {
          appointment_id: number
          created_at: string
          document_id: string
        }
        Insert: {
          appointment_id: number
          created_at?: string
          document_id: string
        }
        Update: {
          appointment_id?: number
          created_at?: string
          document_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutri_appointment_documents_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "nutri_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutri_appointment_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "client_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutri_appointment_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutri_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutri_appointment_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutritionist_documents"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "nutri_appointment_themes_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
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
            foreignKeyName: "nutri_appointments_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutri_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "nutri_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutri_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
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
            foreignKeyName: "nutri_recipe_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
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
      recipe_groups: {
        Row: {
          group_id: number
          recipe_id: number
        }
        Insert: {
          group_id: number
          recipe_id: number
        }
        Update: {
          group_id?: number
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "all_recipe_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_groups_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_tags: {
        Row: {
          recipe_id: number
          tag_id: number
        }
        Insert: {
          recipe_id: number
          tag_id: number
        }
        Update: {
          recipe_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "all_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "all_recipe_tags"
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
          amount: number
          cooked_amount: number | null
          error_to_grams: number
          fat: number
          hc: number
          id: number
          kcal: number
          min_step: number
          name: Json | null
          prot: number
          relation: number | null
          to_grams: number
          units: Json
        }
        Insert: {
          amount?: number
          cooked_amount?: number | null
          error_to_grams?: number
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          min_step?: number
          name?: Json | null
          prot?: number
          relation?: number | null
          to_grams?: number
          units?: Json
        }
        Update: {
          amount?: number
          cooked_amount?: number | null
          error_to_grams?: number
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          min_step?: number
          name?: Json | null
          prot?: number
          relation?: number | null
          to_grams?: number
          units?: Json
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
          fat: number
          hc: number
          id: number
          macro_type: string | null
          meal_type: string | null
          name: Json
          prot: number
        }
        Insert: {
          fat?: number
          hc?: number
          id?: number
          macro_type?: string | null
          meal_type?: string | null
          name?: Json
          prot?: number
        }
        Update: {
          fat?: number
          hc?: number
          id?: number
          macro_type?: string | null
          meal_type?: string | null
          name?: Json
          prot?: number
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
            foreignKeyName: "user_appointment_points_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_appointment_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_appointment_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_appointment_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_food_tags: {
        Row: {
          tag_id: number
          user_id: string
        }
        Insert: {
          tag_id: number
          user_id: string
        }
        Update: {
          tag_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_food_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "all_recipe_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_food_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_food_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_food_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_planing: {
        Row: {
          comment: string
          custom_url: string | null
          date: string
          document_id: string | null
          event: string
          training_hc: number[]
          training_kcal: number
          user_id: string
        }
        Insert: {
          comment?: string
          custom_url?: string | null
          date: string
          document_id?: string | null
          event?: string
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Update: {
          comment?: string
          custom_url?: string | null
          date?: string
          document_id?: string | null
          event?: string
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_planing_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "client_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutri_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "nutritionist_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_planing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_planing_meal: {
        Row: {
          date: string
          is_fixed_recipe: boolean
          meal_id: number
          recipe_comment: string | null
          recipe_id: number | null
          type_id: number
          user_id: string
        }
        Insert: {
          date: string
          is_fixed_recipe?: boolean
          meal_id: number
          recipe_comment?: string | null
          recipe_id?: number | null
          type_id: number
          user_id: string
        }
        Update: {
          date?: string
          is_fixed_recipe?: boolean
          meal_id?: number
          recipe_comment?: string | null
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
          {
            foreignKeyName: "user_planing_meal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_meal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_planing_meal_ingredients: {
        Row: {
          amount: number
          date: string
          id: number
          ingredient_id: number
          meal_id: number
          user_id: string
        }
        Insert: {
          amount?: number
          date: string
          id?: number
          ingredient_id: number
          meal_id: number
          user_id: string
        }
        Update: {
          amount?: number
          date?: string
          id?: number
          ingredient_id?: number
          meal_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_planing_meal_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "recipe_type_custom_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_planing_meal_ingredients_meal_fkey"
            columns: ["meal_id", "user_id", "date"]
            isOneToOne: false
            referencedRelation: "user_planing_meal"
            referencedColumns: ["meal_id", "user_id", "date"]
          },
        ]
      }
      user_preset: {
        Row: {
          comment: string
          id: number
          name: string
          nutri_id: string
          training_hc: number[]
          user_id: string | null
        }
        Insert: {
          comment?: string
          id?: number
          name: string
          nutri_id: string
          training_hc: number[]
          user_id?: string | null
        }
        Update: {
          comment?: string
          id?: number
          name?: string
          nutri_id?: string
          training_hc?: number[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preset_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "all_nutritionist"
            referencedColumns: ["nutri_id"]
          },
          {
            foreignKeyName: "user_preset_nutri_id_fkey"
            columns: ["nutri_id"]
            isOneToOne: false
            referencedRelation: "nutri_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preset_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_preset_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preset_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "user_recipe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recipe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nutri_clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      all_measures: {
        Row: {
          allow_client: boolean | null
          description: Json | null
          id: number | null
          imageUrl: string | null
          name: Json | null
          units: Json | null
        }
        Insert: {
          allow_client?: boolean | null
          description?: Json | null
          id?: number | null
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Update: {
          allow_client?: boolean | null
          description?: Json | null
          id?: number | null
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Relationships: []
      }
      all_nutritionist: {
        Row: {
          created_at: string | null
          name: string | null
          nutri_id: string | null
        }
        Insert: {
          created_at?: string | null
          name?: string | null
          nutri_id?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string | null
          nutri_id?: string | null
        }
        Relationships: []
      }
      all_race_landmarks: {
        Row: {
          id: number | null
          name: Json | null
          url: string | null
        }
        Insert: {
          id?: number | null
          name?: Json | null
          url?: string | null
        }
        Update: {
          id?: number | null
          name?: Json | null
          url?: string | null
        }
        Relationships: []
      }
      all_users: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          user_id: string | null
        }
        Relationships: []
      }
      all_videos: {
        Row: {
          description: string | null
          id: number | null
          name: string | null
          nutri_id: string | null
          updated: string | null
          url: string | null
        }
        Insert: {
          description?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          updated?: string | null
          url?: string | null
        }
        Update: {
          description?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          updated?: string | null
          url?: string | null
        }
        Relationships: []
      }
      catalog_measurements: {
        Row: {
          allow_client: boolean | null
          description: Json | null
          id: number | null
          imageUrl: string | null
          name: Json | null
          units: Json | null
        }
        Insert: {
          allow_client?: boolean | null
          description?: Json | null
          id?: number | null
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Update: {
          allow_client?: boolean | null
          description?: Json | null
          id?: number | null
          imageUrl?: string | null
          name?: Json | null
          units?: Json | null
        }
        Relationships: []
      }
      catalog_race_landmarks: {
        Row: {
          id: number | null
          name: Json | null
          url: string | null
        }
        Insert: {
          id?: number | null
          name?: Json | null
          url?: string | null
        }
        Update: {
          id?: number | null
          name?: Json | null
          url?: string | null
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          extension: string | null
          id: string | null
          mime_type: string | null
          name: string | null
          nutri_id: string | null
          nutri_name: string | null
          path: string | null
          size_bytes: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      client_invitations: {
        Row: {
          client_id: string | null
          created_at: string | null
          expires_at: string | null
          message: string | null
          nutri_id: string | null
          nutri_name: string | null
        }
        Relationships: []
      }
      client_profile: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          id: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          nutri_name: string | null
          phone: string | null
          prefered_language: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      client_race_plans: {
        Row: {
          client_id: string | null
          distance_km: number | null
          id: number | null
          intakes: Json | null
          landmarks: Json | null
          name: string | null
          nutri_id: string | null
          race_date: string | null
          steps: Json | null
        }
        Insert: {
          client_id?: string | null
          distance_km?: number | null
          id?: number | null
          intakes?: never
          landmarks?: never
          name?: string | null
          nutri_id?: string | null
          race_date?: string | null
          steps?: never
        }
        Update: {
          client_id?: string | null
          distance_km?: number | null
          id?: number | null
          intakes?: never
          landmarks?: never
          name?: string | null
          nutri_id?: string | null
          race_date?: string | null
          steps?: never
        }
        Relationships: []
      }
      client_races: {
        Row: {
          client_id: string | null
          created_at: string | null
          distance_km: number | null
          id: number | null
          image_path: string | null
          name: string | null
          nutri_id: string | null
          nutri_name: string | null
          race_date: string | null
          total_hc: number | null
          total_kcal: number | null
        }
        Relationships: []
      }
      client_videos: {
        Row: {
          description: string | null
          id: number | null
          name: string | null
          nutri_id: string | null
          nutri_name: string | null
          updated_at: string | null
          url: string | null
        }
        Relationships: []
      }
      nutri_client_races: {
        Row: {
          client_id: string | null
          client_language: string | null
          client_name: string | null
          created_at: string | null
          distance_km: number | null
          gpx_path: string | null
          id: number | null
          image_path: string | null
          name: string | null
          nutri_id: string | null
          race_date: string | null
          total_hc: number | null
          total_kcal: number | null
        }
        Relationships: []
      }
      nutri_clients: {
        Row: {
          accepted_at: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          id: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      nutri_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          extension: string | null
          id: string | null
          mime_type: string | null
          name: string | null
          nutri_id: string | null
          path: string | null
          size_bytes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          extension?: string | null
          id?: string | null
          mime_type?: string | null
          name?: string | null
          nutri_id?: string | null
          path?: never
          size_bytes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          extension?: string | null
          id?: string | null
          mime_type?: string | null
          name?: string | null
          nutri_id?: string | null
          path?: never
          size_bytes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nutri_invitations: {
        Row: {
          client_id: string | null
          created_at: string | null
          expires_at: string | null
          message: string | null
          nutri_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          message?: string | null
          nutri_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          message?: string | null
          nutri_id?: string | null
        }
        Relationships: []
      }
      nutri_profile: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nutri_race_foods: {
        Row: {
          caffeine_amount: number | null
          created_at: string | null
          hc_amount: number | null
          id: number | null
          image_path: string | null
          is_deleted: boolean | null
          liquid_amount: number | null
          name: string | null
          nutri_id: string | null
          sodium_amount: number | null
        }
        Insert: {
          caffeine_amount?: number | null
          created_at?: string | null
          hc_amount?: number | null
          id?: number | null
          image_path?: never
          is_deleted?: boolean | null
          liquid_amount?: number | null
          name?: string | null
          nutri_id?: string | null
          sodium_amount?: number | null
        }
        Update: {
          caffeine_amount?: number | null
          created_at?: string | null
          hc_amount?: number | null
          id?: number | null
          image_path?: never
          is_deleted?: boolean | null
          liquid_amount?: number | null
          name?: string | null
          nutri_id?: string | null
          sodium_amount?: number | null
        }
        Relationships: []
      }
      nutri_race_ingredients: {
        Row: {
          caffeine_amount: number | null
          created_at: string | null
          hc_amount: number | null
          id: number | null
          is_deleted: boolean | null
          liquid_amount: number | null
          name: string | null
          nutri_id: string | null
          sodium_amount: number | null
        }
        Insert: {
          caffeine_amount?: number | null
          created_at?: string | null
          hc_amount?: number | null
          id?: number | null
          is_deleted?: boolean | null
          liquid_amount?: number | null
          name?: string | null
          nutri_id?: string | null
          sodium_amount?: number | null
        }
        Update: {
          caffeine_amount?: number | null
          created_at?: string | null
          hc_amount?: number | null
          id?: number | null
          is_deleted?: boolean | null
          liquid_amount?: number | null
          name?: string | null
          nutri_id?: string | null
          sodium_amount?: number | null
        }
        Relationships: []
      }
      nutri_race_plans: {
        Row: {
          client_id: string | null
          distance_km: number | null
          gpx_path: string | null
          id: number | null
          intakes: Json | null
          landmarks: Json | null
          name: string | null
          nutri_id: string | null
          race_date: string | null
          steps: Json | null
        }
        Relationships: []
      }
      nutri_races: {
        Row: {
          created_at: string | null
          distance_km: number | null
          gpx_path: string | null
          id: number | null
          name: string | null
          nutri_id: string | null
          race_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          gpx_path?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          race_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          gpx_path?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          race_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nutri_videos: {
        Row: {
          description: string | null
          id: number | null
          name: string | null
          nutri_id: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          description?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          description?: string | null
          id?: number | null
          name?: string | null
          nutri_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      nutritionist_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          extension: string | null
          id: string | null
          mime_type: string | null
          name: string | null
          nutri_id: string | null
          size_bytes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          extension?: string | null
          id?: string | null
          mime_type?: string | null
          name?: string | null
          nutri_id?: string | null
          size_bytes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          extension?: string | null
          id?: string | null
          mime_type?: string | null
          name?: string | null
          nutri_id?: string | null
          size_bytes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      race_ingredients: {
        Row: {
          amount: number | null
          id: number | null
          ingredient_id: number | null
          km: number | null
          km_span: number | null
          race_id: number | null
        }
        Insert: {
          amount?: number | null
          id?: number | null
          ingredient_id?: number | null
          km?: number | null
          km_span?: number | null
          race_id?: number | null
        }
        Update: {
          amount?: number | null
          id?: number | null
          ingredient_id?: number | null
          km?: number | null
          km_span?: number | null
          race_id?: number | null
        }
        Relationships: []
      }
      race_landmarks: {
        Row: {
          id: number | null
          km: number | null
          landmark_id: number | null
          name: string | null
          race_id: number | null
        }
        Insert: {
          id?: number | null
          km?: number | null
          landmark_id?: number | null
          name?: string | null
          race_id?: number | null
        }
        Update: {
          id?: number | null
          km?: number | null
          landmark_id?: number | null
          name?: string | null
          race_id?: number | null
        }
        Relationships: []
      }
      race_steps: {
        Row: {
          aprox_time_start: string | null
          elevation_gain: number | null
          elevation_loss: number | null
          km_start: number | null
          max_altitude: number | null
          max_altitude_at: number | null
          min_altitude: number | null
          min_altitude_at: number | null
          race_id: number | null
        }
        Insert: {
          aprox_time_start?: string | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          km_start?: number | null
          max_altitude?: number | null
          max_altitude_at?: number | null
          min_altitude?: number | null
          min_altitude_at?: number | null
          race_id?: number | null
        }
        Update: {
          aprox_time_start?: string | null
          elevation_gain?: number | null
          elevation_loss?: number | null
          km_start?: number | null
          max_altitude?: number | null
          max_altitude_at?: number | null
          min_altitude?: number | null
          min_altitude_at?: number | null
          race_id?: number | null
        }
        Relationships: []
      }
      recipe_editors: {
        Row: {
          comment: string | null
          created_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_invitation: {
        Row: {
          client_id: string | null
          created_at: string | null
          expires_at: string | null
          message: string | null
          nutri_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          message?: string | null
          nutri_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          message?: string | null
          nutri_id?: string | null
        }
        Relationships: []
      }
      user_measurements: {
        Row: {
          allow_client: boolean | null
          client_id: string | null
          date: string | null
          description: Json | null
          imageUrl: string | null
          measure_id: number | null
          name: Json | null
          units: Json | null
          value: number | null
        }
        Relationships: []
      }
      user_measures: {
        Row: {
          date: string | null
          measure_id: number | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          date?: string | null
          measure_id?: number | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          date?: string | null
          measure_id?: number | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invitation: {
        Args: { p_nutri_id: string }
        Returns: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          user_id: string | null
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
      calculate_macros_for_date_range: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          bmr_kcal: number
          date: string
          final_kcal_balance: number
          total_burning_training_kcal: number
          total_burnt_kcal: number
          total_eating_fat: number
          total_eating_fat_per_kg: number
          total_eating_hc: number
          total_eating_hc_per_kg: number
          total_eating_kcal: number
          total_eating_prot: number
          total_eating_prot_per_kg: number
          total_eating_race_hc: number
          total_eating_race_kcal: number
          total_eating_training_hc: number
          total_intake_kcal: number
          weight_kg: number
        }[]
      }
      calculate_meal_macros_for_date_range: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          date: string
          extra_fat: number
          extra_hc: number
          extra_kcal: number
          extra_prot: number
          fat: number
          hc: number
          kcal: number
          meal_id: number
          prot: number
          recipe_id: number
          type_id: number
        }[]
      }
      can_write_custom_recipes_of: {
        Args: { p_owner_id: string }
        Returns: boolean
      }
      can_write_own_custom_recipes: { Args: never; Returns: boolean }
      check_date_range: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: undefined
      }
      clone_day_planing: {
        Args: { p_from: string; p_to: string; p_user_id: string }
        Returns: undefined
      }
      clone_week_planing: {
        Args: { p_from_monday: string; p_to_monday: string; p_user_id: string }
        Returns: undefined
      }
      copy_planing_meal: {
        Args: {
          p_from_date: string
          p_from_meal: number
          p_to_date: string
          p_to_meal: number
          p_user_id: string
        }
        Returns: undefined
      }
      custom_ingredients_match_type: {
        Args: {
          p_amounts: number[]
          p_ingredient_ids: number[]
          p_type_id: number
        }
        Returns: boolean
      }
      custom_recipe_type_id: { Args: never; Returns: number }
      delete_expired_invitations: { Args: never; Returns: number }
      detach_client: {
        Args: { p_nutri_id: string; p_user_id: string }
        Returns: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          user_id: string | null
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
          p_max_deficit_kcal?: number
          p_new_meal_kcal?: number
          p_new_training_hc?: number[]
          p_new_training_kcal?: number
          p_old_meal_kcal?: number
          p_old_training_hc?: number[]
          p_old_training_kcal?: number
          p_removed_meal_ids?: number[]
          p_seed: number
          p_target_kcal?: number
          p_training_kcal: number
          p_user_id: string
        }
        Returns: {
          date: string
          is_fixed_recipe: boolean
          meal_id: number
          recipe_comment: string | null
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
      get_custom_recipes_for_type: {
        Args: {
          p_after_id?: number
          p_page_size?: number
          p_search?: string
          p_type_id: number
          p_user_id: string
        }
        Returns: {
          description: string
          id: number
          name: string
          owner_id: string
          type_id: number
        }[]
      }
      get_recipe_alternatives: {
        Args: { p_lang: string; p_recipe_id: number; p_user_id: string }
        Returns: {
          id: number
          name: string
          type_id: number
        }[]
      }
      get_top_recipes_for_type: {
        Args: {
          p_after_id?: number
          p_after_score?: number
          p_lang: string
          p_page_size?: number
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
      is_nutritionist_document_owner: {
        Args: { p_document_id: string }
        Returns: boolean
      }
      is_race_owner: { Args: { p_race_id: number }; Returns: boolean }
      is_theme_point_document_of_user: {
        Args: { p_document_id: string }
        Returns: boolean
      }
      leave_nutritionist: {
        Args: never
        Returns: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          user_id: string | null
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
      nutri_unused_gpx: { Args: { p_paths: string[] }; Returns: string[] }
      nutritionist_document_path: {
        Args: {
          p_doc: Database["public"]["Views"]["nutritionist_documents"]["Row"]
        }
        Returns: string
      }
      pick_recipe: {
        Args: {
          p_date: string
          p_group_ids?: number[]
          p_meal_id: number
          p_type_id: number
          p_user_id: string
        }
        Returns: number
      }
      process_stripe_seat_sync_queue: { Args: never; Returns: number }
      race_image_race_id: { Args: { p_name: string }; Returns: number }
      recipe_fits_user: {
        Args: { p_recipe_id: number; p_user_id: string }
        Returns: boolean
      }
      recipe_type_matches_macros: {
        Args: { p_fat: number; p_hc: number; p_prot: number; p_type_id: number }
        Returns: boolean
      }
      remove_client: {
        Args: { p_user_id: string }
        Returns: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          goal: string | null
          health_consent_at: string | null
          invitation_code: string | null
          last_seen: string | null
          name: string | null
          nutri_id: string | null
          phone: string | null
          prefered_language: string | null
          user_id: string | null
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
      scored_search_race_ingredients_for_user: {
        Args: {
          p_caffeine_amount: number
          p_carbs_amount: number
          p_liquid_amount: number
          p_search_text: string
          p_sodium_amount: number
          p_user_id: string
        }
        Returns: {
          caffeine_amount: number
          carbs_amount: number
          id: number
          image_path: string
          liquid_amount: number
          name: string
          score: number
          sodium_amount: number
        }[]
      }
      scored_search_recipe_types_for_client: {
        Args: {
          p_client_id: string
          p_language_code?: string
          p_search_text: string
        }
        Returns: {
          comment: string
          fat: number
          hc: number
          id: number
          kcal: number
          name: string
          prot: number
          score: number
        }[]
      }
      search_documents_for_client_by_date_range: {
        Args: { p_end_date: string; p_name?: string; p_start_date: string }
        Returns: {
          date: string
          document: Json
        }[]
      }
      set_planing_meal_recipe: {
        Args: {
          p_date: string
          p_meal_id: number
          p_recipe_id: number
          p_type_id?: number
        }
        Returns: {
          date: string
          is_fixed_recipe: boolean
          meal_id: number
          recipe_comment: string | null
          recipe_id: number | null
          type_id: number
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_planing_meal"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_user_food_tags: {
        Args: { p_tag_ids: number[]; p_user_id: string }
        Returns: undefined
      }
      stripe_seat_count: { Args: { p_nutri_id: string }; Returns: number }
      unaccent: { Args: { "": string }; Returns: string }
      upsert_custom_recipe: {
        Args: {
          p_description: string
          p_id: number
          p_ingredients: Json
          p_name: string
          p_owner_id: string
          p_type_id?: number
        }
        Returns: number
      }
      user_measurements_upsert: {
        Args: {
          p_client_id: string
          p_date: string
          p_measure_id: number
          p_value: number
        }
        Returns: {
          allow_client: boolean | null
          client_id: string | null
          date: string | null
          description: Json | null
          imageUrl: string | null
          measure_id: number | null
          name: Json | null
          units: Json | null
          value: number | null
        }
        SetofOptions: {
          from: "*"
          to: "user_measurements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
