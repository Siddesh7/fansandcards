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
      game_rooms: {
        Row: {
          chat_messages: Json
          created_at: string
          current_round: number
          game_state: string
          id: string
          max_players: number
          name: string
          players: Json
          prompt_card: string
          submitted_cards: Json
          time_left: number
          total_rounds: number
          updated_at: string
        }
        Insert: {
          chat_messages?: Json
          created_at?: string
          current_round?: number
          game_state?: string
          id: string
          max_players?: number
          name: string
          players?: Json
          prompt_card?: string
          submitted_cards?: Json
          time_left?: number
          total_rounds?: number
          updated_at?: string
        }
        Update: {
          chat_messages?: Json
          created_at?: string
          current_round?: number
          game_state?: string
          id?: string
          max_players?: number
          name?: string
          players?: Json
          prompt_card?: string
          submitted_cards?: Json
          time_left?: number
          total_rounds?: number
          updated_at?: string
        }
        Relationships: []
      }
      match_events: {
        Row: {
          created_at: string
          event_description: string
          event_type: string
          id: string
          match_minute: number | null
          player_name: string | null
          room_id: string
          team: string | null
        }
        Insert: {
          created_at?: string
          event_description: string
          event_type: string
          id?: string
          match_minute?: number | null
          player_name?: string | null
          room_id: string
          team?: string | null
        }
        Update: {
          created_at?: string
          event_description?: string
          event_type?: string
          id?: string
          match_minute?: number | null
          player_name?: string | null
          room_id?: string
          team?: string | null
        }
        Relationships: []
      }
      moment_cards: {
        Row: {
          base_price: number
          category: string
          description: string
          icon: string
          id: string
          probability: number
          rarity: string
          title: string
        }
        Insert: {
          base_price?: number
          category?: string
          description: string
          icon: string
          id?: string
          probability?: number
          rarity: string
          title: string
        }
        Update: {
          base_price?: number
          category?: string
          description?: string
          icon?: string
          id?: string
          probability?: number
          rarity?: string
          title?: string
        }
        Relationships: []
      }
      player_cards: {
        Row: {
          acquired_at: string
          card_id: string
          hit_at: string | null
          id: string
          player_id: string
          reward_amount: number | null
          room_id: string
          status: string
        }
        Insert: {
          acquired_at?: string
          card_id: string
          hit_at?: string | null
          id?: string
          player_id: string
          reward_amount?: number | null
          room_id: string
          status?: string
        }
        Update: {
          acquired_at?: string
          card_id?: string
          hit_at?: string | null
          id?: string
          player_id?: string
          reward_amount?: number | null
          room_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "moment_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      room_players: {
        Row: {
          cards_owned: number
          id: string
          is_online: boolean
          joined_at: string
          player_avatar: string | null
          player_id: string
          player_name: string
          room_id: string
          total_spent: number
        }
        Insert: {
          cards_owned?: number
          id?: string
          is_online?: boolean
          joined_at?: string
          player_avatar?: string | null
          player_id: string
          player_name: string
          room_id: string
          total_spent?: number
        }
        Update: {
          cards_owned?: number
          id?: string
          is_online?: boolean
          joined_at?: string
          player_avatar?: string | null
          player_id?: string
          player_name?: string
          room_id?: string
          total_spent?: number
        }
        Relationships: []
      }
      trade_offers: {
        Row: {
          additional_amount: number | null
          created_at: string
          expires_at: string
          from_player_id: string
          id: string
          offer_type: string
          offered_card_id: string
          requested_card_id: string | null
          room_id: string
          status: string
          to_player_id: string | null
        }
        Insert: {
          additional_amount?: number | null
          created_at?: string
          expires_at?: string
          from_player_id: string
          id?: string
          offer_type: string
          offered_card_id: string
          requested_card_id?: string | null
          room_id: string
          status?: string
          to_player_id?: string | null
        }
        Update: {
          additional_amount?: number | null
          created_at?: string
          expires_at?: string
          from_player_id?: string
          id?: string
          offer_type?: string
          offered_card_id?: string
          requested_card_id?: string | null
          room_id?: string
          status?: string
          to_player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_offers_offered_card_id_fkey"
            columns: ["offered_card_id"]
            isOneToOne: false
            referencedRelation: "moment_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_offers_requested_card_id_fkey"
            columns: ["requested_card_id"]
            isOneToOne: false
            referencedRelation: "moment_cards"
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
