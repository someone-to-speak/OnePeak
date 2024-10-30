"use client";

import { useState } from "react";

const FetchQuizButton = () => {
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/grammar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content:
            '채우기 문제를 생성해 주세요. 문제는 논란의 여지가 없는 논리적이고 확실한 문제여야해. 각 질문은 "content", "answer", "wrong_answer", "reason", "language", "level", "type" 필드를 포함해야 합니다. "content"에는 빈칸을 뚫어놓은 문제만 있어야합니다. 문장 내에 정답의 의미나 단서를 포함하지 않은 빈칸형 문제 입니다. 한 줄로 된 빈칸 문제를 생성하세요. 문제 문장 내에 정답의 단서를 명시하지 마세요. 문맥이 아닌 한줄로 유추할만한 문제여야 해요. 문장 안에 힌트가 될 수 있는 선택형 표현을 포함하지 마세요. 예시: content: 저는 어제 도서관에 갔는데 책을 _____ 읽었어요.',
          type: "grammar, word",
          level: 1,
          language: "ko, en",
          length: 4
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 호출 실패: ${errorData.error}`);
      }

      const data = await response.json();

      setQuiz(data.message);
    } catch (error) {
      console.error("오류:", error);
      setError("API와 통신 실패");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <button onClick={fetchQuiz}></button>
      {error && <p>{error}</p>}
      {quiz && (
        <div>
          <h2>퀴즈:</h2>
          <pre>{JSON.stringify(quiz, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchQuizButton;
