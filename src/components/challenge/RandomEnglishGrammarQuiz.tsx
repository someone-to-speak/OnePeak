"use client";

import { useState, useEffect } from "react";
import { Tables } from "../../../database.types";
import { useRouter } from "next/navigation";
import close from "@/assets/close-icon.svg";
import checkIcon from "@/assets/check-icon.svg";
import notAnswer from "@/assets/not-answer.svg";
import Image from "next/image";

type RandomQuizProps = {
  userId: string;
};

type QuestionType = Tables<"questions">;

const RandomKoreanWordQuiz = ({ userId }: RandomQuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchKoreanWordQuizQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=korean&type=word`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        setQuestions(data.questions);
      } catch (error) {
        console.error("문제 로드 오류:", error);
      }
    };
    fetchKoreanWordQuizQuestions();
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer
    }));

    const question = questions.find((q) => q.id === questionId);
    const isCorrect = answer === question?.answer;
    setCorrectAnswers((prev) => ({
      ...prev,
      [questionId]: isCorrect
    }));

    if (!isCorrect && question) {
      setReason((prev) => ({
        ...prev,
        [questionId]: question.reason
      }));
    } else {
      setReason((prev) => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const saveAllAnswers = async () => {
    try {
      let score = 0;
      questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.answer) {
          score += 1;
        }
      });

      const totalQuestions = questions.length;
      const scoreMessage = `점수: ${score} / ${totalQuestions}`;

      await Promise.all(
        questions.map((question) =>
          fetch("/api/saveUserAnswer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              questionId: question.id,
              userId,
              selectedAnswer: selectedAnswers[question.id]
            })
          })
        )
      );
      // 점수를 쿼리 파라미터로 설정하여 결과 페이지로 이동
      router.push(`/challenge/grammar/result?message=${encodeURIComponent(scoreMessage)}`); // 메시지를 쿼리 파라미터로 전달
    } catch (error) {
      console.error("답안 저장 실패:", error);
      router.push(`/challenge/grammar/result?message=${encodeURIComponent("답안 저장 실패")}`); // 오류 메시지도 전달
    }
  };

  if (questions.length === 0) return <p>문제를 불러오는 중...</p>;

  // 현재 슬라이드에 표시할 문제
  const currentQuestion = questions[currentIndex];

  // 선택된 답변의 개수
  const selectedCount = Object.keys(selectedAnswers).length;

  // 진행률 계산
  const progressPercentage = (currentIndex / questions.length) * 100 + 33;

  return (
    <div className="w-full flex flex-col relative min-h-screen gap-4">
      {/* 진행 바 */}
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center justify-between">
          <h1 className="flex-1 text-center text-[#0c0c0c] text-base font-bold font-['SUIT'] leading-normal py-[10px] cursor-default">
            {currentIndex + 1} / {questions.length}
          </h1>
          <button onClick={() => router.back()} className="flex-none w-6">
            <Image src={close} alt={close} className="w-6 h-6 right-0 top-0" />
          </button>
        </div>
        <div className="relative mb-4 h-2 bg-primary-900">
          <div
            className="absolute h-full bg-primary-500 rounded transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {/* 문제 */}
      <div className="w-[343px] h-[260px] bg-[#f3f3f3] rounded-xl flex-col justify-center items-center p-8 inline-flex">
        <h2 className="text-balance text-center text-black text-[26px] font-bold font-['SUIT'] leading-[39px]">
          {currentQuestion.content}
        </h2>
      </div>
      {/* 답/설명 */}
      <div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleAnswerSelect(currentQuestion.id, currentQuestion.answer)}
            className={`w-full h-16 px-5 py-2.5 rounded-[10px] justify-start items-center inline-flex text-left ${
              selectedAnswers[currentQuestion.id] === currentQuestion.answer
                ? "bg-[#ffedcc] border border-[#ffa500] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
                : selectedAnswers[currentQuestion.id] === currentQuestion.wrong_answer
                ? "bg-[#ffedcc] border border-[#ffa500] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
                : "bg-[#fcfcfc] border border-[#d9d9d9] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
            }`}
          >
            <div className="w-full flex flex-row justify-between items-center">
              {currentQuestion.answer}
              {selectedAnswers[currentQuestion.id] === currentQuestion.answer && (
                <Image src={checkIcon} alt="check icon" className="w-4 h-4" />
              )}
            </div>
          </button>
          <button
            onClick={() => handleAnswerSelect(currentQuestion.id, currentQuestion.wrong_answer)}
            className={`w-full h-16 px-5 py-2.5 rounded-[10px] justify-start items-center inline-flex text-left ${
              selectedAnswers[currentQuestion.id] === currentQuestion.wrong_answer
                ? "bg-[#f7d9d9] border border-[#f40000] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
                : selectedAnswers[currentQuestion.id] === currentQuestion.answer
                ? "bg-[#fcfcfc] border border-[#d9d9d9] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
                : "bg-[#fcfcfc] border border-[#d9d9d9] grow shrink basis-0 text-[#020400] text-base font-bold font-['SUIT'] leading-normal"
            }`}
          >
            <div className="w-full flex flex-row justify-between items-center">
              {currentQuestion.wrong_answer}
              {selectedAnswers[currentQuestion.id] === currentQuestion.wrong_answer && (
                <Image src={notAnswer} alt="not answer" className="w-4 h-4" />
              )}
            </div>
          </button>
        </div>
        {selectedAnswers[currentQuestion.id] && !correctAnswers[currentQuestion.id] && reason[currentQuestion.id] && (
          <div className="flex flex-col mt-[16px]">
            <p className="text-[#f40000] text-base font-bold font-['SUIT'] leading-normal">오답:</p>
            <p className="text-[#727272] text-base font-medium font-['Pretendard'] leading-normal">
              {reason[currentQuestion.id]}
            </p>
          </div>
        )}
      </div>
      {/* 다음/제출 버튼 */}
      <div className="w-full absolute bottom-[31px]">
        {selectedCount !== questions.length ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            disabled={!selectedAnswers[currentQuestion.id]}
            className={`w-full h-[54px] p-2.5 rounded-[10px] justify-center items-center gap-2.5 inline-flex text-center text-[#fcfcfc] mb-[10px] text-lg font-bold font-['SUIT'] leading-[27px] ${
              !selectedAnswers[currentQuestion.id] ? "bg-primary-800 cursor-default" : "bg-primary-500"
            }`}
          >
            다음
          </button>
        ) : (
          <button
            onClick={saveAllAnswers}
            className={
              "bg-primary-500 w-full h-[54px] p-2.5 rounded-[10px] justify-center items-center gap-2.5 inline-flex text-center text-[#fcfcfc] mb-[10px] text-lg font-bold font-['SUIT'] leading-[27px]"
            }
            disabled={selectedCount !== questions.length}
          >
            답변 제출
          </button>
        )}
      </div>
    </div>
  );
};

export default RandomKoreanWordQuiz;
