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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string
          duration_min: number
          id: number
          intensity: string | null
          logged_at: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_min: number
          id?: never
          intensity?: string | null
          logged_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_min?: number
          id?: never
          intensity?: string | null
          logged_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_screens: {
        Row: {
          description: string
          flow_id: string
          flow_name: string
          fr_refs: string[]
          id: number
          screen_order: number
          slug: string
          title: string
        }
        Insert: {
          description: string
          flow_id: string
          flow_name: string
          fr_refs?: string[]
          id?: never
          screen_order: number
          slug: string
          title: string
        }
        Update: {
          description?: string
          flow_id?: string
          flow_name?: string
          fr_refs?: string[]
          id?: never
          screen_order?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          created_at: string
          id: number
          measured_on: string
          user_id: string
          waist_cm: number | null
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: never
          measured_on: string
          user_id: string
          waist_cm?: number | null
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: never
          measured_on?: string
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number
        }
        Relationships: []
      }
      consents: {
        Row: {
          granted_at: string
          id: number
          policy_version: string
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          id?: never
          policy_version: string
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          id?: never
          policy_version?: string
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          calories: number
          carbs: number
          category: string
          default_grams: number | null
          emoji: string
          fat: number
          fiber: number
          gi: number | null
          id: number
          name: string
          protein: number
          unit_label: string | null
        }
        Insert: {
          calories: number
          carbs?: number
          category: string
          default_grams?: number | null
          emoji?: string
          fat?: number
          fiber?: number
          gi?: number | null
          id?: never
          name: string
          protein?: number
          unit_label?: string | null
        }
        Update: {
          calories?: number
          carbs?: number
          category?: string
          default_grams?: number | null
          emoji?: string
          fat?: number
          fiber?: number
          gi?: number | null
          id?: never
          name?: string
          protein?: number
          unit_label?: string | null
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          confidence: number | null
          food_id: number
          id: number
          meal_id: number
          portion_grams: number
          user_corrected: boolean
        }
        Insert: {
          confidence?: number | null
          food_id: number
          id?: never
          meal_id: number
          portion_grams: number
          user_corrected?: boolean
        }
        Update: {
          confidence?: number | null
          food_id?: number
          id?: never
          meal_id?: number
          portion_grams?: number
          user_corrected?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          confidence: number | null
          created_at: string
          detection_source: string
          id: number
          logged_at: string
          meal_type: string
          note: string | null
          photo_label: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          detection_source?: string
          id?: never
          logged_at?: string
          meal_type: string
          note?: string | null
          photo_label?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          detection_source?: string
          id?: never
          logged_at?: string
          meal_type?: string
          note?: string | null
          photo_label?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plan_tiers: {
        Row: {
          code: string
          created_at: string
          features: string[]
          id: number
          is_featured: boolean
          name: string
          price_idr: number
          tagline: string
        }
        Insert: {
          code: string
          created_at?: string
          features?: string[]
          id?: never
          is_featured?: boolean
          name: string
          price_idr?: number
          tagline: string
        }
        Update: {
          code?: string
          created_at?: string
          features?: string[]
          id?: never
          is_featured?: boolean
          name?: string
          price_idr?: number
          tagline?: string
        }
        Relationships: []
      }
      portion_recommendations: {
        Row: {
          calorie_target: number
          created_at: string
          id: number
          rationale: string
          session_type: string
          sort_order: number
          target_grams: number
          user_id: string
        }
        Insert: {
          calorie_target: number
          created_at?: string
          id?: never
          rationale: string
          session_type: string
          sort_order?: number
          target_grams: number
          user_id: string
        }
        Update: {
          calorie_target?: number
          created_at?: string
          id?: never
          rationale?: string
          session_type?: string
          sort_order?: number
          target_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_idr: number
          created_at: string
          email: string
          id: number
          name: string | null
          phone: string | null
          product: string | null
          provider: string
          provider_ref: string | null
          purchased_at: string
          status: string
          tokens_granted: number
          user_id: string | null
        }
        Insert: {
          amount_idr?: number
          created_at?: string
          email: string
          id?: never
          name?: string | null
          phone?: string | null
          product?: string | null
          provider?: string
          provider_ref?: string | null
          purchased_at?: string
          status?: string
          tokens_granted?: number
          user_id?: string | null
        }
        Update: {
          amount_idr?: number
          created_at?: string
          email?: string
          id?: never
          name?: string | null
          phone?: string | null
          product?: string | null
          provider?: string
          provider_ref?: string | null
          purchased_at?: string
          status?: string
          tokens_granted?: number
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: number
          plan: string
          price_idr: number
          provider: string
          provider_ref: string | null
          renews_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          plan: string
          price_idr?: number
          provider?: string
          provider_ref?: string | null
          renews_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          plan?: string
          price_idr?: number
          provider?: string
          provider_ref?: string | null
          renews_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      token_ledger: {
        Row: {
          created_at: string
          delta: number
          email: string
          id: number
          note: string | null
          provider: string
          provider_ref: string | null
          reason: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delta: number
          email: string
          id?: never
          note?: string | null
          provider?: string
          provider_ref?: string | null
          reason?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delta?: number
          email?: string
          id?: never
          note?: string | null
          provider?: string
          provider_ref?: string | null
          reason?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string
          diet_pref: string | null
          email: string
          gender: string | null
          goal: string | null
          height_cm: number | null
          insulin_sensitivity: string | null
          medical_note: string | null
          metabolic_score: number | null
          name: string
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          diet_pref?: string | null
          email: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          insulin_sensitivity?: string | null
          medical_note?: string | null
          metabolic_score?: number | null
          name: string
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          diet_pref?: string | null
          email?: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          insulin_sensitivity?: string | null
          medical_note?: string | null
          metabolic_score?: number | null
          name?: string
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      token_balances: {
        Row: {
          balance: number | null
          email: string | null
          last_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
