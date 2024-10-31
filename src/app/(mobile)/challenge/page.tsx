"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import FetchGrammarQuizButton from "@/components/challenge/fetchGrammarQuizButton";
import Slider from "react-slick";
import FetchWordQuizButton from "@/components/challenge/fetchWordQuizButton";
import Link from "next/link";

const ChalPage = () => {
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
    centerMode: true, // 센터 모드 활성화
    centerPadding: "40px", // 슬라이드 사이의 패딩 조정
    arrows: false
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();
      if (error) {
        console.error("사용자 세션을 가져오는 중 오류 발생:", error);
      } else if (session) {
        setUserId(session.user.id);
      }
      setLoading(false);
    };

    fetchUserId();
  }, [supabase]);

  if (loading) return <p>로딩 중...</p>;

  if (!userId) return <p>사용자 정보를 찾을 수 없습니다.</p>;

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <>
      <div className="flex flex-row gap-4 mb-4">
        <p
          onClick={() => goToSlide(0)}
          className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
        >
          한국어 문법 문제
        </p>
        <p
          onClick={() => goToSlide(1)}
          className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
        >
          영어 문법 문제
        </p>
        <p
          onClick={() => goToSlide(2)}
          className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
        >
          한국어 단어 문제
        </p>
        <p
          onClick={() => goToSlide(3)}
          className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
        >
          영어 단어 문제
        </p>
      </div>
      <Slider ref={sliderRef} {...settings}>
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
          <Link
            href={`/challenge/grammar/korean?userId=${userId}`}
            className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            한국어 문법 문제 풀러가기
          </Link>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
          <Link
            href={`/challenge/grammar/english?userId=${userId}`}
            className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            영어 문법 문제 풀러가기
          </Link>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
          <Link
            href={`/challenge/word/korean?userId=${userId}`}
            className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            한국어 단어 문제 풀러가기
          </Link>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
          <Link
            href={`/challenge/word/english?userId=${userId}`}
            className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            영어 단어 문제 풀러가기
          </Link>
        </div>
      </Slider>

      <FetchGrammarQuizButton />
      <FetchWordQuizButton />
    </>
  );
};

export default ChalPage;
