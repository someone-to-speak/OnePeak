// 추후 작업하는 부분인데 UI적으로 보여주기 위해 임시로 넣어놨습니다.

import Image from "next/image";
import sendIcon from "@/assets/send.svg";

const CustomizedLearn = () => {
  return (
    <div className="w-full mt-10">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold">트레이닝</h1>
        <p className="text-[12px] text-[#5d5d5d] font-normal">다양한 상황을 연습해보세요</p>
      </div>
      {/* 유저 인풋창 */}
      <form className="flex w-full">
        <div className="flex-grow relative">
          <input
            className="w-full h-[44px] py-2 pl-5 pr-[46px] rounded-[10px] bg-gray-900  text-xs"
            type="text"
            placeholder="원하는 트레이닝 상황을 적어보세요"
            aria-label="메시지 입력"
          />
          <button
            className="absolute h-[26px] right-2 top-1/2 -translate-y-1/2 pl-2 "
            type="submit"
            aria-label="메시지 전송"
          >
            <Image src={sendIcon} alt="전송" width={20} height={20} />
          </button>
        </div>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {["마트", "카페", "지하철", "옷가게", "여행", "음식점"].map((theme, index) => (
          <div
            key={index}
            className="w-[109px] h-[100px] p-3 bg-white rounded-lg shadow-red-300 flex items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <p className="font-bold">{theme}</p>
              {/* <p className="text-sm text-gray-600">Content</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizedLearn;
