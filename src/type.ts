import { UUID } from "crypto";

export type BlockedUserInfo = {
  target_id: UUID;
  count: number;
  user_info: { is_blocked: boolean; nickname: string };
};

export type formatedTarget = {
  id: UUID;
};

export type blockDetail = {
  created_at: Date;
  id: number;
  reason: string;
  target_id: string;
  user_info: string;
  nickname: string;
  user_info_id: string;
};

export type AiMessages = {
  role: string;
  content: string;
};
