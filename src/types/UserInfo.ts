export type userInfo = {
  id: string;
  profile_url: string;
  nickname: string;
  gender: string;
  my_language: string;
  learn_language: string;
  state_msg: string;
  is_deleted: boolean;
  is_blocked: boolean;
  created_at: Date;
};

export type userInfoForMatching = Pick<userInfo, "id" | "my_language" | "learn_language">;
