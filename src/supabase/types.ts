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
      agents: {
        Row: {
          created_at: string
          email: string
          family_name: string
          id: number
          languages: string[]
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          family_name: string
          id?: number
          languages: string[]
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          family_name?: string
          id?: number
          languages?: string[]
          name?: string
          phone?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          charging_stations_contract: string[] | null
          charging_stations_type: Json | null
          consultant: number | null
          created_at: string
          deployment: Json | null
          email: string
          family_name: string
          id: number
          name: string
          org_name: string | null
          pif: Json | null
          project: Json | null
          referrer: string | null
          sector: string | null
          user_id: string
          vehicles_contract: string[] | null
          vehicles_type: Json | null
        }
        Insert: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          consultant?: number | null
          created_at?: string
          deployment?: Json | null
          email: string
          family_name: string
          id?: number
          name: string
          org_name?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          user_id: string
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Update: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          consultant?: number | null
          created_at?: string
          deployment?: Json | null
          email?: string
          family_name?: string
          id?: number
          name?: string
          org_name?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          user_id?: string
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_duplicate: {
        Row: {
          charging_stations_contract: string[] | null
          charging_stations_type: string[] | null
          consultant: number | null
          created_at: string
          deployment: Json[] | null
          email: string
          family_name: string
          id: number
          name: string
          org_name: string | null
          pif: string[] | null
          project: Json[] | null
          sector: string | null
          user_id: string
          vehicles_contract: string[] | null
          vehicles_type: string[] | null
        }
        Insert: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: string[] | null
          consultant?: number | null
          created_at?: string
          deployment?: Json[] | null
          email: string
          family_name: string
          id?: number
          name: string
          org_name?: string | null
          pif?: string[] | null
          project?: Json[] | null
          sector?: string | null
          user_id: string
          vehicles_contract?: string[] | null
          vehicles_type?: string[] | null
        }
        Update: {
          charging_stations_contract?: string[] | null
          charging_stations_type?: string[] | null
          consultant?: number | null
          created_at?: string
          deployment?: Json[] | null
          email?: string
          family_name?: string
          id?: number
          name?: string
          org_name?: string | null
          pif?: string[] | null
          project?: Json[] | null
          sector?: string | null
          user_id?: string
          vehicles_contract?: string[] | null
          vehicles_type?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_duplicate_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          clients: number[] | null
          created_at: string
          email: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          clients?: number[] | null
          created_at?: string
          email: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          clients?: number[] | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      grants: {
        Row: {
          alert_purpose: string
          amendments: string[] | null
          awarding_authority: string
          call_title: string | null
          consultant: number | null
          created_at: string
          deadline: string[]
          deployment: string[] | null
          files: string[] | null
          filtered_clients: number[] | null
          further_details: string[] | null
          geography: string[]
          grant_programme: string | null
          id: number
          in_brief: string
          instrument_type: string | null
          matched_clients: number[] | null
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
          consultant?: number | null
          created_at?: string
          deadline: string[]
          deployment?: string[] | null
          files?: string[] | null
          filtered_clients?: number[] | null
          further_details?: string[] | null
          geography: string[]
          grant_programme?: string | null
          id?: number
          in_brief: string
          instrument_type?: string | null
          matched_clients?: number[] | null
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
          consultant?: number | null
          created_at?: string
          deadline?: string[]
          deployment?: string[] | null
          files?: string[] | null
          filtered_clients?: number[] | null
          further_details?: string[] | null
          geography?: string[]
          grant_programme?: string | null
          id?: number
          in_brief?: string
          instrument_type?: string | null
          matched_clients?: number[] | null
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
      tenders_e_mobility: {
        Row: {
          agent: number
          charging_stations: string[] | null
          closing: string
          contract_type: string
          contracting_org: string
          contracting_org_info: string | null
          created_at: string
          description: string
          eu_funded: boolean
          eu_funded_details: string | null
          id: number
          location: string[]
          lots_divided: boolean
          lots_number: number | null
          opening: string
          sector: string
          submission_language: string
          tenders_for_all_lots: boolean | null
          title: string
          type_of_contract_charging_stations: string[] | null
          type_of_contract_vehicles: string[] | null
          type_of_vehicle: string[] | null
          value: number
        }
        Insert: {
          agent: number
          charging_stations?: string[] | null
          closing: string
          contract_type: string
          contracting_org: string
          contracting_org_info?: string | null
          created_at?: string
          description: string
          eu_funded: boolean
          eu_funded_details?: string | null
          id?: number
          location: string[]
          lots_divided: boolean
          lots_number?: number | null
          opening: string
          sector: string
          submission_language: string
          tenders_for_all_lots?: boolean | null
          title: string
          type_of_contract_charging_stations?: string[] | null
          type_of_contract_vehicles?: string[] | null
          type_of_vehicle?: string[] | null
          value: number
        }
        Update: {
          agent?: number
          charging_stations?: string[] | null
          closing?: string
          contract_type?: string
          contracting_org?: string
          contracting_org_info?: string | null
          created_at?: string
          description?: string
          eu_funded?: boolean
          eu_funded_details?: string | null
          id?: number
          location?: string[]
          lots_divided?: boolean
          lots_number?: number | null
          opening?: string
          sector?: string
          submission_language?: string
          tenders_for_all_lots?: boolean | null
          title?: string
          type_of_contract_charging_stations?: string[] | null
          type_of_contract_vehicles?: string[] | null
          type_of_vehicle?: string[] | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "tenders_agent_fkey"
            columns: ["agent"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profiles: {
        Row: {
          created_at: string
          id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_grant_clients_call: {
        Args: { grant_id: number }
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
