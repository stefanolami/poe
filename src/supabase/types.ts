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
          spare_parts: string[] | null
          submission_language: string
          tenders_for_all_lots: boolean | null
          title: string
          type_of_contract: string[]
          type_of_maintenance: string[] | null
          type_of_vehicle: string[]
          value: number
          vehicle_maintenance: string[] | null
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
          spare_parts?: string[] | null
          submission_language: string
          tenders_for_all_lots?: boolean | null
          title: string
          type_of_contract: string[]
          type_of_maintenance?: string[] | null
          type_of_vehicle: string[]
          value: number
          vehicle_maintenance?: string[] | null
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
          spare_parts?: string[] | null
          submission_language?: string
          tenders_for_all_lots?: boolean | null
          title?: string
          type_of_contract?: string[]
          type_of_maintenance?: string[] | null
          type_of_vehicle?: string[]
          value?: number
          vehicle_maintenance?: string[] | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
