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
      clients: {
        Row: {
          charging_stations_contract: string[] | null
          charging_stations_type: Json | null
          created_at: string
          deployment: Json | null
          email: string
          family_name: string
          id: string
          name: string
          org_name: string | null
          pif: Json | null
          project: Json | null
          referrer: string | null
          sector: string | null
          vehicles_contract: string[] | null
          vehicles_type: Json | null
        }
        Insert: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          created_at?: string
          deployment?: Json | null
          email: string
          family_name: string
          id: string
          name: string
          org_name?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Update: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          created_at?: string
          deployment?: Json | null
          email?: string
          family_name?: string
          id?: string
          name?: string
          org_name?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Relationships: []
      }
      consultants: {
        Row: {
          clients: string[] | null
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          clients?: string[] | null
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          clients?: string[] | null
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      grants: {
        Row: {
          alert_purpose: string
          amendments: string[] | null
          awarding_authority: string
          call_title: string | null
          consultant: string | null
          created_at: string
          deadline: string[]
          deployment: string[] | null
          files: string[] | null
          further_details: string[] | null
          geography: string[]
          grant_programme: string | null
          id: string
          in_brief: string
          instrument_type: string | null
          matched_clients: string[] | null
          programme_purpose: string | null
          project: string[] | null
          reference_number: string | null
          sector: string
          sent: boolean
          tailored_assessment: Json[] | null
          value: string
        }
        Insert: {
          alert_purpose: string
          amendments?: string[] | null
          awarding_authority: string
          call_title?: string | null
          consultant?: string | null
          created_at?: string
          deadline: string[]
          deployment?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography: string[]
          grant_programme?: string | null
          id?: string
          in_brief: string
          instrument_type?: string | null
          matched_clients?: string[] | null
          programme_purpose?: string | null
          project?: string[] | null
          reference_number?: string | null
          sector: string
          sent?: boolean
          tailored_assessment?: Json[] | null
          value: string
        }
        Update: {
          alert_purpose?: string
          amendments?: string[] | null
          awarding_authority?: string
          call_title?: string | null
          consultant?: string | null
          created_at?: string
          deadline?: string[]
          deployment?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography?: string[]
          grant_programme?: string | null
          id?: string
          in_brief?: string
          instrument_type?: string | null
          matched_clients?: string[] | null
          programme_purpose?: string | null
          project?: string[] | null
          reference_number?: string | null
          sector?: string
          sent?: boolean
          tailored_assessment?: Json[] | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "grants_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_grant_clients_call: {
        Args: { grant_id: string }
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
