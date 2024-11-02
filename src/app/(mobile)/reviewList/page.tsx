"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/review/Calendar";
import { useRef, useState } from "react";

type ReviewType = Tables<"review">;

const page = () => {
  const supabase = createClient();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  });

  // 유저 정보 조회
  const getUserInfo = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  };

  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo
  });

  // console.log("user", user);

  const getReview = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("supabase 에러: ", error);
      throw new Error();
    }

    return data;
  };

  const {
    data: reviews,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["reviewList", user?.id],
    queryFn: getReview,
    enabled: !!user
  });

  if (isError) {
    console.log("쿼리 에러: ", isError);
  }

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/chatbot/?situation=${review.situation}&level=${review.level}`);
  };

  // 최종 복습 날짜 상태 관리
  const lastMonthRef = useRef<string>("");
  const lastDateRef = useRef<string>("");

  if (isLoading) return <p>로딩 중...</p>;

  if (isError) return <p>오류가 발생했습니다!</p>;

  // 선택한 날짜의 리뷰 필터링
  const filteredReviews = reviews?.filter((review) => {
    const reviewDate = new Date(review.created_at).toISOString().split("T")[0];
    const selectedDateStr = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

    return reviewDate === selectedDateStr;
  });

  return (
    <div className="p-5">
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>복습하기</p>
      </div>

      <Calendar onSelectDate={setSelectedDate} />

      {/* 학습 내역이 없는 경우 */}
      {!filteredReviews?.length ? (
        <p>학습 내역이 없습니다!</p>
      ) : (
        <div>
          {/* 첫 번째 리뷰에서 월과 일 출력 */}
          {(() => {
            const reviewDate = filteredReviews[0].created_at.split("T")[0];
            const [year, month, day] = reviewDate.split("-");
            return (
              <>
                <p className="font-bold text-left">{month}월</p>
                <p className="font-bold text-left">{parseInt(day, 10)}일</p>
              </>
            );
          })()}
        </div>
      )}

      {filteredReviews?.map((review, index) => {
        // 날짜 형식 변환
        const reviewDate = review.created_at.split("T")[0];
        const [year, month, day] = reviewDate.split("-");
        const dayNumber = parseInt(day, 10);
        console.log(dayNumber);

        // 날짜와 월이 변경되었는지 확인
        const isDifferentDate = reviewDate !== lastDateRef.current;
        const isDifferentMonth =
          index === 0 || month !== filteredReviews[index - 1].created_at.split("T")[0].split("-")[1];

        // 날짜와 월이 변경될 때마다 lastDateRef, lastMonthRef 업데이트
        // if (isDifferentDate) {
        //   lastDateRef.current = reviewDate;
        // }

        if (isDifferentMonth) {
          lastMonthRef.current = month;
        }

        return (
          <div key={`${review.id}-${reviewDate}`}>
            {/* 월이 다를 경우에만 "월" 출력 */}
            {/* {isDifferentMonth && <p className="font-bold text-left">{month}</p>} */}
            {/* 날짜가 다를 경우에만 "일" 출력 */}
            {/* {isDifferentDate && <p className="font-bold text-left">{dayNumber}</p>} */}
            <div className="border border-spacing-2 ml-10 mt-10 p-3">
              <div className="flex flex-row h-20 justify-between">
                <p>{review.situation}</p>
                <p>{review.level}</p>
              </div>
              <button
                onClick={() => {
                  handleReviewClick(review);
                }}
                className="w-full p-2 border border-spacing-2"
              >
                복습하기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default page;
