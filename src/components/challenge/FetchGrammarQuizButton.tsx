"use client";

import { useState } from "react";

const FetchGrammarQuizButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/fetchGrammarQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "grammar",
          language: "Korean, English",
          length: 4
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setSuccess(true);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setError("API와 통신 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchQuiz} disabled={loading} className="bg-gray-800 text-white py-2 px-4">
        {loading ? "생성 중..." : "grammar 퀴즈 추가하기"}
      </button>
      {error && <p>{error}</p>}
      {success && <p>퀴즈가 성공적으로 생성되었습니다!</p>}
    </div>
  );
};

export default FetchGrammarQuizButton;
