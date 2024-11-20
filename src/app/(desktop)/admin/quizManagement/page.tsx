import FetchGrammarQuizButton from "@/components/challenge/FetchGrammarQuizButton";
import FetchWordQuizButton from "@/components/challenge/FetchWordQuizButton";
import React from "react";

const QuizManagementPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        그래머 문제를 바꾸고 싶다면 클릭하세요. 랜덤으로 문제가 다시 생성됩니다.
      </h2>
      <FetchGrammarQuizButton />

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        단어 문제를 바꾸고 싶다면 클릭하세요. 랜덤으로 문제가 다시 생성됩니다.
      </h2>
      <FetchWordQuizButton />
    </div>
  );
};

export default QuizManagementPage;
