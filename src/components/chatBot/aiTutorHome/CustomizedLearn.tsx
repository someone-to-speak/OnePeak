// 추후 작업하는 부분인데 UI적으로 보여주기 위해 임시로 넣어놨습니다.

import Image from "next/image";
import sendIcon from "@/assets/send.svg";
import cafeIcon from "@/assets/home/cafe.svg";
import foodIcon from "@/assets/home/food.svg";
import martIcon from "@/assets/home/mart.svg";
import shopIcon from "@/assets/home/shop.svg";
import subwayIcon from "@/assets/home/subway.svg";
import tripIcon from "@/assets/home/trip.svg";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";
import ChatModal from "@/components/ChatModal";

const CustomizedLearn = () => {
  // 오픈 예정 알림 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const themeItems = [
    { name: "마트", icon: martIcon },
    { name: "카페", icon: cafeIcon },
    { name: "지하철", icon: subwayIcon },
    { name: "옷가게", icon: shopIcon },
    { name: "여행", icon: tripIcon },
    { name: "음식점", icon: foodIcon }
  ];

  return (
    <>
      <div className="w-full mt-10 px-4" onClick={() => setIsModalOpen(true)}>
        <div className="md:flex md:justify-between md:items-center mb-2">
          <div className="flex flex-col">
            <Typography size={24} weight={"bold"} as="h1">
              트레이닝
            </Typography>
            <Typography size={14} weight={"normal"} className="text-[#5d5d5d]">
              다양한 상황을 연습해보세요
            </Typography>
          </div>
          {/* 유저 인풋창 */}
          <form className="flex w-full md:w-[495px] mt-3 md:mt-0">
            <div className="flex-grow relative">
              <input
                className="w-full h-[44px] py-2 pl-5 pr-[46px] rounded-[10px] bg-gray-900 text-xs"
                type="text"
                placeholder="원하는 트레이닝 상황을 적어보세요"
                aria-label="메시지 입력"
              />
              <button
                className="absolute h-[26px] right-2 top-1/2 -translate-y-1/2 pl-2"
                type="submit"
                aria-label="메시지 전송"
                disabled
              >
                <Image src={sendIcon} alt="전송" width={20} height={20} />
              </button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {themeItems.map(({ name, icon }, index) => (
            <div
              key={index}
              className="w-[109px] h-[100px] md:w-[157px] md:h-[134px] p-3 bg-white rounded-[10px] shadow-sm flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <Image src={icon} alt={name} width={24} height={24} className="mx-auto mb-2" />
                <Typography size={16} className="font-bold md:text-base">
                  {name}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        title="알림"
        description="오픈 예정입니다"
        confirmText="확인"
        confirmButtonStyle="primary"
        showCancel={false}
      />
    </>
  );
};

export default CustomizedLearn;
