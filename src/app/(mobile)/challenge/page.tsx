"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Slider from "react-slick";
import caretLeft from "@/assets/caret-left.svg";
import challIconWord from "@/assets/chall-icon-word.svg";
import challIconGrammar from "@/assets/chall-icon-grammar.svg";
import Link from "next/link";
import Image from "next/image";
import NoIconHeader from "@/components/ui/NoIconHeader";
import { Button } from "@nextui-org/react";

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
    centerPadding: "5px",
    arrows: false
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [learnLanguage, setLearnLanguage] = useState<string>("");
  const supabase = createClient();
  const sliderRef = useRef<Slider | null>(null);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);

  const handleClick = (index: number) => {
    setSelectedButtonIndex(index);
    goToSlide(index);
  };

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
    <div className="w-full">
      <NoIconHeader title="챌린지" />
      {/* <header className="h-[48px] p-4 bg-[#fcfcfc] text-[#0c0c0c] text-lg font-bold font-['SUIT']">챌린지</header> */}
      <div className=" w-full h-[46px] mt-[10px] mx-auto px-1 py-2.5 bg-[#f3f3f3] rounded-[22px] shadow-inner flex-row justify-center items-center inline-flex">
        {problems.map((problem, index) => (
          <div
            key={problem.type}
            className={` cursor-default cursor-pointer w-full h-[38px] p-2.5 rounded-[22px] justify-center items-center gap-2.5 flex ${
              selectedButtonIndex === index ? "  bg-[#b0e484]" : "bg-[#f3f3f3]"
            }`}
          >
            <p
              onClick={() => handleClick(index)}
              className={` ${
                selectedButtonIndex === index ? "text-[#325713]" : "text-[#a5a5a5]"
              } text-base font-bold font-['SUIT'] leading-normal`}
            >
              {problem.label}
            </p>
          </div>
        ))}
      </div>
      <Slider ref={sliderRef} {...settings}>
        {problems.map((problem) => (
          <div key={problem.type} className="w-full ">
            <div
              key={problem.type}
              className="flex-col  mt-[24px] py-[32px] px-[16px] bg-primary-900 rounded-[12px] justify-between items-center flex"
            >
              <div className="flex flex-col items-center">
                <div className="mb-[40.5px]">
                  <p className="mb-[4px] text-center text-black text-[22px] font-bold font-['SUIT']  ">
                    {problem.label} 챌린지
                  </p>
                  <p className="text-center text-[#595959] text-sm font-medium font-['Pretendard'] ">
                    {problem.label} 챌린지를 통해 <br /> 실력을 확인해보세요!
                  </p>
                </div>
                {problem.type === "grammar" ? (
                  <Image src={challIconGrammar} alt={"chall-icon-grammar"} className="mb-[44px]" />
                ) : (
                  <Image src={challIconWord} alt={"chall-icon-word"} className="mb-[44px]" />
                )}
                {/* 기존 문제 풀러가기 버튼 */}{" "}
              </div>
              <Link
                href={`${problem.url}?userId=${userId}`}
                className="h-[50px] w-full bg-primary-500 p-[10px] justify-center rounded-[10px] "
              >
                <p className="text-[#FDFDFD] text-center font-suit text-[18px]  ">{problem.label} 풀러가기</p>
              </Link>
            </div>
            {/* 추가된 오답노트 버튼 */}
            <Link
              href={`/challenge/${problem.type}/wrongAnswerNote`} // 오답노트 페이지로 이동하는 링크
            >
              <div className="w-full mb-[20px] h-[80px] gap-[20px] flex p-[16px] mt-[16px] justify-center items-center rounded-[12px] bg-gray-900 ">
                <div>
                  <p className="text-black text-lg font-bold font-['SUIT'] ">
                    {problem.type === "grammar" ? "문법 오답노트" : "단어 오답노트"}
                  </p>
                  <p className=" text-[#8c8c8c] text-sm font-medium font-['Pretendard'] ">
                    {problem.type === "grammar"
                      ? "배운 문법을 잊어버리지 않게 복습해보세요"
                      : "배운 단어를 잊어버리지 않게 복습해보세요"}
                  </p>
                </div>

                <Image className="rotate-180" src={caretLeft} alt={"caret-left"} />
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ChallengePage;
