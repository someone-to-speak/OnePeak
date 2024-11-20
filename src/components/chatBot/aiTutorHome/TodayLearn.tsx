"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
// import Slider from "react-slick";
import dynamic from "next/dynamic";
import star from "@/assets/star.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

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
        breakpoint: 5000, // PC
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
      <div className="mb-2 flex flex-col mt-[10px] md:mt-0">
        <Typography size={24} weight={"bold"}>
          오늘의 학습
        </Typography>
        <Typography size={14} weight={"normal"} className="text-[#5d5d5d]">
          매일 업데이트 되는 추천 학습
        </Typography>
      </div>
      <Slider {...settings} className="[&_.slick-slide]:pr-2 md:[&_.slick-track]:!translate-x-0 [&_.slick-track]:gap-2">
        {situations?.map((situation) => (
          <div key={situation.id} onClick={(e) => handleLearnSelect(e, situation.situation, situation.level)}>
            <div
              className="relative p-4 rounded-[12px] h-[320px] flex flex-col 
              w-[244px] md:w-full" // 모바일에서 244px, PC에서 full
            >
              {situation.image_url ? (
                <Image
                  src={situation.image_url}
                  alt={situation.situation}
                  fill
                  className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
                />
              ) : (
                <div className="absolute inset-0 bg-primary-900 rounded-lg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-[12px]" />
              <div className="relative flex flex-col mt-auto mb-3 text-white">
                <div className="flex">
                  {Array.from({ length: situation.level }, (_, i) => (
                    <Image key={i} src={star} alt="star" />
                  ))}
                </div>
                <Typography size={20} weight={"bold"} className="md:text-[24px]">
                  {situation.situation}
                </Typography>
                <Typography size={14} weight={"normal"} className="md:text-[18px] text-gray-800">
                  {situation.sentence}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TodayLearn;
