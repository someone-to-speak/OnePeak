import { dateUtils } from "@/utils/chatbot/date";
import { Tables } from "../../../../database.types";
import ReviewItem from "./ReviewItem";

type ReviewType = Tables<"review">;

interface ReviewListProps {
  reviews: ReviewType[];
  onReviewClick: (review: ReviewType) => void;
}

export const ReviewList = ({ reviews, onReviewClick }: ReviewListProps) => {
  if (!reviews.length) return <p>학습 내역이 없습니다!</p>;

  const { month, day } = dateUtils.getMonthAndDay(reviews[0].created_at);

  return (
    <div>
      <div>
        <p className="font-bold text-left">{month}월</p>
        <p className="font-bold text-left">{day}일</p>
      </div>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} onReviewClick={onReviewClick} />
      ))}
    </div>
  );
};
