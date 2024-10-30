"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";

type ReviewType = Tables<"review">;

const Reviewing = () => {
  const supabase = createClient();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  // TODO: 내 id랑 같은 것만 가져오기
  const getReview = async () => {
    try {
      const { data, error } = await supabase.from("review").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.log("reviews를 가져오는 데에 실패하였습니다!", error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  // 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/chatbot/?situation=${review.situation}&level=${review.level}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mt-5">복습하기</h1>
      <div className="">
        {reviews.map((review) => {
          return (
            <div key={review.id}>
              <div className="flex flex-row justify-between my-5">
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
    </div>
  );
};

export default Reviewing;
