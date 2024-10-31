"use client";

import { useState, useEffect } from "react";
import { Tables } from "../../../database.types";

type RandomQuizProps = {
  userId: string; // userId의 UUID 타입
};

type QuestionType = Tables<"questions">;

const RandomEnglishGrammarQuiz = ({ userId }: RandomQuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchEnglishGrammarQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=english&type=grammar`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        setQuestions(data.questions); // 여러 개의 질문을 설정
        console.log(data.questions);
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

    // 정답 확인
    const question = questions.find((q) => q.id === questionId);
    const isCorrect = answer === question?.answer;
    setCorrectAnswers((prev) => ({
      ...prev,
      [questionId]: isCorrect
    }));

    // 오답일 경우 이유 설정
    if (!isCorrect && question) {
      setReason((prev) => ({
        ...prev,
        [questionId]: question.reason // 오답일 경우 reason 설정
      }));
    } else {
      setReason((prev) => ({
        ...prev,
        [questionId]: null // 정답일 경우 reason 초기화
      }));
    }

    // 자동으로 답변을 저장하고 서버에 보낼 수도 있습니다.
    saveAnswer(questionId, answer);
  };

  const saveAnswer = async (questionId: number, answer: string) => {
    try {
      const response = await fetch("/api/saveUserAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questionId,
          userId,
          selectedAnswer: answer
        })
      });

      if (!response.ok) throw new Error("답변 저장 실패");
    } catch (error) {
      console.error("답안 저장 실패:", error);
      setMessage("답안 저장 실패");
    }
  };

  if (questions.length === 0) return <p>문제를 불러오는 중...</p>;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="mb-4">
          <h2>{question.content}</h2>
          <div className="flex flex-row gap-4">
            <button
              onClick={() => handleAnswerSelect(question.id, question.answer)}
              className={`p-2 rounded ${
                selectedAnswers[question.id] === question.answer
                  ? "bg-yellow-400 text-black" // 정답일 때 노란색
                  : selectedAnswers[question.id] === question.wrong_answer
                  ? "bg-red-500 text-white" // 오답일 때 빨간색
                  : "bg-gray-200 text-black"
              }`}
            >
              {question.answer}
            </button>
            <button
              onClick={() => handleAnswerSelect(question.id, question.wrong_answer)}
              className={`p-2 rounded ${
                selectedAnswers[question.id] === question.wrong_answer
                  ? "bg-yellow-400 text-black" // 정답일 때 노란색
                  : selectedAnswers[question.id] === question.answer
                  ? "bg-red-500 text-white" // 오답일 때 빨간색
                  : "bg-gray-200 text-black"
              }`}
            >
              {question.wrong_answer}
            </button>
          </div>
          {/* 정답 여부 및 이유 표시 */}
          {selectedAnswers[question.id] && (
            <div>
              <p className={correctAnswers[question.id] ? "text-green-500" : "text-red-500"}>
                {correctAnswers[question.id] ? "정답!" : "오답!"}
              </p>
              {!correctAnswers[question.id] && reason[question.id] && (
                <p className="text-gray-500">{reason[question.id]}</p>
              )}
            </div>
          )}
        </div>
      ))}
      {/* 여기는 제출 버튼이 필요 없으므로 삭제 */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default RandomEnglishGrammarQuiz;
