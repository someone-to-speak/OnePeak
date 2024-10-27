import { UserInfo } from "@/type";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

const browserClient = createClient();

const errorFn = (error: PostgrestError | null, msg: string) => {
  console.log("Error", error?.message);
  throw new Error(msg);
};

// 전체 회원 데이터 가져오기
export const getUsersInfo = async (type: string, theNickname: string) => {
  if (type === "isBlocked") {
    const { data, error } = await browserClient.from("user_info").select().eq("is_blocked", true);
    if (error) errorFn(error, "차단 회원만 불러오는데 실패하였습니다");
    return data;
  }

  if (type === "isDeleted") {
    const { data, error } = await browserClient.from("user_info").select().eq("is_deleted", false);
    if (error) errorFn(error, "탈퇴 회원만 불러오는데 실패하였습니다");
    return data;
  }
  if (type === "isAll") {
    const { data, error } = await browserClient.from("user_info").select();
    if (error) errorFn(error, "모든 사용자들 정보를 가져오는데 실패하였습니다");
    return data;
  }
  if (type === "searchNickname" && theNickname) {
    const { data, error } = await browserClient.from("user_info").select().eq("nickname", theNickname);
    if (error) errorFn(error, "해당 회원을 검색하는데 실패하였습니다");
    return data;
  } else {
    const { data, error } = await browserClient.from("user_info").select();
    if (error) errorFn(error, "사용자들 정보를 가져오는데 실패하였습니다");
    return data || [];
  }
};

// 특정 회원 차단 해제
export const unblock = async (targetUser: UserInfo) => {
  const { error } = await browserClient.from("user_info").update({ is_blocked: false }).eq("id", targetUser.id);
  if (error) errorFn(error, "해당 유저를 차단해제하는데 실패하였습니다");
};

// 특정 회원 차단
export const block = async (targetUser: UserInfo) => {
  const { error } = await browserClient.from("user_info").update({ is_blocked: true }).eq("id", targetUser.id);
  if (error) errorFn(error, "해당 유저를 차단하는데 실패하였습니다");
};

// 특정 회원 탈퇴
export const cancle = async (targetUser: UserInfo) => {
  const { error } = await browserClient.from("user_info").update({ is_deleted: true }).eq("id", targetUser.id);
  if (error) errorFn(error, "해당 유저를 탈퇴시키는데 실패하였습니다");
};

// 특정 회원 재가입
export const uncancle = async (targetUser: UserInfo) => {
  const { error } = await browserClient.from("user_info").update({ is_deleted: false }).eq("id", targetUser.id);
  if (error) errorFn(error, "해당 유저를 재가입 시키는데 실패하였습니다");
};

// export const checkBlocked = async () => {
//   const { data, error } = await browserClient.from("user_info").select().eq("is_blocked", true);
//   console.log("차단회원", data);
//   if (error) {
//     console.log("Error", error.message);
//     throw new Error("차단한 회원들을 불러오는데 실패하였습니다");
//   } else {
//     return data;
//   }
// };
