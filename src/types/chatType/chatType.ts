import { Tables } from "../../../database.types";

export type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leaveAlone" | "closeMatching";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export type Conversation = Tables<"conversations">;
export type Participant = Tables<"participants">;
export type Message = Tables<"messages">;
