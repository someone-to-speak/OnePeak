import Quiz from "./Quiz";

const RandomKoreanGrammarQuiz = ({ userId }: { userId: string }) => {
  return <Quiz userId={userId} language="Korean" type="grammar" />;
};

export default RandomKoreanGrammarQuiz;
