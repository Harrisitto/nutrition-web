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
      all_brands: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      all_errors: {
        Row: {
          cause: string
          code: number
          created_at: string
          function: string
          id: number
        }
        Insert: {
          cause: string
          code?: number
          created_at?: string
          function: string
          id?: number
        }
        Update: {
          cause?: string
          code?: number
          created_at?: string
          function?: string
          id?: number
        }
        Relationships: []
      }
      all_macros: {
        Row: {
          fat: number
          hc: number
          id: number
          kcal: number
          prot: number
        }
        Insert: {
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          prot?: number
        }
        Update: {
          fat?: number
          hc?: number
          id?: number
          kcal?: number
          prot?: number
        }
        Relationships: []
      }
      all_meals: {
        Row: {
          id: number
          name: Json
          order: number
        }
        Insert: {
          id?: number
          name: Json
          order?: number
        }
        Update: {
          id?: number
          name?: Json
          order?: number
        }
        Relationships: []
      }
      all_measures: {
        Row: {
          description: Json | null
          id: number
          name: Json | null
          units: Json | null
        }
        Insert: {
          description?: Json | null
          id?: number
          name?: Json | null
          units?: Json | null
        }
        Update: {
          description?: Json | null
          id?: number
          name?: Json | null
          units?: Json | null
        }
        Relationships: []
      }
      all_recipes: {
        Row: {
          description: Json | null
          id: number
          ingredients: Json | null
          name: Json | null
          type_id: number | null
          url: string
        }
        Insert: {
          description?: Json | null
          id?: number
          ingredients?: Json | null
          name?: Json | null
          type_id?: number | null
          url?: string
        }
        Update: {
          description?: Json | null
          id?: number
          ingredients?: Json | null
          name?: Json | null
          type_id?: number | null
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
          brand_id: string | null
          created_at: string
          is_nutritionist: boolean
          is_owner: boolean
          nutri_id: string | null
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          is_nutritionist?: boolean
          is_owner?: boolean
          nutri_id?: string | null
          user_id?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          is_nutritionist?: boolean
          is_owner?: boolean
          nutri_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "all_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      all_videos: {
        Row: {
          description: string
          id: number
          lang: string
          name: string
          url: string
          user_id: string | null
        }
        Insert: {
          description?: string
          id?: number
          lang?: string
          name: string
          url: string
          user_id?: string | null
        }
        Update: {
          description?: string
          id?: number
          lang?: string
          name?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "all_videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      brand_info: {
        Row: {
          brand_id: string
          description: string
          email: string
          location: string
          logo_url: string | null
          name: string
          phone_number: string
          social_media_url: string
          web_url: string
        }
        Insert: {
          brand_id: string
          description?: string
          email?: string
          location?: string
          logo_url?: string | null
          name?: string
          phone_number?: string
          social_media_url?: string
          web_url?: string
        }
        Update: {
          brand_id?: string
          description?: string
          email?: string
          location?: string
          logo_url?: string | null
          name?: string
          phone_number?: string
          social_media_url?: string
          web_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_info_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: true
            referencedRelation: "all_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_type: {
        Row: {
          id: number
          macros_id: number | null
          name: Json | null
        }
        Insert: {
          id?: number
          macros_id?: number | null
          name?: Json | null
        }
        Update: {
          id?: number
          macros_id?: number | null
          name?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "food_types_macros_id_fkey"
            columns: ["macros_id"]
            isOneToOne: false
            referencedRelation: "all_macros"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_type_meal: {
        Row: {
          meal_id: number
          type_id: number
        }
        Insert: {
          meal_id: number
          type_id: number
        }
        Update: {
          meal_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_receipts_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "all_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_receipts_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "recipe_type"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_policies: {
        Row: {
          condition: string
          description: string | null
          id: number
          operation: string
          policy_name: string
          role: string | null
          table_name: string
        }
        Insert: {
          condition: string
          description?: string | null
          id?: number
          operation: string
          policy_name: string
          role?: string | null
          table_name: string
        }
        Update: {
          condition?: string
          description?: string | null
          id?: number
          operation?: string
          policy_name?: string
          role?: string | null
          table_name?: string
        }
        Relationships: []
      }
      user_info: {
        Row: {
          birth_date: string | null
          name: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          name?: string
          user_id?: string
        }
        Update: {
          birth_date?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "all_users"
            referencedColumns: ["user_id"]
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
          date: string
          id: number
          training_hc: number[]
          training_kcal: number
          user_id: string
        }
        Insert: {
          date: string
          id?: number
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Update: {
          date?: string
          id?: number
          training_hc?: number[]
          training_kcal?: number
          user_id?: string
        }
        Relationships: []
      }
      user_planing_meal: {
        Row: {
          meal_id: number
          planing_id: number
          type_id: number
        }
        Insert: {
          meal_id: number
          planing_id: number
          type_id: number
        }
        Update: {
          meal_id?: number
          planing_id?: number
          type_id?: number
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      rls_apply_policy: {
        Args: {
          p_condition: string
          p_operation: string
          p_policy: string
          p_role?: string
          p_table: string
        }
        Returns: undefined
      }
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
