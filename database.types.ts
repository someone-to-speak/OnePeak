import { AiMessages } from "@/type";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          is_correct: boolean | null;
          question_id: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id: number;
          is_correct?: boolean | null;
          question_id: number;
          user_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          is_correct?: boolean | null;
          question_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      block: {
        Row: {
          created_at: string | null;
          id: number;
          reason: string;
          reason_img_url: string | null;
          target_id: string | null;
          user_info_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          reason?: string;
          reason_img_url?: string | null;
          target_id?: string | null;
          user_info_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          reason?: string;
          reason_img_url?: string | null;
          target_id?: string | null;
          user_info_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "block_target_id_fkey1";
            columns: ["target_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "block_user_info_id_fkey";
            columns: ["user_info_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          depth: string | null;
          id: number;
          level: number | null;
          name: string;
        };
        Insert: {
          depth?: string | null;
          id?: number;
          level?: number | null;
          name: string;
        };
        Update: {
          depth?: string | null;
          id?: number;
          level?: number | null;
          name?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          last_message_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_message_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_message_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_last_message_id_fkey";
            columns: ["last_message_id"];
            isOneToOne: false;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          }
        ];
      };
      faq: {
        Row: {
          category: string | null;
          comment: string;
          content: string | null;
          created_at: string;
          id: string;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          comment: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          comment?: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      language: {
        Row: {
          created_at: string;
          id: number;
          language_img_url: string;
          language_name: string;
          status: boolean;
        };
        Insert: {
          created_at?: string;
          id?: number;
          language_img_url?: string;
          language_name?: string;
          status?: boolean;
        };
        Update: {
          created_at?: string;
          id?: number;
          language_img_url?: string;
          language_name?: string;
          status?: boolean;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          created_at: string;
          id: number;
          learn_language: string | null;
          match_id: string | null;
          my_language: string | null;
          room_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          learn_language?: string | null;
          match_id?: string | null;
          my_language?: string | null;
          room_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          learn_language?: string | null;
          match_id?: string | null;
          my_language?: string | null;
          room_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          coach_content: string;
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          sender_id: string;
          stt_content: string;
          type: string;
        };
        Insert: {
          coach_content?: string;
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          sender_id?: string;
          stt_content?: string;
          type?: string;
        };
        Update: {
          coach_content?: string;
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          sender_id?: string;
          stt_content?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: number;
          message: string;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          message: string;
          title: string;
          type: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          message?: string;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      participants: {
        Row: {
          conversation_id: string | null;
          id: string;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          conversation_id?: string | null;
          id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Update: {
          conversation_id?: string | null;
          id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "participants_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      questions: {
        Row: {
          answer: string;
          content: string;
          created_at: string;
          id: number;
          language: string;
          reason: string;
          type: string;
          wrong_answer: string;
        };
        Insert: {
          answer: string;
          content: string;
          created_at?: string;
          id?: number;
          language: string;
          reason: string;
          type: string;
          wrong_answer: string;
        };
        Update: {
          answer?: string;
          content?: string;
          created_at?: string;
          id?: number;
          language?: string;
          reason?: string;
          type?: string;
          wrong_answer?: string;
        };
        Relationships: [];
      };
      review: {
        Row: {
          created_at: string;
          id: number;
          level: number;
          situation: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          level: number;
          situation?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          level?: number;
          situation?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_situation_fkey";
            columns: ["situation"];
            isOneToOne: false;
            referencedRelation: "situation";
            referencedColumns: ["situation"];
          },
          {
            foreignKeyName: "review_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      review_content: {
        Row: {
          created_at: string;
          id: number;
          messages: string[];
          review_id: number;
          user_id: string | null;
        };
        Insert: {
          messages: AiMessages[];
          review_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          messages?: string[];
          review_id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_content_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "review";
            referencedColumns: ["id"];
          }
        ];
      };
      situation: {
        Row: {
          id: number;
          level: number;
          situation: string;
        };
        Insert: {
          id?: number;
          level: number;
          situation: string;
        };
        Update: {
          id?: number;
          level?: number;
          situation?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string | null;
          id: number;
          subscription: Json;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          subscription: Json;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          subscription?: Json;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      test_result: {
        Row: {
          category_id: number | null;
          collect: number | null;
          created_at: string;
          id: number;
          total: number | null;
          user_id: string | null;
        };
        Insert: {
          category_id?: number | null;
          collect?: number | null;
          created_at?: string;
          id?: number;
          total?: number | null;
          user_id?: string | null;
        };
        Update: {
          category_id?: number | null;
          collect?: number | null;
          created_at?: string;
          id?: number;
          total?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_answer: {
        Row: {
          created_at: string | null;
          id: number;
          is_corrected: boolean;
          is_reviewed: boolean;
          question_id: number;
          selected_answer: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_corrected: boolean;
          is_reviewed: boolean;
          question_id: number;
          selected_answer?: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_corrected?: boolean;
          is_reviewed?: boolean;
          question_id?: number;
          selected_answer?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_answer_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_answer_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_info";
            referencedColumns: ["id"];
          }
        ];
      };
      user_info: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_blocked: boolean;
          is_deleted: boolean;
          is_marketing: boolean;
          learn_language: string | null;
          my_language: string | null;
          nickname: string;
          profile_url: string;
          state_msg: string;
        };
        Insert: {
          created_at?: string;
          email?: string;
          id?: string;
          is_blocked?: boolean;
          is_deleted?: boolean;
          is_marketing?: boolean;
          learn_language?: string | null;
          my_language?: string | null;
          nickname?: string;
          profile_url?: string;
          state_msg?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_blocked?: boolean;
          is_deleted?: boolean;
          is_marketing?: boolean;
          learn_language?: string | null;
          my_language?: string | null;
          nickname?: string;
          profile_url?: string;
          state_msg?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_info_learn_language_fkey";
            columns: ["learn_language"];
            isOneToOne: false;
            referencedRelation: "language";
            referencedColumns: ["language_name"];
          },
          {
            foreignKeyName: "user_info_my_language_fkey";
            columns: ["my_language"];
            isOneToOne: false;
            referencedRelation: "language";
            referencedColumns: ["language_name"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_random_questions:
        | {
            Args: Record<PropertyKey, never>;
            Returns: {
              answer: string;
              content: string;
              created_at: string;
              id: number;
              language: string;
              reason: string;
              type: string;
              wrong_answer: string;
            }[];
          }
        | {
            Args: {
              language: string;
              type: string;
            };
            Returns: {
              answer: string;
              content: string;
              created_at: string;
              id: number;
              language: string;
              reason: string;
              type: string;
              wrong_answer: string;
            }[];
          };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
