"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Slider from "react-slick";
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
    centerMode: true,
    centerPadding: "40px",
    arrows: false
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [myLanguage, setMyLanguage] = useState<string>("");
  const [learnLanguage, setLearnLanguage] = useState<string>("");
  const supabase = createClient();
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) {
          setUserId(data.user.id);
          const { data: languages, error: langError } = await supabase
            .from("user_info")
            .select("my_language, learn_language")
            .eq("id", data.user.id)
            .single();

          if (langError) throw langError;
          if (languages) {
            setMyLanguage(languages.my_language);
            setLearnLanguage(languages.learn_language);
          }
        }
      } catch {
        alert("언어 불러오기 중 오류가 발생했습니다.");
      }
    };

    fetchUser();
  }, [supabase]);

  if (!userId) return <p>사용자 정보를 찾을 수 없습니다.</p>;

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <>
      <div className="flex flex-row gap-4 mb-4">
        {learnLanguage === "english" && (
          <p
            onClick={() => goToSlide(0)}
            className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
          >
            한국어 문법 문제
          </p>
        )}
        {learnLanguage === "korean" && (
          <p
            onClick={() => goToSlide(1)}
            className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
          >
            영어 문법 문제
          </p>
        )}
        {learnLanguage === "english" && (
          <p
            onClick={() => goToSlide(2)}
            className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
          >
            한국어 단어 문제
          </p>
        )}
        {learnLanguage === "korean" && (
          <p
            onClick={() => goToSlide(3)}
            className="bg-blue-500 text-white p-2 cursor-pointer rounded-md transition duration-200 hover:bg-blue-600"
          >
            영어 단어 문제
          </p>
        )}
      </div>
      <Slider ref={sliderRef} {...settings}>
        {learnLanguage === "english" && (
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
            <Link
              href={`/challenge/grammar/korean?userId=${userId}`}
              className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              한국어 문법 문제 풀러가기
            </Link>
          </div>
        )}
        {learnLanguage === "korean" && (
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
            <Link
              href={`/challenge/grammar/english?userId=${userId}`}
              className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              영어 문법 문제 풀러가기
            </Link>
          </div>
        )}
        {learnLanguage === "english" && (
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
            <Link
              href={`/challenge/word/korean?userId=${userId}`}
              className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              한국어 단어 문제 풀러가기
            </Link>
          </div>
        )}
        {learnLanguage === "korean" && (
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg h-[300px]">
            <Link
              href={`/challenge/word/english?userId=${userId}`}
              className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              영어 단어 문제 풀러가기
            </Link>
          </div>
        )}
      </Slider>
    </>
  );
};

export default ChalPage;
