import { dateUtils } from "@/utils/chatbot/date";
import { Tables } from "../../../../database.types";
import ReviewItem from "./ReviewItem";

type ReviewType = Tables<"review">;

interface ReviewListProps {
  reviews: ReviewType[];
  onReviewClick: (review: ReviewType) => void;
}

export const ReviewList = ({ reviews, onReviewClick }: ReviewListProps) => {
  console.log("reviews", reviews);
  if (!reviews.length) return <p>학습 내역이 없습니다!</p>;

  // 리뷰들을 날짜별로 그룹화
  const groupedReviews = reviews.reduce((acc, review) => {
    const { month, day } = dateUtils.getMonthAndDay(review.created_at);
    const dateKey = `${month}-${day}`;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(review);
    return acc;
  }, {} as Record<string, ReviewType[]>);

  return (
    <div>
      {Object.entries(groupedReviews).map(([dateKey, dateReviews]) => {
        const [month, day] = dateKey.split("-");

        return (
          <div key={dateKey}>
            <div>
              <p className="font-bold text-left text-[#595959]">{month}월</p>
              <p className="font-bold text-left text-[#595959]">{day}</p>
            </div>
            {dateReviews.map((review) => (
              <ReviewItem key={review.id} review={review} onReviewClick={onReviewClick} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
