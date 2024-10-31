"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import WordList from "@/components/wrongAnswer/WordList";

const supabase = createClient();

// user_info 데이터 가져오는 함수 정의
const fetchUserInfo = async (userId: string): Promise<{ id: string }> => {
  const { data, error } = await supabase.from("user_info").select("id").eq("id", userId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as { id: string };
};

const WrongWordPage = () => {
  const userId = "88c8dc89-5035-48fb-8581-5334d2a81135";

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading
  } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfo(userId)
  });

  if (userInfoLoading) return <p>Loading user info...</p>;
  if (userInfoError) return <p>Error loading user info: {userInfoError.message}</p>;

  return (
    <div>
      <h1>단어 오답노트</h1>
      {userInfo && <WordList userId={userInfo.id} />}
    </div>
  );
};

export default WrongWordPage;
