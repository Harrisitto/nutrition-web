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
          invitation_code: string
          last_seen: string | null
          name: string
          nutri_id: string | null
          phone: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string
          gender?: string
          goal?: string
          invitation_code?: string
          last_seen?: string | null
          name?: string
          nutri_id?: string | null
          phone?: string
          user_id?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string
          gender?: string
          goal?: string
          invitation_code?: string
          last_seen?: string | null
          name?: string
          nutri_id?: string | null
          phone?: string
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
          id: number
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
      user_invitation: {
        Row: {
          client_id: string
          created_at: string
          message: string
          nutri_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          message?: string
          nutri_id?: string
        }
        Update: {
          client_id?: string
          created_at?: string
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
          id: number
          training_hc: number[]
          training_kcal: number
          user_id: string
        }
        Insert: {
          comment?: string
          date: string
          event?: string
          id?: number
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Update: {
          comment?: string
          date?: string
          event?: string
          id?: number
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
          date: string | null
          meal_id: number
          planing_id: number
          recipe_id: number | null
          type_id: number
          user_id: string | null
        }
        Insert: {
          date?: string | null
          meal_id: number
          planing_id: number
          recipe_id?: number | null
          type_id: number
          user_id?: string | null
        }
        Update: {
          date?: string | null
          meal_id?: number
          planing_id?: number
          recipe_id?: number | null
          type_id?: number
          user_id?: string | null
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
            foreignKeyName: "user_planing_meal_planing_id_fkey"
            columns: ["planing_id"]
            isOneToOne: false
            referencedRelation: "user_planing"
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
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
