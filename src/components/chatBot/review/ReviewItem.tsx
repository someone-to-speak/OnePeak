import React from "react";
import { Tables } from "../../../../database.types";

type ReviewType = Tables<"review">;

interface ReviewItemProps {
  review: ReviewType;
  onReviewClick: (review: ReviewType) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReviewClick }) => {
  return (
    <div className="border border-spacing-2 ml-10 mt-10 p-3">
      <div className="flex flex-row h-20 justify-between">
        <p>{review.situation}</p>
        <p>{review.level}</p>
      </div>
      <button
        onClick={() => {
          onReviewClick(review);
        }}
        className="w-full p-2 border border-spacing-2"
      >
        복습하기
      </button>
    </div>
  );
};

export default ReviewItem;
