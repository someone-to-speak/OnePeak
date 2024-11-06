"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { reviewApi } from "@/services/supabaseChatbot";
import Slider from "react-slick";
import star from "@/assets/star.svg";
import Image from "next/image";

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
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: false, // 자동 재생
    autoplaySpeed: 3000, // 자동 재생 속도
    pauseOnHover: true, // 호버시 일시정지
    arrows: false, // 화살표 표시
    centerPadding: "60px", // 센터 모드 패딩
    variableWidth: true,
    dots: false,
    draggable: true,
    swipe: true
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold">오늘의 학습</h1>
        <p className="text-[12px] font-#5d5d5d font-normal">매일 업데이트 되는 추천 학습</p>
      </div>
      <Slider {...settings} className="[&_.slick-slide]:mx-1 [&_.slick-track]:flex [&_.slick-track]:gap-2">
        {situations?.map((situation) => (
          <div
            key={situation.id}
            onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
            className="flex justify-center items-center"
          >
            <div className="bg-primary-900 p-4 rounded-lg w-[244px] h-[320px] flex flex-col">
              <div className="flex flex-col mt-auto mb-3">
                <div className="flex">
                  {Array.from({ length: situation.level }, (_, i) => (
                    <Image key={i} src={star} alt="star" className="" />
                  ))}
                </div>
                {/* <p>{situation.level}</p> */}
                <p className="text-[20px] font-bold">{situation.situation}</p>
                <p className="text-[14px] font-normal">Can I get The One Coffe</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TodayLearn;
