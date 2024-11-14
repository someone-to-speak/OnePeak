"use client";

import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import Image from "next/image";
import star from "@/assets/star.svg";
import { Typography } from "@/components/ui/typography";

type ReviewType = Tables<"review">;

const Reviewing = () => {
  const router = useRouter();

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

  // 리뷰 데이터 조회
  const {
    data: reviews,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["reviewList", user?.id],
    queryFn: () => (user ? reviewApi.getReviews(user.id) : Promise.resolve([])),
    enabled: !!user
  });

  if (isLoading) return <p>로딩 중...</p>;

  if (isError) return <p>오류가 발생했습니다!</p>;

  // 필터링된 리뷰
  const filterdReview = reviews?.filter((review) => review.user_id === user?.id);

  // 필터링된 리뷰 정렬
  const sortedReview = filterdReview
    ?.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 4);

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/review/?situation=${review.situation}&level=${review.level}&id=${review.id}`);
  };

  // 더보기 버튼 핸들러
  const handleReviewDetail = () => {
    router.push("/reviewList");
  };

  return (
    <div className="flex flex-col bg-[#f9f9f9] mt-10 p-4">
      <Typography size={24} weight={"bold"}>
        복습하기
      </Typography>
      <div className="flex">
        <Typography size={14} weight={"normal"} className="text-[#5d5d5d]">
          다시 한 번 복습해보세요
        </Typography>
        <button onClick={handleReviewDetail} className="absolute right-4 text-[#a6a6a6] text-[12px]">
          더보기
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sortedReview?.map((review) => {
          return (
            <div key={review.id}>
              <div className="flex flex-col mt-2 p-3 rounded-[10px] bg-white">
                <div className="">
                  <div className="flex flex-row justify-between">
                    <p className="text-[14px]">{review.situation}</p>
                    <div className="flex">
                      {Array.from({ length: review.level }, (_, i) => (
                        <Image key={i} src={star} alt="star" className="" />
                      ))}
                    </div>
                  </div>
                  <Typography size={14} className="text-[#8c8c8c]">
                    {review.sentence}I'm going to update my key sentence
                  </Typography>
                </div>
                <button
                  onClick={() => {
                    handleReviewClick(review);
                  }}
                  className="w-full p-2 mt-5 bg-primary-800 text-[12px]text-[#335813] rounded-[10px]"
                >
                  <Typography size={12} weight={"bold"} className="text-primary-200">
                    복습하기
                  </Typography>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviewing;
