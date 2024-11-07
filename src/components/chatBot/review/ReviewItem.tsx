import React from "react";
import { Tables } from "../../../../database.types";
import Image from "next/image";
import star from "@/assets/star.svg";

type ReviewType = Tables<"review">;

interface ReviewItemProps {
  review: ReviewType;
  onReviewClick: (review: ReviewType) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReviewClick }) => {
  return (
    <div key={review.id}>
      <div className="flex flex-col ml-10 mt-2 p-3 rounded-[10px] bg-white">
        <div className="">
          <div className="flex flex-row justify-between">
            <p className="text-[14px]">{review.situation}</p>
            <div className="flex">
              {Array.from({ length: review.level }, (_, i) => (
                <Image key={i} src={star} alt="star" className="" />
              ))}
            </div>
            {/* <p>{review.level}</p> */}
          </div>
          <p className="text-[14px] text-[#8C8C8C]">Can I get The One Coffee</p>
        </div>
        <button
          onClick={() => {
            onReviewClick(review);
          }}
          className="w-full p-2 mt-5 bg-primary-800 text-[12px] text-[#335813] rounded-[10px]"
        >
          복습하기
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
