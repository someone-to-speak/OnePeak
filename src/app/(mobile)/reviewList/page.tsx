"use client";

import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/calendar/Calendar";
import { useState } from "react";
import { dateUtils } from "@/utils/chatbot/date";
import { ReviewList } from "@/components/chatBot/review/ReviewList";
import { reviewApi } from "@/services/supabaseChatbot";

type ReviewType = Tables<"review">;

const ReviewDetail = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(dateUtils.getToday());

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

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
  const filteredReviews =
    reviews?.filter((review) => {
      // 원본 값 확인
      console.log("Original review:", {
        id: review.id,
        created_at_raw: review.created_at,
        created_at_type: typeof review.created_at
      });

      // Date 객체로 변환 직후 확인
      const reviewDate = new Date(review.created_at);
      console.log("After Date conversion:", {
        reviewDate_iso: reviewDate.toISOString(),
        reviewDate_locale: reviewDate.toLocaleString("ko-KR")
      });

      // isSameDay 함수에 전달되기 직전 값
      console.log("Before isSameDay:", {
        date1: review.created_at,
        date2: selectedDate
      });

      return dateUtils.isSameDay(review.created_at, selectedDate);
    }) || [];

  return (
    <div className="p-5">
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>복습하기</p>
      </div>

      <Calendar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      <ReviewList reviews={filteredReviews} onReviewClick={handleReviewClick} />
    </div>
  );
};

export default ReviewDetail;
