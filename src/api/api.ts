import { BlockedUserInfo, formatedTarget, UserInfo } from "@/type";
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
    const { data, error } = await browserClient
      .from("user_info")
      .select()
      .eq("is_blocked", true)
      .order("created_at", { ascending: false });
    if (error) errorFn(error, "차단 회원만 불러오는데 실패하였습니다");
    return data || [];
  }
  if (type === "isDeleted") {
    const { data, error } = await browserClient
      .from("user_info")
      .select()
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });
    if (error) errorFn(error, "탈퇴 회원만 불러오는데 실패하였습니다");
    return data || [];
  }
  if (type === "isAll") {
    const { data, error } = await browserClient.from("user_info").select().order("created_at", { ascending: false });
    if (error) errorFn(error, "모든 사용자들 정보를 가져오는데 실패하였습니다");
    return data || [];
  }
  if (type === "searchNickname" && theNickname) {
    const { data, error } = await browserClient
      .from("user_info")
      .select()
      .eq("nickname", theNickname)
      .order("created_at", { ascending: false });
    if (error) errorFn(error, "해당 회원을 검색하는데 실패하였습니다");
    return data || [];
  } else {
    const { data, error } = await browserClient.from("user_info").select().order("created_at", { ascending: false });
    if (error) errorFn(error, "사용자들 정보를 가져오는데 실패하였습니다");
    return data || [];
  }
};

// 특정 회원 차단 해제
export const unblock = async (targetUser: UserInfo | formatedTarget) => {
  const { error } = await browserClient.from("user_info").update({ is_blocked: false }).eq("id", targetUser.id);
  if (error) errorFn(error, "해당 유저를 차단해제하는데 실패하였습니다");
};

// 특정 회원 차단
export const block = async (targetUser: UserInfo | formatedTarget) => {
  console.log("aaa");
  console.log(targetUser);
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

// 블락 디테일
export const getBlockDetail = async (targetId: string) => {
  const { data, error } = await browserClient
    .from("block")
    .select(`*,user_info:user_info!block_target_id_fkey1(nickname)`)
    .order("created_at", { ascending: false });
  if (error) errorFn(error, "신고당한 유저를 불러오는데 실패하였습니다");

  const targetIdsCount: Record<string, number> = data?.reduce((acc, item) => {
    acc[item.target_id] = (acc[item.target_id] || 0) + 1;
    return acc;
  }, {});
  // console.log(taregetIdsCount) // targetIdsCount={A:3, B:2, C:3,}

  const filteredTargetIds = data
    ? Object.entries(targetIdsCount)

        .filter(([id, count]) => {
          return count >= 3;
        })
        .map(([id]) => id)
    : [];

  const filteredData = data?.filter((item) => {
    return item.target_id === targetId && filteredTargetIds.includes(item.target_id);
  });

  return filteredData || [];
};

// blockTable's target users
export const getBlockTargetUsers = async () => {
  const { data, error } = await browserClient
    .from("block")
    .select(`target_id,user_info:user_info!block_target_id_fkey1(nickname,is_blocked)`)
    .order("created_at", { ascending: false })
    .returns<BlockedUserInfo>();

  if (error) {
    errorFn(error, "신고당한 유저를 불러오는데 실패하였습니다");
    return [];
  }

  // targetIdsCount를 객체 배열로 만들기
  const targetIdsCount = data?.reduce((acc, item) => {
    const existingEntry = acc.find((entry) => entry.id === item.target_id);
    if (existingEntry) {
      existingEntry.count += 1; // 기존 항목의 카운트 증가
    } else {
      acc.push({ id: item.target_id, count: 1 }); // 새 항목 추가
    }
    return acc;
  }, [] as Array<{ id: string; count: number }>); // 초기값을 객체 배열로 지정

  // 필터링 및 데이터 매핑
  const filteredData = targetIdsCount
    ?.filter(({ count }) => count >= 2)
    .map(({ id, count }) => {
      const item = data.find((d) => d.target_id === id);
      return {
        ...item,
        count, // 카운트 추가,
        user_info: {
          nickname: item.user_info.nickname,
          is_blocked: item.user_info.is_blocked
        }
      };
    });

  return filteredData || [];
};
