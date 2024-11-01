"use client";

import { useState } from "react";

const FetchQuizButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/grammar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "grammar, word",
          level: 1,
          language: "korean, english",
          length: 4
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "문제 생성 실패");
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
      <button onClick={fetchQuiz} disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded">
        {loading ? "생성 중..." : "퀴즈 데이터 추가하기"}
      </button>
      {error && <p>{error}</p>}
      {success && <p>퀴즈가 성공적으로 생성되었습니다!</p>}
    </div>
  );
};

export default FetchQuizButton;