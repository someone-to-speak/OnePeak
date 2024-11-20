import React from "react";
import { Tables } from "../../../../database.types";
import Image from "next/image";
import star from "@/assets/star.svg";
import { Typography } from "@/components/ui/typography";

type ReviewType = Tables<"review">;

interface ReviewItemProps {
  review: ReviewType;
  onReviewClick: (review: ReviewType) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReviewClick }) => {
  return (
    <div key={review.id}>
      <div className="flex flex-col mt-2 p-3 rounded-[10px] bg-white">
        <div className="">
          <div className="flex flex-row justify-between">
            <Typography size={14} weight={"bold"} className="md:text-[16px]">
              {review.situation}
            </Typography>
            <div className="flex">
              {Array.from({ length: review.level }, (_, i) => (
                <Image key={i} src={star} alt="star" className="" />
              ))}
            </div>
          </div>
          <Typography size={14} className="text-[#8C8C8C] md:text-[16px]">
            {review.sentence}
          </Typography>
        </div>
        <button
          onClick={() => {
            onReviewClick(review);
          }}
          className="w-full p-2 mt-5 bg-primary-800 text-[12px] text-[#335813] rounded-[10px] md:mt-[0.6rem]"
        >
          복습하기
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
