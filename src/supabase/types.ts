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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["AlertEntityType"]
          id: string
          matched_clients: string[] | null
          subject: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["AlertEntityType"]
          id?: string
          matched_clients?: string[] | null
          subject: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["AlertEntityType"]
          id?: string
          matched_clients?: string[] | null
          subject?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          account_status: string
          additional_emails: string[] | null
          charging_stations_contract: string[] | null
          charging_stations_type: Json | null
          consultant: string | null
          created_at: string
          current_subscription: string | null
          deployment: Json | null
          email: string
          first_name: string
          id: string
          last_name: string
          org_name: string
          pending_since: string | null
          pif: Json | null
          project: Json | null
          referrer: string | null
          sector: string | null
          tailored: boolean
          vehicles_contract: string[] | null
          vehicles_type: Json | null
        }
        Insert: {
          account_status?: string
          additional_emails?: string[] | null
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          consultant?: string | null
          created_at?: string
          current_subscription?: string | null
          deployment?: Json | null
          email: string
          first_name: string
          id: string
          last_name: string
          org_name: string
          pending_since?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          tailored?: boolean
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Update: {
          account_status?: string
          additional_emails?: string[] | null
          charging_stations_contract?: string[] | null
          charging_stations_type?: Json | null
          consultant?: string | null
          created_at?: string
          current_subscription?: string | null
          deployment?: Json | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          org_name?: string
          pending_since?: string | null
          pif?: Json | null
          project?: Json | null
          referrer?: string | null
          sector?: string | null
          tailored?: boolean
          vehicles_contract?: string[] | null
          vehicles_type?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_current_subscription_fkey"
            columns: ["current_subscription"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_temp: {
        Row: {
          charging_stations_contract: string[] | null
          charging_stations_type: Json | null
          created_at: string
          deployment: Json | null
          email: string
          id: string
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
          id?: string
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
          id?: string
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
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          clients?: string[] | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
        }
        Update: {
          clients?: string[] | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: []
      }
      grants: {
        Row: {
          alert_purpose: string
          amendments: string[] | null
          awarding_authority: string | null
          call_title: string
          consultant: string | null
          created_at: string
          deadline: string[] | null
          deployment: string[] | null
          files: string[] | null
          further_details: string[] | null
          geography: string[]
          geography_details: string
          id: string
          in_brief: string
          instrument_type: string | null
          internal_deadline: string | null
          intro: string | null
          matched_clients: string[] | null
          pre_launch: boolean
          programme_purpose: string | null
          programme_title: string | null
          project: string[] | null
          reference_number: string | null
          sector: string
          sent: boolean
          subject_matter: string | null
          tailored_assessment: Json[] | null
          value: string | null
        }
        Insert: {
          alert_purpose: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          deployment?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography: string[]
          geography_details: string
          id?: string
          in_brief: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          project?: string[] | null
          reference_number?: string | null
          sector: string
          sent?: boolean
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
        }
        Update: {
          alert_purpose?: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title?: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          deployment?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography?: string[]
          geography_details?: string
          id?: string
          in_brief?: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch?: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          project?: string[] | null
          reference_number?: string | null
          sector?: string
          sent?: boolean
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          alert_purpose: string
          amendments: string[] | null
          awarding_authority: string | null
          call_title: string
          consultant: string | null
          created_at: string
          deadline: string[] | null
          files: string[] | null
          further_details: string[] | null
          geography: string[]
          geography_details: string
          id: string
          in_brief: string
          instrument_type: string | null
          internal_deadline: string | null
          intro: string | null
          matched_clients: string[] | null
          pre_launch: boolean
          programme_purpose: string | null
          programme_title: string | null
          reference_number: string | null
          sector: string
          sent: boolean
          subject_matter: string | null
          tailored_assessment: Json[] | null
          value: string | null
        }
        Insert: {
          alert_purpose: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography: string[]
          geography_details: string
          id?: string
          in_brief: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          reference_number?: string | null
          sector: string
          sent?: boolean
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
        }
        Update: {
          alert_purpose?: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title?: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography?: string[]
          geography_details?: string
          id?: string
          in_brief?: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch?: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          reference_number?: string | null
          sector?: string
          sent?: boolean
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          client_id: string | null
          created_at: string | null
          id: string
          invoice_sent_at: string | null
          period_end: string
          period_start: string
          renewal_processed_at: string | null
          status: string
        }
        Insert: {
          auto_renew?: boolean
          client_id?: string | null
          created_at?: string | null
          id?: string
          invoice_sent_at?: string | null
          period_end: string
          period_start: string
          renewal_processed_at?: string | null
          status?: string
        }
        Update: {
          auto_renew?: boolean
          client_id?: string | null
          created_at?: string | null
          id?: string
          invoice_sent_at?: string | null
          period_end?: string
          period_start?: string
          renewal_processed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          alert_purpose: string
          amendments: string[] | null
          awarding_authority: string | null
          call_title: string
          consultant: string | null
          created_at: string
          deadline: string[] | null
          files: string[] | null
          further_details: string[] | null
          geography: string[]
          geography_details: string
          id: string
          in_brief: string
          instrument_type: string | null
          internal_deadline: string | null
          intro: string | null
          matched_clients: string[] | null
          pre_launch: boolean
          programme_purpose: string | null
          programme_title: string | null
          reference_number: string | null
          sector: string
          sent: boolean
          stations: string[] | null
          stations_contracts: string[] | null
          subject_matter: string | null
          tailored_assessment: Json[] | null
          value: string | null
          vehicles: string[] | null
          vehicles_contracts: string[] | null
        }
        Insert: {
          alert_purpose: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography: string[]
          geography_details: string
          id?: string
          in_brief: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          reference_number?: string | null
          sector: string
          sent?: boolean
          stations?: string[] | null
          stations_contracts?: string[] | null
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
          vehicles?: string[] | null
          vehicles_contracts?: string[] | null
        }
        Update: {
          alert_purpose?: string
          amendments?: string[] | null
          awarding_authority?: string | null
          call_title?: string
          consultant?: string | null
          created_at?: string
          deadline?: string[] | null
          files?: string[] | null
          further_details?: string[] | null
          geography?: string[]
          geography_details?: string
          id?: string
          in_brief?: string
          instrument_type?: string | null
          internal_deadline?: string | null
          intro?: string | null
          matched_clients?: string[] | null
          pre_launch?: boolean
          programme_purpose?: string | null
          programme_title?: string | null
          reference_number?: string | null
          sector?: string
          sent?: boolean
          stations?: string[] | null
          stations_contracts?: string[] | null
          subject_matter?: string | null
          tailored_assessment?: Json[] | null
          value?: string | null
          vehicles?: string[] | null
          vehicles_contracts?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clients: string[] | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
        }
        Insert: {
          clients?: string[] | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
        }
        Update: {
          clients?: string[] | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      refresh_grants_matched_clients: {
        Args: { grant_id: string }
        Returns: undefined
      }
      refresh_investments_matched_clients: {
        Args: { investment_id: string }
        Returns: undefined
      }
      refresh_tenders_matched_clients: {
        Args: { tender_id: string }
        Returns: undefined
      }
    }
    Enums: {
      AlertEntityType: "grant" | "tender" | "investment"
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
    Enums: {
      AlertEntityType: ["grant", "tender", "investment"],
    },
  },
} as const
