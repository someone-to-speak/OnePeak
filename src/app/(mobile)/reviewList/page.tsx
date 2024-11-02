"use client";

import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/review/Calendar";
import { useState } from "react";
import { reviewApi } from "@/app/services/supabaseChatbot";
import { dateUtils } from "@/utils/chatbot/date";
import { ReviewList } from "@/components/chatBot/review/ReviewList";

type ReviewType = Tables<"review">;

const page = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(dateUtils.getToday());

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

  console.log("user", user);

  // 리뷰 데이터 조회
  const {
    data: reviews,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["reviewList", user?.id],
    queryFn: () => (user ? reviewApi.getReviews(user.id) : Promise.resolve([])),
    enabled: !!user
  });

  if (isError) {
    console.log("쿼리 에러: ", isError);
  }

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/chatbot/?situation=${review.situation}&level=${review.level}`);
  };

  if (isLoading) return <p>로딩 중...</p>;

  if (isError) return <p>오류가 발생했습니다!</p>;

  // 선택한 날짜의 리뷰 필터링
  const filteredReviews = reviews?.filter((review) => dateUtils.isSameDay(review.created_at, selectedDate)) || [];

  return (
    <div className="p-5">
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>복습하기</p>
      </div>

      <Calendar onSelectDate={setSelectedDate} />
      <ReviewList reviews={filteredReviews} onReviewClick={handleReviewClick} />
    </div>
  );
};

export default page;
