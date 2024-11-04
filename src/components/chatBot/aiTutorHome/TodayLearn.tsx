"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { reviewApi } from "@/services/supabaseChatbot";

type SituationType = Tables<"situation">;

const TodayLearn = () => {
  const supabase = createClient();
  const router = useRouter();

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

  // situation 조회
  const { data: situations } = useQuery({
    queryKey: ["situations"],
    queryFn: reviewApi.getEachLevel
  });

  // review 테이블에 유저가 선택한 학습 추가
  const addReview = async ({
    userId,
    situation,
    level
  }: {
    userId: string;
    situation: string;
    level: number;
  }): Promise<SituationType> => {
    // 오늘 날짜 생성
    const today = new Date();
    const todayString = format(today, "yyyy-MM-dd");

    // 중복 데이터 확인
    const { data: existingReviews, error: checkError } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", userId)
      .eq("situation", situation)
      .gte("created_at", `${todayString}T00:00:00Z`) // 오늘 시작 시간
      .lt("created_at", `${todayString}T23:59:59Z`); // 오늘 종료 시간

    if (checkError) {
      console.error("중복 확인 오류: ", checkError);
      throw checkError;
    }

    // 중복 데이터가 없을 때만 추가
    if (existingReviews?.length === 0) {
      const { error } = await supabase
        .from("review")
        .insert([{ user_id: userId, situation, level }])
        .select();

      if (error) {
        console.log("review 테이블 추가 오류: ", error);
        throw error; // 에러 전파
      }
    }
    return {
      id: 0,
      situation,
      level
    };
  };

  const mutation = useMutation({
    mutationFn: addReview,
    onSuccess: (data: SituationType) => {
      router.push(`/chatbot?situation=${data.situation}&level=${data.level}`);
    },
    onError: (error) => {
      console.log("리뷰 추가 중 오류가 발생하였습니다!", error);
    }
  });

  // 버튼 핸들러
  const handleLearnSelect = async (e: { preventDefault: () => void }, situation: string, level: number) => {
    e.preventDefault();

    if (user) {
      mutation.mutate({ userId: user.id, situation, level });
    }
  };

  // TODO: 기능 구현 후 캐러셀 적용
  return (
    <div className="h-64">
      <h1 className="text-3xl font-bold">오늘의 학습</h1>
      <p>매일 업데이트 되는 맞춤 커리큘럼 {situations?.length}</p>
      <div className="flex overflow-x-auto">
        {situations?.map((situation) => {
          return (
            <div
              key={situation.id}
              onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
              className="cursor-pointer"
            >
              <div className="w-60 h-60 border border-spacing-2">
                <p>{situation.situation}</p>
                <p>난이도: {situation.level}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayLearn;
