"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import FetchQuestionsButton from "@/components/challenge/fetchQuizButton";
import RandomKoreanGrammarQuiz from "@/components/challenge/randomKoreanGrammarQuiz";
import RandomEnglishWordQuiz from "@/components/challenge/randomEnglishWordQuiz";
import RandomKoreanWordQuiz from "@/components/challenge/randomKoreanWordQuiz";
import RandomEnglishGrammarQuiz from "@/components/challenge/randomEnglishGrammarQuiz";
import Slider from "react-slick";

const ChalPage = () => {
  const settings = {
    dots: true, // 페이지네이션 점 표시
    infinite: false, // 무한 스크롤
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 보이는 슬라이드 수
    slidesToScroll: 1, // 슬라이드 스크롤 수
    autoplay: false, // 자동 재생
    autoplaySpeed: 2000 // 자동 재생 속도
  };

  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();
      if (error) {
        console.error("사용자 세션을 가져오는 중 오류 발생:", error);
      } else if (session) {
        setUserId(session.user.id);
      }
    };

    fetchUserId();
  }, [supabase]);

  if (!userId) return null;

  return (
    <>
      <Slider {...settings}>
        <div>
          <p>한국어 문법 문제</p>
          <RandomKoreanGrammarQuiz userId={userId} />
        </div>
        <div>
          <p>영어 문법 문제</p>
          <RandomEnglishGrammarQuiz userId={userId} />
        </div>
        <div>
          <p>한국어 단어 문제</p>
          <RandomKoreanWordQuiz userId={userId} />
        </div>
        <div>
          <p>영어 단어 문제</p>
          <RandomEnglishWordQuiz userId={userId} />
        </div>
      </Slider>

      <FetchQuestionsButton />
    </>
  );
};

export default ChalPage;
