import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "../../database.types";

type QuestionType = Tables<"questions">;

type QuizProps = {
  userId: string;
  language: "korean" | "english";
  type: "word" | "grammar";
};

export const useQuiz = ({ userId, language, type }: QuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  console.log(questions);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/getRandomQuiz?language=${language}&type=${type}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

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
      const score = questions.reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.answer ? 1 : 0);
      }, 0);

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

  return {
    questions,
    selectedAnswers,
    correctAnswers,
    reason,
    currentIndex,
    setCurrentIndex,
    handleAnswerSelect,
    saveAllAnswers
  };
};
