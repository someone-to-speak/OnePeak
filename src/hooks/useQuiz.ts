import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "../../database.types";

type QuestionType = Tables<"questions">;

type QuizProps = {
  userId: string;
  language: "Korean" | "English";
  type: "word" | "grammar";
};

export const useQuiz = ({ userId, language, type }: QuizProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<{ [key: number]: string[] }>({});
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [reason, setReason] = useState<{ [key: number]: string | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(`/api/getRandomQuiz?language=${language}&type=${type}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const shuffled = data.questions.reduce((acc: { [key: number]: string[] }, question: QuestionType) => {
        acc[question.id] = shuffleAnswers([question.answer, question.wrong_answer]);
        return acc;
      }, {});

      setQuestions(data.questions);
      setShuffledAnswers(shuffled);
    };

    fetchQuestions();
  }, [language, type]);

  const shuffleAnswers = (answers: string[]) => {
    return answers.sort(() => Math.random() - 0.5);
  };

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
      setIsLoading(true);
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
    } catch {
      router.push(`/challenge/${type}/result?message=${encodeURIComponent("답안 저장 실패")}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    shuffledAnswers,
    selectedAnswers,
    correctAnswers,
    reason,
    currentIndex,
    setCurrentIndex,
    handleAnswerSelect,
    saveAllAnswers,
    isLoading
  };
};
