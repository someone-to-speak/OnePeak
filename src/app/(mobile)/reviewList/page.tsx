"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import Calendar from "@/components/review/Calendar";

type ReviewType = Tables<"review">;

const page = () => {
  const supabase = createClient();
  const router = useRouter();

  const getReview = async () => {
    const { data } = await supabase.from("review").select("*");
    return data;
  };

  const { data: reviews } = useQuery({
    queryKey: ["reviewList"],
    queryFn: getReview
  });
  console.log(reviews);

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/chatbot/?situation=${review.situation}&level=${review.level}`);
  };

  return (
    <div>
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>복습하기</p>
      </div>
      <Calendar />
      {reviews?.map((review) => {
        return (
          <div key={review.id} className="border border-spacing-2 m-10 p-3">
            {/* <p>{review.created_at}</p> */}
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
        );
      })}
    </div>
  );
};

export default page;
