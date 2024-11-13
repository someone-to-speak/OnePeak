"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import close from "@/assets/close-icon.svg";
import checkIcon from "@/assets/check-icon.svg";
import notAnswer from "@/assets/not-answer.svg";
import { Typography } from "../ui/typography";
import Button from "../ui/button";
import { useQuiz } from "@/hooks/useQuiz";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
import LoadingSpinner from "../ui/LoadingSpinner";

type QuizProps = {
  userId: string;
  language: "korean" | "english";
  type: "word" | "grammar";
};

const Quiz = ({ userId, language, type }: QuizProps) => {
  const router = useRouter();
  const {
    questions,
    selectedAnswers,
    correctAnswers,
    reason,
    currentIndex,
    setCurrentIndex,
    handleAnswerSelect,
    saveAllAnswers
  } = useQuiz({ userId, language, type });
  const currentQuestion = questions[currentIndex];
  const selectedCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (currentIndex / questions.length) * 100;
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  if (questions.length === 0) return <LoadingSpinner />;

  return (
    <div className="w-full flex flex-col gap-[10px]">
      {/* 진행 바 */}
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center justify-between">
          <div className="flex-none w-6"></div>
          <Typography size={16} weight="bold" className="flex-grow text-center py-[10px] cursor-default">
            {currentIndex + 1} / {questions.length}
          </Typography>
          <button onClick={() => router.back()} className="flex-none w-6">
            <Image src={close} alt="Close" className="w-6 h-6" />
          </button>
        </div>
        <div className="relative mb-4 h-2 bg-primary-900">
          <div
            className="absolute h-full bg-primary-600 rounded transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-[12px] md:flex-row md:gap-[30px]">
        {/* 문제 */}
        <div className="w-full h-[260px] md:max-w-[520px] md:h-[520px] bg-[#f3f3f3] rounded-xl flex-col justify-center items-center p-8 inline-flex">
          <Typography size={26} weight="bold" className="text-center">
            {currentQuestion.content}
          </Typography>
        </div>

        {/* 답/설명 */}
        <div className="w-full md:h-[520px] flex flex-col md:justify-between">
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
                      alt={answer === currentQuestion.answer ? "Correct" : "Incorrect"}
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
          {isLargeScreen && (
            <div className="w-full">
              {selectedCount !== questions.length ? (
                <Button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  disabled={!selectedAnswers[currentQuestion.id]}
                  variant={!selectedAnswers[currentQuestion.id] ? "disabled" : "default"}
                  text="다음"
                  size="auto"
                />
              ) : (
                <Button onClick={saveAllAnswers} text="제출" size="auto" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 다음/제출 버튼 */}
      {!isLargeScreen && (
        <div className="w-full fixed left-0 right-0 bottom-[31px] px-[16px]">
          {selectedCount !== questions.length ? (
            <Button
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={!selectedAnswers[currentQuestion.id]}
              variant={!selectedAnswers[currentQuestion.id] ? "disabled" : "default"}
              text="다음"
              size="auto"
            />
          ) : (
            <Button onClick={saveAllAnswers} text="제출" size="auto" />
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
