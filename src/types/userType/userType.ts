import { Tables } from "../../../database.types";

type UserInfo = Tables<"user_info">;

export type UserInfoForMatching = Pick<UserInfo, "id" | "my_language" | "learn_language">;
