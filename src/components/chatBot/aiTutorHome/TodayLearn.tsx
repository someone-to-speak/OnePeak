"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import Slider from "react-slick";
import star from "@/assets/star.svg";
import Image from "next/image";

const TodayLearn = () => {
  const router = useRouter();

  // situation 조회
  const { data: situations } = useQuery({
    queryKey: ["situations"],
    queryFn: reviewApi.getEachLevel
  });

  const handleLearnSelect = (e: { preventDefault: () => void }, situation: string, level: number) => {
    e.preventDefault();
    router.push(`/chatbot?situation=${situation}&level=${level}`);
  };

  // 캐러셀
  const settings = {
    focusOnSelect: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: false, // 자동 재생
    arrows: false, // 화살표 표시
    centerPadding: "60px", // 센터 모드 패딩
    variableWidth: true,
    dots: false,
    draggable: true,
    swipe: true
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold">오늘의 학습</h1>
        <p className="text-[12px] text-[#5d5d5d] font-normal">매일 업데이트 되는 추천 학습</p>
      </div>
      <Slider {...settings} className="[&_.slick-slide]:mx-1 [&_.slick-track]:flex [&_.slick-track]:gap-2 w-full">
        {situations?.map((situation) => (
          <div
            key={situation.id}
            onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
            className="flex w-full"
          >
            <div className="relative p-4 rounded-lg w-[244px] h-[320px] flex flex-col overflow-hidden">
              {situation.image_url ? (
                <img
                  src={situation.image_url}
                  alt={situation.situation}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                // 이미지가 없을 경우 기존 배경색 유지
                <div className="absolute inset-0 bg-primary-900 rounded-lg" />
              )}
              {/* 이미지 위에 그라데이션 오버레이 (텍스트 가독성을 위해) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />

              {/* 컨텐츠 */}
              <div className="relative flex flex-col mt-auto mb-3 text-white">
                <div className="flex">
                  {Array.from({ length: situation.level }, (_, i) => (
                    <Image key={i} src={star} alt="star" />
                  ))}
                </div>
                <p className="text-[20px] font-bold">{situation.situation}</p>
                <p className="text-[14px] font-normal">{situation.sentence}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TodayLearn;
