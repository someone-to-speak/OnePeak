"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Slider from "react-slick";
import Link from "next/link";
import FetchGrammarQuizButton from "@/components/challenge/fetchGrammarQuizButton";
import FetchWordQuizButton from "@/components/challenge/fetchWordQuizButton";

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
          setLearnLanguage(languages.learn_language);
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
    <>
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
          <div key={problem.type} className="flex justify-center items-center">
            <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full max-w-[400px] h-[400px]">
              <Link
                href={`${problem.url}?userId=${userId}`}
                className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                {problem.label} 풀러가기
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      <FetchGrammarQuizButton />
      <FetchWordQuizButton />
    </>
  );
};

export default ChalPage;
