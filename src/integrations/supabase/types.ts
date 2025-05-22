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
      classes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          recorded_by: string | null
          remarks: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          status: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          recorded_by?: string | null
          remarks?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      hostels: {
        Row: {
          capacity: number
          contact_number: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          school_id: string
          status: string
          type: string
          updated_at: string
          warden_name: string | null
        }
        Insert: {
          capacity: number
          contact_number?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          school_id: string
          status?: string
          type: string
          updated_at?: string
          warden_name?: string | null
        }
        Update: {
          capacity?: number
          contact_number?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          school_id?: string
          status?: string
          type?: string
          updated_at?: string
          warden_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostels_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          follow_up_date: string | null
          id: string
          inquiry_type: string
          internal_notes: string | null
          message: string
          name: string
          phone: string
          preferred_contact: string
          priority: string
          school_id: string
          source: string
          status: string
          student_age: number | null
          student_grade: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          follow_up_date?: string | null
          id?: string
          inquiry_type: string
          internal_notes?: string | null
          message: string
          name: string
          phone: string
          preferred_contact: string
          priority?: string
          school_id: string
          source: string
          status?: string
          student_age?: number | null
          student_grade?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          follow_up_date?: string | null
          id?: string
          inquiry_type?: string
          internal_notes?: string | null
          message?: string
          name?: string
          phone?: string
          preferred_contact?: string
          priority?: string
          school_id?: string
          source?: string
          status?: string
          student_age?: number | null
          student_grade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          day_of_week: string
          hostel_id: string
          id: string
          meal_type: string
          menu: string
          specific_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          hostel_id: string
          id?: string
          meal_type: string
          menu: string
          specific_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          hostel_id?: string
          id?: string
          meal_type?: string
          menu?: string
          specific_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          capacity: number
          created_at: string
          floor: number | null
          hostel_id: string
          id: string
          remarks: string | null
          room_number: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          floor?: number | null
          hostel_id: string
          id?: string
          remarks?: string | null
          room_number: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          floor?: number | null
          hostel_id?: string
          id?: string
          remarks?: string | null
          room_number?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      school_records: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          phone_number: string | null
          school_code: string
          school_logo_url: string | null
          school_name: string
          state: string | null
          status: Database["public"]["Enums"]["school_status"]
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          phone_number?: string | null
          school_code: string
          school_logo_url?: string | null
          school_name: string
          state?: string | null
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          phone_number?: string | null
          school_code?: string
          school_logo_url?: string | null
          school_name?: string
          state?: string | null
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          code: string
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          is_current: boolean
          name: string
          school_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          is_current?: boolean
          name: string
          school_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          is_current?: boolean
          name?: string
          school_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      student_allocations: {
        Row: {
          allocation_date: string
          bed_number: string | null
          created_at: string
          exit_date: string | null
          hostel_id: string
          id: string
          remarks: string | null
          room_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          allocation_date?: string
          bed_number?: string | null
          created_at?: string
          exit_date?: string | null
          hostel_id: string
          id?: string
          remarks?: string | null
          room_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          allocation_date?: string
          bed_number?: string | null
          created_at?: string
          exit_date?: string | null
          hostel_id?: string
          id?: string
          remarks?: string | null
          room_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_allocations_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_allocations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      users_to_schools: {
        Row: {
          created_at: string
          id: string
          role: string
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          school_id?: string
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
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_role_for_school: {
        Args: { school_uuid: string; roles: string[] }
        Returns: boolean
      }
      user_has_school_access: {
        Args: { school_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      school_status: "active" | "inactive" | "archived"
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
    Enums: {
      school_status: ["active", "inactive", "archived"],
    },
  },
} as const
