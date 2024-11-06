"use client";

import { Tables } from "../../../../database.types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";

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
    .slice(0, 3);

  // 복습하기 버튼 핸들러
  const handleReviewClick = (review: ReviewType) => {
    router.push(`/review/?situation=${review.situation}&level=${review.level}`);
  };

  // 더보기 버튼 핸들러
  const handleReviewDetail = () => {
    router.push("/reviewList");
  };

  return (
    <div className="relative">
      <h1 className="text-[24px] font-bold">복습하기</h1>
      <p className="text-[12px] text-[#5d5d5d] font-normal">다시 한 번 복습해보세요</p>
      <button onClick={handleReviewDetail} className="absolute right-0">
        더보기
      </button>
      {
        // 최대 3개까지만 노출
        sortedReview?.map((review) => {
          return (
            <div key={review.id}>
              <div className="flex p-[12px] flex-col items-start gap-[8px] self-stretch rounded-[10px] bg-[var(--White, #FDFDFD)]">
                <p className="text-black text-center font-suit text-[14px] font-bold leading-[21px] tracking-[-0.28px]">
                  {review.situation}
                </p>
                <p className="self-stretch text-[var(--Gray-500, #8C8C8C)] font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px]">
                  {review.level}
                </p>
              </div>
              <button
                onClick={() => {
                  handleReviewClick(review);
                }}
                className="flex h-[34px] p-[10px] justify-center items-center gap-[10px] self-stretch rounded-[10px] bg-[var(--Primary-800, #CCEEB0)] text-[var(--Primary-200, #335813)] font-suit text-[12px] font-bold leading-[18px] tracking-[-0.24px]"
              >
                복습하기
              </button>
            </div>
          );
        })
      }
    </div>
  );
};

export default Reviewing;
