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
  img_urls: string[];
  id: number;
  reason: string;
  user_id: string;
  target_id: string;
  user_info: { nickname: string };
  nickname: string;
  user_info_id: string;
};

export type AiMessages = {
  role: string;
  content: string;
};
