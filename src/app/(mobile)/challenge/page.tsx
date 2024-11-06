"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Slider from "react-slick";
import caretleft from "@/../public/images/caret-left.svg";
import challIcon from "@/assets/chall-icon.svg";
import Link from "next/link";
import Image from "next/image";

const ChallengePage = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    draggable: true,
    swipe: true,
    centerMode: true,
    centerPadding: "50px",
    arrows: false
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [learnLanguage, setLearnLanguage] = useState<string>("");
  const supabase = createClient();
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
        const { data: languages, error: langError } = await supabase
          .from("user_info")
          .select("learn_language")
          .eq("id", data.session.user.id)
          .single();

        if (langError) throw langError;
        if (languages) {
          setLearnLanguage(languages.learn_language || "");
        }
      }
    };

    fetchUserId();
  }, [supabase]);

  if (!userId) return null;

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  const problems = [
    { type: "grammar", label: `${learnLanguage} 문법 문제`, url: `/challenge/grammar/${learnLanguage}` },
    { type: "word", label: `${learnLanguage} 단어 문제`, url: `/challenge/word/${learnLanguage}` }
  ];

  return (
    <div className="">
      <div className="flex flex-row gap-4 mb-4">
        {problems.map((problem, index) => (
          <p
            key={problem.type}
            onClick={() => goToSlide(index)}
            className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
          >
            {problem.label}
          </p>
        ))}
      </div>
      <Slider ref={sliderRef} {...settings}>
        {problems.map((problem) => (
          <div key={problem.type}>
            <div className="flex flex-col w-[343px] h-[444px] items-center justify-between px-4 py-8 relative bg-primary-900 rounded-xl">
              <div className=" inline-flex gap-10 flex-col items-center relative flex-[0_0_auto]">
                <div className="flex w-[248px] gap-1 flex-col items-center relative flex-[0_0_auto]">
                  <div className="self-stretch text-black text-center font-suit text-[22px] font-bold leading-[33px] tracking-[-0.44px]">
                    {problem.label} 챌린지
                  </div>
                  <p className="self-stretch text-[#595959] text-center font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px]">
                    {problem.label} 챌린지를 통해 실력을 확인해보세요!
                  </p>
                </div>

                <Image src={challIcon} alt={"chall-icon"} />
                {/* 기존 문제 풀러가기 버튼 */}
                <Link
                  href={`${problem.url}?userId=${userId}`}
                  className="flex h-[50px] p-[10px] justify-center items-center gap-[10px] flex-shrink-0 self-stretch rounded-[10px] border border-[#96DB5C] bg-[#7BD232]"
                >
                  <p className="text-[#FDFDFD] text-center font-suit text-[18px] font-bold leading-[27px] tracking-[-0.36px]">
                    {problem.label} 풀러가기
                  </p>
                </Link>
              </div>
            </div>
            {/* 추가된 오답노트 버튼 */}
            <Link
              href={`/challenge/${problem.type}/wrongAnswerNote`} // 오답노트 페이지로 이동하는 링크
              className="w-[343px] h-20 p-4 bg-[#f3f3f3] rounded-xl justify-center items-center gap-5 inline-flex"
            >
              <div className="grow shrink basis-0 flex-col justify-center items-start inline-flex">
                <p className="self-stretch text-black text-lg font-bold font-['SUIT'] leading-[27px]">
                  {problem.type === "grammar" ? "문법 오답노트" : "단어 오답노트"}
                </p>
                <p className="self-stretch text-[#8c8c8c] text-sm font-medium font-['Pretendard']  leading-[21px]">
                  {problem.type === "grammar"
                    ? "배운 문법을 잊어버리지 않게 복습해보세요"
                    : "배운 단어를 잊어버리지 않게 복습해보세요"}
                </p>
              </div>

              <Image className="rotate-180" src={caretleft} alt={"CaretLeft"} />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ChallengePage;
