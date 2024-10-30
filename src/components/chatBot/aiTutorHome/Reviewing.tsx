"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";

type ReviewType = Tables<"review">;

const Reviewing = () => {
  const supabase = createClient();
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

  return (
    <div>
      <h1 className="text-3xl font-bold">복습하기</h1>
      <div>
        {reviews.map((review) => {
          return (
            <div key={review.id}>
              <p>{review.situation}</p>
              <p>{review.level}</p>
              <button>복습하기</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviewing;
