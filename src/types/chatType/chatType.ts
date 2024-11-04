import { Tables } from "../../../database.types";
import { UserInfo } from "../userType/userType";

export type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leaveAlone" | "closeMatching";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export type Conversation = Tables<"conversations">;
export type Participant = Tables<"participants">;
export type Message = Tables<"messages">;
export type Language = Tables<"language">;

export type MessageWithUserInfo = {
  coach_content: string;
  content: string;
  conversation_id: string;
  created_at: string;
  id: string;
  sender_id: string;
  stt_content: string;
  type: string;
  user_info: UserInfo[];
};

export type UserInfoWithLanguage = {
  created_at: string;
  email: string;
  id: string;
  is_blocked: boolean;
  is_deleted: boolean;
  learn_language: Language | null;
  my_language: Language | null;
  nickname: string;
  profile_url: string;
  state_msg: string;
};

export type ParticipantWithUserInfo = {
  conversation_id: string;
  id: string;
  joined_at: string;
  user_id: string;
  user_info: UserInfoWithLanguage;
} | null;

export type ConversationWithLastMessage = {
  created_at: string;
  id: string;
  last_message_id: string | null;
  updated_at: string | null;
  last_message: Message;
};

export type ConversationWithParticipants = {
  participants: ParticipantWithUserInfo | null;
  created_at: string;
  id: string;
  last_message_id: string | null;
  updated_at: string | null;
  last_message: Message[];
};
