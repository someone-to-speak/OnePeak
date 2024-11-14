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

  // 캐러셀 라이브러리 세팅
  const settings = {
    focusOnSelect: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    arrows: false,
    dots: false,
    draggable: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 787, // 모바일
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true // 모바일에서는 variableWidth true로
        }
      },
      {
        breakpoint: 9999, // PC
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: false // PC에서는 variableWidth false로
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-[1024px] mx-auto ml-4">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold">오늘의 학습</h1>
        <p className="text-[12px] text-[#5d5d5d] font-normal">매일 업데이트 되는 추천 학습</p>
      </div>
      <Slider {...settings} className="[&_.slick-slide]:px-2 [&_.slick-track]:gap-4">
        {situations?.map((situation) => (
          <div key={situation.id} onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}>
            <div
              className="relative p-4 rounded-lg h-[320px] flex flex-col 
              w-[244px] md:w-full" // 모바일에서 244px, PC에서 full
            >
              {situation.image_url ? (
                <Image
                  src={situation.image_url}
                  alt={situation.situation}
                  fill
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="absolute inset-0 bg-primary-900 rounded-lg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />
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
