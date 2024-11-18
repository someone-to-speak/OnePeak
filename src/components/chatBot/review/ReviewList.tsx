import { dateUtils } from "@/utils/chatbot/date";
import { Tables } from "../../../../database.types";
import ReviewItem from "./ReviewItem";
import { Typography } from "@/components/ui/typography";

type ReviewType = Tables<"review">;

interface ReviewListProps {
  reviews: ReviewType[];
  onReviewClick: (review: ReviewType) => void;
}

export const ReviewList = ({ reviews, onReviewClick }: ReviewListProps) => {
  if (!reviews.length)
    return (
      <Typography size={14} className="px-4">
        학습 내역이 없습니다.
      </Typography>
    );

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
    <div className="bg-[#F9F9F9] p-4 md:rounded-[24px]">
      {Object.entries(groupedReviews).map(([dateKey, dateReviews]) => {
        const [month, day] = dateKey.split("-");

        return (
          <div key={dateKey} className="mb-4 md:mb-6">
            <div key={dateKey}>
              <div className="flex flex-col">
                <Typography size={14} weight={"bold"} className="text-left text-gray-300">
                  {month}월
                </Typography>
                <Typography size={14} weight={"bold"} className="text-left text-gray-300">
                  {day}
                </Typography>
              </div>
              <div className="grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-[8px] md:auto-rows-max md:h-[710px] pl-10">
                {dateReviews.map((review) => (
                  <ReviewItem key={review.id} review={review} onReviewClick={onReviewClick} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
