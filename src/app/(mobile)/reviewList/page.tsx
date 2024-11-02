"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/review/Calendar";
import { useRef } from "react";

type ReviewType = Tables<"review">;

const page = () => {
  const supabase = createClient();
  const router = useRouter();

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

  const getReview = async () => {
    if (!user) {
      return [];
    }
    const { data, error } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error();
    return data;
  };

  const { data: reviews } = useQuery({
    queryKey: ["reviewList"],
    queryFn: getReview
  });

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/chatbot/?situation=${review.situation}&level=${review.level}`);
  };

  // 최종 복습 날짜 상태 관리
  const lastMonthRef = useRef<string>("");
  const lastDateRef = useRef<string>("");
  return (
    <div className="p-5">
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>복습하기</p>
      </div>
      <Calendar />
      {reviews?.map((review, index) => {
        // 날짜 형식 변환
        const reviewDate = review.created_at.split("T")[0];
        const [year, month, day] = reviewDate.split("-");
        const dayNumber = parseInt(day, 10);

        // 날짜와 월이 변경되었는지 확인
        const isDifferentDate = reviewDate !== lastDateRef.current;

        // 현재 리뷰와 이전 리뷰의 월을 비교하여 다른 월인지 확인
        const isDifferentMonth = index === 0 || month !== reviews[index - 1].created_at.split("T")[0].split("-")[1];

        if (isDifferentDate) {
          lastDateRef.current = reviewDate; // 날짜 업데이트
        }

        if (isDifferentMonth) {
          lastMonthRef.current = month; // 월 업데이트
        }

        return (
          <div key={review.id}>
            {/* 월이 다를 경우에만 "월" 출력 */}
            {isDifferentMonth && <p className="font-bold text-left">{month}</p>}
            {/* 날짜가 다를 경우에만 "일" 출력 */}
            {isDifferentDate && <p className="font-bold text-left">{dayNumber}</p>}
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
