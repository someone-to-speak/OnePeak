import { Tables } from "../../../database.types";
import { UserInfo } from "../userType/userType";

export type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leaveAlone" | "closeMatching";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export type matche = Tables<"matches">;
export type Conversation = Tables<"conversations">;
export type Participant = Tables<"participants">;
export type PartialMessage = Partial<Message>;
export type Message = Tables<"messages">;
export type Language = Tables<"language">;

export type MessageWithUserInfo = Omit<Message, "sender_id"> & {
  sender_id: UserInfo;
};

export type UserInfoWithLanguage = Omit<UserInfo, "my_language" | "learn_language"> & {
  learn_language: Language;
  my_language: Language;
};

export type ParticipantWithUserInfo = Participant & {
  user_info: UserInfoWithLanguage;
};

export type ConversationWithLastMessage = Omit<Conversation, "last_message_id"> & {
  last_message_id: Message;
};

export type ConversationWithParticipants = ConversationWithLastMessage & {
  participants: ParticipantWithUserInfo;
};
