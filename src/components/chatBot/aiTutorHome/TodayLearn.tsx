"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { reviewApi } from "@/services/supabaseChatbot";
import Slider from "react-slick";

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
    // KST로 조정 (UTC+9)
    const kstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const todayString = format(kstToday, "yyyy-MM-dd");

    // 중복 데이터 확인
    const { data: existingReviews, error: checkError } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", userId)
      .eq("situation", situation);

    const todayReview = existingReviews?.filter((review) => {
      const dateOnly = review.created_at.split("T")[0];
      return dateOnly === todayString;
    });

    if (checkError) {
      console.error("중복 확인 오류: ", checkError);
      throw checkError;
    }
    console.log(existingReviews);
    // 중복 데이터가 없을 때만 추가
    if (todayReview?.length === 0) {
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

  // 캐러셀
  const settings = {
    focusOnSelect: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    dots: true, // 하단 점 네비게이션
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 자동 재생 속도
    pauseOnHover: true, // 호버시 일시정지
    arrows: true, // 화살표 표시
    centerMode: true, // 센터 모드
    centerPadding: "60px" // 센터 모드 패딩
  };

  // TODO: 기능 구현 후 캐러셀 적용
  return (
    <div className="pl-4">
      <h1 className="text-[24px] font-bold">오늘의 학습</h1>
      <p className="text-[14px]">매일 업데이트 되는 추천 학습</p>

      <div className="relative mt-2 w-full">
        <Slider {...settings}>
          {situations?.map((situation) => (
            <div
              key={situation.id}
              onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
              style={{ width: "244px" }} // 슬라이드 너비 고정
            >
              <div className="h-[320px] border border-spacing-2 p-3">
                <p>{situation.situation}</p>
                <p>난이도: {situation.level}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TodayLearn;
