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
          role_id: string
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
          role_id: string
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
          role_id?: string
          school_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrators_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administrators_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_assignments: {
        Row: {
          bus_route: string | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          staff_id: string | null
          start_date: string | null
        }
        Insert: {
          bus_route?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          staff_id?: string | null
          start_date?: string | null
        }
        Update: {
          bus_route?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          staff_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bus_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      class_assignments: {
        Row: {
          academic_year: string | null
          class_id: string | null
          created_at: string | null
          id: string
          is_primary_teacher: boolean | null
          section: string | null
          staff_id: string | null
        }
        Insert: {
          academic_year?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_primary_teacher?: boolean | null
          section?: string | null
          staff_id?: string | null
        }
        Update: {
          academic_year?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_primary_teacher?: boolean | null
          section?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
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
          follow_up_date: string | null
          id: string
          inquiry_type: string
          message: string | null
          name: string
          notes: string | null
          parent_name: string | null
          phone: string | null
          preferred_contact_method: string | null
          priority: string
          school_id: string
          source: string | null
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
          message?: string | null
          name: string
          notes?: string | null
          parent_name?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          priority: string
          school_id: string
          source?: string | null
          status: string
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
          message?: string | null
          name?: string
          notes?: string | null
          parent_name?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          priority?: string
          school_id?: string
          source?: string | null
          status?: string
          student_age?: number | null
          student_grade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      salary_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          new_salary: number | null
          previous_salary: number | null
          staff_id: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_salary?: number | null
          previous_salary?: number | null
          staff_id?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_salary?: number | null
          previous_salary?: number | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_history_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
      sections: {
        Row: {
          class_id: string
          created_at: string
          id: string
          medium: string
          section_name: string
          teacher_id: string | null
          total_capacity: number
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          medium?: string
          section_name: string
          teacher_id?: string | null
          total_capacity?: number
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          medium?: string
          section_name?: string
          teacher_id?: string | null
          total_capacity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
      staff: {
        Row: {
          address: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          designation: string | null
          email: string
          gender: string | null
          id: string
          is_bus_incharge: boolean | null
          joining_date: string | null
          login_email: string | null
          login_type: string | null
          name: string
          note_description: string | null
          password_hash: string | null
          phone: string | null
          qualification: string | null
          role: string | null
          salary: number | null
          section: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          zoom_client_id: string | null
          zoom_client_secret: string | null
          zoom_redirect_url: string | null
          zoom_sdk_key: string | null
          zoom_sdk_secret: string | null
        }
        Insert: {
          address?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          designation?: string | null
          email: string
          gender?: string | null
          id?: string
          is_bus_incharge?: boolean | null
          joining_date?: string | null
          login_email?: string | null
          login_type?: string | null
          name: string
          note_description?: string | null
          password_hash?: string | null
          phone?: string | null
          qualification?: string | null
          role?: string | null
          salary?: number | null
          section?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          zoom_client_id?: string | null
          zoom_client_secret?: string | null
          zoom_redirect_url?: string | null
          zoom_sdk_key?: string | null
          zoom_sdk_secret?: string | null
        }
        Update: {
          address?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          designation?: string | null
          email?: string
          gender?: string | null
          id?: string
          is_bus_incharge?: boolean | null
          joining_date?: string | null
          login_email?: string | null
          login_type?: string | null
          name?: string
          note_description?: string | null
          password_hash?: string | null
          phone?: string | null
          qualification?: string | null
          role?: string | null
          salary?: number | null
          section?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          zoom_client_id?: string | null
          zoom_client_secret?: string | null
          zoom_redirect_url?: string | null
          zoom_sdk_key?: string | null
          zoom_sdk_secret?: string | null
        }
        Relationships: []
      }
      staff_roles: {
        Row: {
          assigned_date: string | null
          role_id: string
          staff_id: string
        }
        Insert: {
          assigned_date?: string | null
          role_id: string
          staff_id: string
        }
        Update: {
          assigned_date?: string | null
          role_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_roles_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      student_section_assignments: {
        Row: {
          enrolled_at: string
          gender: string | null
          id: string
          section_id: string
          student_id: string
        }
        Insert: {
          enrolled_at?: string
          gender?: string | null
          id?: string
          section_id: string
          student_id: string
        }
        Update: {
          enrolled_at?: string
          gender?: string | null
          id?: string
          section_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_section_assignments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section_capacity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_section_assignments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
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
          name?: string
          school_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
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
      section_capacity_view: {
        Row: {
          capacity_percentage: number | null
          class_id: string | null
          class_name: string | null
          female_students: number | null
          id: string | null
          male_students: number | null
          medium: string | null
          other_gender_students: number | null
          section_name: string | null
          teacher_designation: string | null
          teacher_id: string | null
          teacher_name: string | null
          total_capacity: number | null
          total_enrolled: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
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
