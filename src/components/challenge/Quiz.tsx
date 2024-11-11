"use client";

import { useState, useEffect } from "react";
import { Tables } from "../../../database.types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import close from "@/assets/close-icon.svg";
import checkIcon from "@/assets/check-icon.svg";
import notAnswer from "@/assets/not-answer.svg";
import { Typography } from "../ui/typography";
import Button from "../ui/button";

type QuizProps = {
  userId: string;
  language: "korean" | "english";
  type: "word" | "grammar";
};

type QuestionType = Tables<"questions">;

const Quiz = ({ userId, language, type }: QuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=${language}&type=${type}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        setQuestions(data.questions);
      } catch (error) {
        console.error("문제 로드 오류:", error);
      }
    };
    fetchQuestions();
  }, [language, type]);

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

    if (question) {
      setReason((prev) => ({
        ...prev,
        [questionId]: isCorrect ? null : question.reason
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

      router.push(`/challenge/${type}/result?message=${encodeURIComponent(scoreMessage)}`);
    } catch (error) {
      console.error("답안 저장 실패:", error);
      router.push(`/challenge/${type}/result?message=${encodeURIComponent("답안 저장 실패")}`);
    }
  };

  if (questions.length === 0)
    return (
      <Typography size={16} weight="medium">
        문제를 불러오는 중
      </Typography>
    );

  const currentQuestion = questions[currentIndex];
  const selectedCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (currentIndex / questions.length) * 100;

  return (
    <div className="w-full flex flex-col relative min-h-screen gap-4">
      {/* 진행 바 */}
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center justify-between">
          <div className="flex-none w-6"></div>
          <Typography size={16} weight="bold" className="flex-grow text-center py-[10px] cursor-default">
            {currentIndex + 1} / {questions.length}
          </Typography>
          <button onClick={() => router.back()} className="flex-none w-6">
            <Image src={close} alt={close} className="w-6 h-6 right-0 top-0" />
          </button>
        </div>
        <div className="relative mb-4 h-2 bg-primary-900">
          <div
            className="absolute h-full bg-primary-600 rounded transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 문제 */}
      <div className="w-[343px] h-[260px] bg-[#f3f3f3] rounded-xl flex-col justify-center items-center p-8 inline-flex">
        <Typography size={26} weight="bold" className="text-center">
          {currentQuestion.content}
        </Typography>
      </div>

      {/* 답/설명 */}
      <div>
        <div className="flex flex-col gap-2.5">
          {[currentQuestion.answer, currentQuestion.wrong_answer].map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer)}
              className={`w-full h-16 px-5 py-2.5 rounded-[10px] justify-start items-center inline-flex text-left ${
                selectedAnswers[currentQuestion.id] === answer
                  ? answer === currentQuestion.answer
                    ? "bg-[#ffedcc] border border-[#ffa500]"
                    : "bg-[#f7d9d9] border border-[#f40000]"
                  : "bg-[#fcfcfc] border border-[#d9d9d9]"
              }`}
            >
              <div className="w-full flex flex-row justify-between items-center">
                <Typography size={16} weight="bold">
                  {answer}
                </Typography>
                {selectedAnswers[currentQuestion.id] === answer && (
                  <Image
                    src={answer === currentQuestion.answer ? checkIcon : notAnswer}
                    alt={answer === currentQuestion.answer ? "correct" : "incorrect"}
                    className="w-4 h-4"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedAnswers[currentQuestion.id] && !correctAnswers[currentQuestion.id] && reason[currentQuestion.id] && (
          <div className="flex flex-col mt-[16px]">
            <Typography size={16} weight="bold" className="text-[#f40000]">
              오답:
            </Typography>
            <Typography size={16} weight="medium" className="text-gray-400">
              {reason[currentQuestion.id]}
            </Typography>
          </div>
        )}
      </div>

      {/* 다음/제출 버튼 */}
      <div className="w-full absolute bottom-[31px]">
        {selectedCount !== questions.length ? (
          <Button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            disabled={!selectedAnswers[currentQuestion.id]}
            variant={!selectedAnswers[currentQuestion.id] ? "disabled" : "default"}
            text="다음"
            textClassName="text-lg font-bold font-['SUIT'] leading-[27px]"
            className="mb-[10px]"
          />
        ) : (
          <Button
            onClick={saveAllAnswers}
            className="bg-primary-500 w-full h-[54px] p-2.5 rounded-[10px] justify-center items-center gap-2.5 inline-flex text-center text-[#fcfcfc] mb-[10px] text-lg font-bold font-['SUIT'] leading-[27px]"
            text="다음"
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
