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
      <Slider {...settings} className="[&_.slick-slide]:mx-1 [&_.slick-track]:flex [&_.slick-track]:gap-2">
        {situations?.map((situation) => (
          <div
            key={situation.id}
            onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}
            className="flex justify-center items-center"
          >
            <div className="bg-primary-900 p-4 rounded-lg w-[244px] h-[320px] flex flex-col">
              <div className="flex flex-col mt-auto mb-3">
                <div className="flex">
                  {Array.from({ length: situation.level }, (_, i) => (
                    <Image key={i} src={star} alt="star" className="" />
                  ))}
                </div>
                <p className="text-[20px] font-bold">{situation.situation}</p>
                <p className="text-[14px] font-normal">Can I get The One Coffe</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TodayLearn;
