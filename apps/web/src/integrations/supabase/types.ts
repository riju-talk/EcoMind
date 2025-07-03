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
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      care_tasks: {
        Row: {
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          plant_id: string
          scheduled_date: string
          status: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          plant_id: string
          scheduled_date: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          plant_id?: string
          scheduled_date?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_tasks_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_care_logs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          performed_at: string
          plant_id: string
          task_type: Database["public"]["Enums"]["task_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          performed_at?: string
          plant_id: string
          task_type: Database["public"]["Enums"]["task_type"]
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          performed_at?: string
          plant_id?: string
          task_type?: Database["public"]["Enums"]["task_type"]
        }
        Relationships: [
          {
            foreignKeyName: "plant_care_logs_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string
          fertilizing_frequency_days: number | null
          health_status: Database["public"]["Enums"]["plant_health_status"]
          id: string
          image_url: string | null
          last_watered_date: string | null
          location: string
          name: string
          notes: string | null
          sunlight_requirement: Database["public"]["Enums"]["sunlight_requirement"]
          type: string
          updated_at: string
          user_id: string
          watering_frequency_days: number
        }
        Insert: {
          created_at?: string
          fertilizing_frequency_days?: number | null
          health_status?: Database["public"]["Enums"]["plant_health_status"]
          id?: string
          image_url?: string | null
          last_watered_date?: string | null
          location: string
          name: string
          notes?: string | null
          sunlight_requirement: Database["public"]["Enums"]["sunlight_requirement"]
          type: string
          updated_at?: string
          user_id: string
          watering_frequency_days?: number
        }
        Update: {
          created_at?: string
          fertilizing_frequency_days?: number | null
          health_status?: Database["public"]["Enums"]["plant_health_status"]
          id?: string
          image_url?: string | null
          last_watered_date?: string | null
          location?: string
          name?: string
          notes?: string | null
          sunlight_requirement?: Database["public"]["Enums"]["sunlight_requirement"]
          type?: string
          updated_at?: string
          user_id?: string
          watering_frequency_days?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_care_tasks_for_plant: {
        Args: { plant_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      plant_health_status: "Healthy" | "Needs Attention" | "Critical"
      sunlight_requirement:
        | "Full Sun"
        | "Partial Sun"
        | "Bright, indirect"
        | "Low light"
        | "Shade"
      task_status: "pending" | "completed" | "skipped"
      task_type:
        | "watering"
        | "fertilizing"
        | "pesticide"
        | "pruning"
        | "repotting"
        | "checking"
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
      plant_health_status: ["Healthy", "Needs Attention", "Critical"],
      sunlight_requirement: [
        "Full Sun",
        "Partial Sun",
        "Bright, indirect",
        "Low light",
        "Shade",
      ],
      task_status: ["pending", "completed", "skipped"],
      task_type: [
        "watering",
        "fertilizing",
        "pesticide",
        "pruning",
        "repotting",
        "checking",
      ],
    },
  },
} as const
