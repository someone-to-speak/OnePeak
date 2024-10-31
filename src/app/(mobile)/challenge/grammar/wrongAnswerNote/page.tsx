"use client";

import GrammarList from "@/components/wrongAnswer/GrammarList";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const supabase = createClient();

// user_info 데이터 가져오는 함수 정의
const fetchUserInfo = async (userId: string): Promise<{ id: string }> => {
  const { data, error } = await supabase.from("user_info").select("id").eq("id", userId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as { id: string };
};

const WrongGrammarPage = () => {
  const userId = "88c8dc89-5035-48fb-8581-5334d2a81135";

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading
  } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfo(userId)
  });

  if (userInfoLoading) return <p>사용자 정보에 로딩중입니다...</p>;
  if (userInfoError) return <p>Error loading user info: {userInfoError.message}</p>;
  console.log("userInfoError", userInfoError);

  return (
    <div>
      <h1>문법 오답노트</h1>
      {userInfo && <GrammarList userId={userInfo.id} />}
    </div>
  );
};

export default WrongGrammarPage;
