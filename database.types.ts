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
      answers: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: number
          question_id: number | null
          user_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          },
        ]
      }
      block: {
        Row: {
          created_at: string | null
          id: number
          reason: string
          reason_img_url: string | null
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          reason?: string
          reason_img_url?: string | null
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          reason?: string
          reason_img_url?: string | null
          target_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "block_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          depth: string | null
          id: number
          level: number | null
          name: string
        }
        Insert: {
          depth?: string | null
          id?: number
          level?: number | null
          name: string
        }
        Update: {
          depth?: string | null
          id?: number
          level?: number | null
          name?: string
        }
        Relationships: []
      }
      chatrooms: {
        Row: {
          created_at: string
          id: number
          participants: string | null
          room_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          participants?: string | null
          room_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          participants?: string | null
          room_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatrooms_participants_fkey"
            columns: ["participants"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          room_title: number | null
          user_nickname: string | null
        }
        Insert: {
          comment?: string | null
          created_at: string
          id?: number
          room_title?: number | null
          user_nickname?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          room_title?: number | null
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_room_fkey"
            columns: ["room_title"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      faq: {
        Row: {
          category: string | null
          comment: string
          content: string | null
          created_at: string
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          comment: string
          content?: string | null
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          comment?: string
          content?: string | null
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          gender: string | null
          grammerChal_level: number | null
          id: string
          language: string | null
          nickname: string | null
          profile_url: string | null
          state_msg: string | null
          study_lang: string | null
          user_id: string | null
        }
        Insert: {
          gender?: string | null
          grammerChal_level?: number | null
          id: string
          language?: string | null
          nickname?: string | null
          profile_url?: string | null
          state_msg?: string | null
          study_lang?: string | null
          user_id?: string | null
        }
        Update: {
          gender?: string | null
          grammerChal_level?: number | null
          id?: string
          language?: string | null
          nickname?: string | null
          profile_url?: string | null
          state_msg?: string | null
          study_lang?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          difficulty_level: number
          id: number
          question_text: string
          type: string
        }
        Insert: {
          difficulty_level: number
          id?: number
          question_text: string
          type: string
        }
        Update: {
          difficulty_level?: number
          id?: number
          question_text?: string
          type?: string
        }
        Relationships: []
      }
      situation: {
        Row: {
          id: number
          level: number | null
          situation: string
        }
        Insert: {
          id?: number
          level?: number | null
          situation: string
        }
        Update: {
          id?: number
          level?: number | null
          situation?: string
        }
        Relationships: []
      }
      test_result: {
        Row: {
          category_id: number | null
          collect: number | null
          created_at: string
          id: number
          total: number | null
          user_id: string | null
        }
        Insert: {
          category_id?: number | null
          collect?: number | null
          created_at?: string
          id?: number
          total?: number | null
          user_id?: string | null
        }
        Update: {
          category_id?: number | null
          collect?: number | null
          created_at?: string
          id?: number
          total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_info: {
        Row: {
          created_at: string | null
          email: string | null
          gender: string | null
          id: string
          is_blocked: boolean | null
          is_deleted: boolean | null
          language: string | null
          nickname: string | null
          profile_url: string | null
          state_msg: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_blocked?: boolean | null
          is_deleted?: boolean | null
          language?: string | null
          nickname?: string | null
          profile_url?: string | null
          state_msg?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_blocked?: boolean | null
          is_deleted?: boolean | null
          language?: string | null
          nickname?: string | null
          profile_url?: string | null
          state_msg?: string | null
        }
        Relationships: []
      }
      wrong_answer_note: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          total: number | null
          user_id: string | null
          wrong_list: string[] | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          total?: number | null
          user_id?: string | null
          wrong_list?: string[] | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          total?: number | null
          user_id?: string | null
          wrong_list?: string[] | null
        }
        Relationships: []
      }
      wrong_answers: {
        Row: {
          created_at: string | null
          id: number
          question_id: number | null
          user_id: string | null
          wrong_answer: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
          wrong_answer: string
        }
        Update: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
          wrong_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "wrong_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wrong_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
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
