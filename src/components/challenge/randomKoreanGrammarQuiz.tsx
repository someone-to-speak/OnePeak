"use client";

import { useState, useEffect } from "react";
import { Tables } from "../../../database.types";

type RandomQuizProps = {
  userId: string; // userId의 UUID 타입
};

type QuestionType = Tables<"questions">;

const RandomKoreanGrammarQuiz = ({ userId }: RandomQuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchKoreanGrammarQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=korean&type=grammar`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        setQuestions(data.questions); // 여러 개의 질문을 설정
        console.log(data.questions);
      } catch (error) {
        console.error("문제 로드 오류:", error);
      }
    };
    fetchKoreanGrammarQuestions();
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const saveAllAnswers = async () => {
    const unanswered = questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      setMessage("모든 질문에 답변해 주세요.");
      // TODO: 선택안하면 못넘어가게 바꾸어야함
      return;
    }

    try {
      const responses = await Promise.all(
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

      const errors = responses.filter((res) => !res.ok);
      if (errors.length > 0) throw new Error("일부 답변 저장 실패");

      setMessage("모든 답변이 저장되었습니다!");
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
                selectedAnswers[question.id] === question.answer ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {question.answer}
            </button>
            <button
              onClick={() => handleAnswerSelect(question.id, question.wrong_answer)}
              className={`p-2 rounded ${
                selectedAnswers[question.id] === question.wrong_answer
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {question.wrong_answer}
            </button>
          </div>
        </div>
      ))}
      <button onClick={saveAllAnswers} className="mt-4 p-2 bg-gray-800 text-white">
        답변 제출
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RandomKoreanGrammarQuiz;
