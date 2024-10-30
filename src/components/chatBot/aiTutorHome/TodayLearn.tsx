"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SituationType = Tables<"situation">;

const TodayLearn = () => {
  const supabase = createClient();
  const [situations, setSituations] = useState<SituationType[]>([]);
  const router = useRouter();

  // 유저 정보 조회
  const getUserInfo = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  };

  // situation 조회
  const getSituations = async () => {
    try {
      const { data, error } = await supabase.from("situation").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        setSituations(data);
      }
    } catch (error) {
      console.log("situation을 가져오는 데에 실패하였습니다!", error);
      throw error;
    }
  };

  // review 테이블에 유저가 선택한 학습 추가
  const addReview = async (userId: string, situation: string, level: number) => {
    const { data, error } = await supabase
      .from("review")
      .insert([
        {
          user_id: userId, // 외래키로 연결된 유저의 ID
          situation,
          level
        }
      ])
      .select();

    if (error) {
      console.log("review 테이블 추가 오류: ", error);
    }
  };

  // 버튼 핸들러
  const handleLearnSelect = async (e: { preventDefault: () => void }, situation: string, level: number) => {
    e.preventDefault();

    const user = await getUserInfo(); // 유저 정보 가져오기
    if (user) {
      await addReview(user.id, situation, level);

      // 데이터 추가 후 이동
      router.push(`/chatbot?situation=${situation}&level=${level}`);
    }
  };

  useEffect(() => {
    getUserInfo();
    getSituations();
  }, []);

  // TODO: 기능 구현 후 캐러셀 적용
  return (
    <div className="h-64">
      <h1 className="text-3xl font-bold">오늘의 학습</h1>
      <p>매일 업데이트 되는 맞춤 커리큘럼 {situations.length}</p>
      <div className="flex flex-row">
        {situations.map((situation) => {
          return (
            <Link
              key={situation.id}
              href={`/chatbot?situation=${situation.situation}&level=${situation.level}`}
              onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
            >
              <div className="w-60 h-60 border border-spacing-2">
                <p>{situation.situation}</p>
                <p>난이도: {situation.level}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TodayLearn;
