"use client";

import { useState, useEffect } from "react";
import { Tables } from "../../../database.types";
import { useRouter } from "next/navigation";

type RandomQuizProps = {
  userId: string;
};

type QuestionType = Tables<"questions">;

const RandomEnglishGrammarQuiz = ({ userId }: RandomQuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchEnglishGrammarQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=english&type=grammar`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        setQuestions(data.questions);
      } catch (error) {
        console.error("문제 로드 오류:", error);
      }
    };
    fetchEnglishGrammarQuestions();
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
  const progressPercentage = (currentIndex / questions.length) * 100;

  return (
    <div>
      <h1>
        {currentIndex}/{questions.length}
      </h1>
      {/* 진행 바 */}
      <div className="relative mb-4 h-2 bg-gray-200">
        <div
          className="absolute h-full bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="mb-4">
        <h2>{currentQuestion.content}</h2>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => handleAnswerSelect(currentQuestion.id, currentQuestion.answer)}
            className={`p-2 rounded ${
              selectedAnswers[currentQuestion.id] === currentQuestion.answer
                ? "bg-yellow-400 text-black"
                : selectedAnswers[currentQuestion.id] === currentQuestion.wrong_answer
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {currentQuestion.answer}
          </button>
          <button
            onClick={() => handleAnswerSelect(currentQuestion.id, currentQuestion.wrong_answer)}
            className={`p-2 rounded ${
              selectedAnswers[currentQuestion.id] === currentQuestion.wrong_answer
                ? "bg-yellow-400 text-black"
                : selectedAnswers[currentQuestion.id] === currentQuestion.answer
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {currentQuestion.wrong_answer}
          </button>
        </div>
        {selectedAnswers[currentQuestion.id] && !correctAnswers[currentQuestion.id] && reason[currentQuestion.id] && (
          <div className="flex flex-row">
            <p className="text-red-500">오답:</p>
            <p className="text-gray-500">{reason[currentQuestion.id]}</p>
          </div>
        )}
      </div>
      {selectedCount !== questions.length ? (
        <button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
          disabled={!selectedAnswers[currentQuestion.id]}
          className={`p-2 w-full ${
            !selectedAnswers[currentQuestion.id] ? "bg-gray-400 text-gray-200 cursor-default" : "bg-gray-800 text-white"
          }`}
        >
          다음
        </button>
      ) : (
        <button
          onClick={saveAllAnswers}
          className={`mt-4 p-2 w-full ${
            selectedCount === questions.length ? "bg-gray-800 text-white" : "bg-gray-400 text-gray-200 cursor-default"
          }`}
          disabled={selectedCount !== questions.length}
        >
          답변 제출
        </button>
      )}
    </div>
  );
};

export default RandomEnglishGrammarQuiz;
