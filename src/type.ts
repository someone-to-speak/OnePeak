import { EmailOtpType } from "@supabase/supabase-js";
import { UUID } from "crypto";

export type UserInfo = {
  id: UUID;
  profile_url: string;
  nickname: string;
  gender: string;
  language: string;
  state_msg: string;
  is_deleted: boolean;
  is_blocked: boolean;
  created_at: Date;
  email: EmailOtpType;
};

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
