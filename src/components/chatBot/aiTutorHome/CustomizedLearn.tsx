// 추후 작업하는 부분인데 UI적으로 보여주기 위해 임시로 넣어놨습니다.

import Image from "next/image";
import sendIcon from "@/assets/send.svg";
import cafeIcon from "@/assets/home/cafe.svg";
import foodIcon from "@/assets/home/food.svg";
import martIcon from "@/assets/home/mart.svg";
import shopIcon from "@/assets/home/shop.svg";
import subwayIcon from "@/assets/home/subway.svg";
import tripIcon from "@/assets/home/trip.svg";

const CustomizedLearn = () => {
  const themeItems = [
    { name: "마트", icon: martIcon },
    { name: "카페", icon: cafeIcon },
    { name: "지하철", icon: subwayIcon },
    { name: "옷가게", icon: shopIcon },
    { name: "여행", icon: tripIcon },
    { name: "음식점", icon: foodIcon }
  ];

  return (
    // <div className="w-full mt-10">
    //   <div className="mb-2">
    //     <h1 className="text-[24px] font-bold">트레이닝</h1>
    //     <p className="text-[12px] text-[#5d5d5d] font-normal">다양한 상황을 연습해보세요</p>
    //   </div>
    //   {/* 유저 인풋창 */}
    //   <form className="flex w-full mb-3">
    //     <div className="flex-grow relative">
    //       <input
    //         className="w-full h-[44px] py-2 pl-5 pr-[46px] rounded-[10px] bg-gray-900  text-xs"
    //         type="text"
    //         placeholder="원하는 트레이닝 상황을 적어보세요"
    //         aria-label="메시지 입력"
    //       />
    //       <button
    //         className="absolute h-[26px] right-2 top-1/2 -translate-y-1/2 pl-2 "
    //         type="submit"
    //         aria-label="메시지 전송"
    //         disabled
    //       >
    //         <Image src={sendIcon} alt="전송" width={20} height={20} />
    //       </button>
    //     </div>
    //   </form>
    //   <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
    //     {themeItems.map(({ name, icon }, index) => (
    //       <div
    //         key={index}
    //         className="w-[109px] h-[100px] md:w-[157px] md:h-[134px] p-3 bg-white rounded-[10px] shadow-sm flex items-center justify-center cursor-pointer"
    //       >
    //         <div className="text-center">
    //           <Image src={icon} alt={name} width={24} height={24} className="mx-auto mb-2" />
    //           <p className="font-bold text-sm md:text-base">{name}</p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="w-full mt-10">
      <div className="md:flex md:justify-between md:items-center mb-2">
        <div>
          <h1 className="text-[24px] font-bold">트레이닝</h1>
          <p className="text-[12px] text-[#5d5d5d] font-normal">다양한 상황을 연습해보세요</p>
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
              <p className="font-bold text-sm md:text-base">{name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizedLearn;
