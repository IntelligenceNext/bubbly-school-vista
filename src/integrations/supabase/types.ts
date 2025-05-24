export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrators: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          last_login: string | null
          phone: string | null
          role: string
          school_id: string | null
          status: string
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          last_login?: string | null
          phone?: string | null
          role: string
          school_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: string
          school_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrators_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          school_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          school_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          school_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hostels: {
        Row: {
          capacity: number
          created_at: string
          description: string
          gender: string
          id: string
          name: string
          school_id: string
          status: string
        }
        Insert: {
          capacity: number
          created_at?: string
          description: string
          gender: string
          id?: string
          name: string
          school_id: string
          status?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string
          gender?: string
          id?: string
          name?: string
          school_id?: string
          status?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string | null
          name: string
          phone: string | null
          priority: string
          school_id: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message?: string | null
          name: string
          phone?: string | null
          priority: string
          school_id: string
          source?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string | null
          name?: string
          phone?: string | null
          priority?: string
          school_id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string
          admins_count: number
          classes_count: number
          code: string | null
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          logo: string | null
          logo_url: string | null
          name: string
          phone: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string
          admins_count?: number
          classes_count?: number
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          logo?: string | null
          logo_url?: string | null
          name: string
          phone?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          admins_count?: number
          classes_count?: number
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          logo?: string | null
          logo_url?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          is_current: boolean | null
          name: string
          school_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          name: string
          school_id: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          name?: string
          school_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          school_id: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          school_id: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          school_id?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      users_to_schools: {
        Row: {
          created_at: string | null
          id: string
          role: string
          school_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          school_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          school_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_to_schools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
