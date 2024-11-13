"use client";

import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/calendar/Calendar";
import { useState } from "react";
import { dateUtils } from "@/utils/chatbot/date";
import { ReviewList } from "@/components/chatBot/review/ReviewList";
import { reviewApi } from "@/services/supabaseChatbot";
import WithIconHeader from "@/components/ui/WithIconHeader";

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
    router.push(`/review/?situation=${review.situation}&level=${review.level}&id=${review.id}`);
  };

  if (isLoading) return <p>로딩 중...</p>;

  if (isError) return <p>오류가 발생했습니다!</p>;

  // 선택한 날짜의 리뷰 필터링
  const filteredReviews =
    reviews?.filter((review) => {
      return dateUtils.isSameDay(review.created_at, selectedDate);
    }) || [];

  return (
    // <div className="p-5">
    //   <div className="flex">
    //     <WithIconHeader title="복습하기" />
    //   </div>
    //   <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 md:h-[calc(100vh-120px)]">
    //     <div className="flex justify-center md:w-1/2">
    //       <div className=" mb-10">
    //         <Calendar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
    //       </div>
    //     </div>
    //     <div className="md:w-1/2 md:overflow-y-auto">
    //       <ReviewList reviews={filteredReviews} onReviewClick={handleReviewClick} />
    //     </div>
    //   </div>
    // </div>
    <div className="p-5">
      <div className="flex">
        <WithIconHeader title="복습하기" />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 md:h-[calc(100vh-120px)]">
        <div className="flex justify-center md:flex-grow">
          <div className="mb-10">
            <Calendar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
          </div>
        </div>
        <div className="md:w-[561px] md:flex-shrink-0 md:overflow-y-auto">
          <ReviewList reviews={filteredReviews} onReviewClick={handleReviewClick} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
