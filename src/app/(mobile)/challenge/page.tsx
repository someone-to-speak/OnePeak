"use client";

import { useState } from "react";
import Slider from "react-slick";
import caretLeft from "@/assets/caret-left.svg";
import challIconWord from "@/assets/chall-icon-word.svg";
import challIconGrammar from "@/assets/chall-icon-grammar.svg";
import Link from "next/link";
import Image from "next/image";
import NoIconHeader from "@/components/ui/NoIconHeader";
import useSlider from "@/hooks/useSlider";
import useProblems from "@/hooks/useProblems";
import { useLearnLanguage } from "@/hooks/useUserInfo";
import { useUser } from "@/hooks/useUser";
import { Typography } from "@/components/ui/typography";
import Button from "@/components/ui/button";

const ChallengePage = () => {
  const { userInfo } = useUser();
  const { learnLanguage } = useLearnLanguage();
  const { sliderRef, goToSlide, settings } = useSlider();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const problems = useProblems(learnLanguage);

  const handleClick = (index: number) => {
    setSelectedButtonIndex(index);
    goToSlide(index);
  };

  if (!userInfo?.id) return null;

  return (
    <div className="flex flex-col md:gap-[60px]">
      <NoIconHeader title="챌린지" />
      <div className="w-full h-[calc(100vh+110px)] md:h-full">
        <div>
          <div className="max-w-[343px] h-[46px] mt-[10px] mx-auto px-1 py-2.5 bg-[#f3f3f3] rounded-[22px] shadow-inner flex flex-row justify-center items-center">
            {problems.map((problem, index) => (
              <div
                key={problem.type}
                onClick={() => handleClick(index)}
                className={`cursor-pointer w-full h-[38px] p-2.5 rounded-[22px] flex justify-center items-center gap-2.5 ${
                  selectedButtonIndex === index ? "bg-[#b0e484]" : "bg-[#f3f3f3]"
                }`}
              >
                <Typography
                  size={16}
                  weight="bold"
                  className={`${selectedButtonIndex === index ? "text-[#325713]" : "text-[#a5a5a5]"}`}
                >
                  {problem.label}
                </Typography>
              </div>
            ))}
          </div>
          <Slider ref={sliderRef} {...settings}>
            {problems.map((problem) => (
              <div key={problem.type}>
                <div className="flex flex-col mt-[24px] bg-primary-900 rounded-[12px] justify-between items-center p-8">
                  <div className="flex flex-col items-center justify-center">
                    <Typography size={22} weight="bold" className="text-center mb-[4px]">
                      {problem.label} 챌린지
                    </Typography>
                    <Typography size={14} weight="medium" className="text-gray-300 text-center">
                      {problem.label} 챌린지를 통해 <br /> 실력을 확인해보세요!
                    </Typography>
                    <Image
                      src={problem.type === "word" ? challIconWord : challIconGrammar}
                      alt={`${problem.type}-icon`}
                      className="my-[44px]"
                    />
                  </div>
                  <Link href={problem.url} className="w-full">
                    <Button text={`${problem.label} 풀러가기`} size="auto" />
                  </Link>
                </div>
                <Link
                  href={`/challenge/${problem.type}/wrongAnswerNote`}
                  className="w-full h-[80px] flex p-[16px] mt-[16px] justify-center items-center rounded-[12px] bg-gray-900"
                >
                  <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <Typography size={18} weight="bold">
                        {problem.type === "word" ? "단어 오답노트" : "문법 오답노트"}
                      </Typography>
                      <Typography size={14} weight="medium" className="text-gray-500">
                        {problem.type === "word"
                          ? "배운 단어를 잊어버리지 않게 복습해보세요"
                          : "배운 문법을 잊어버리지 않게 복습해보세요"}
                      </Typography>
                    </div>
                    <Image className="rotate-180" src={caretLeft} alt="caret-left" />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
