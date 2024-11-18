import Quiz from "./Quiz";

const RandomEnglishGrammarQuiz = ({ userId }: { userId: string }) => {
  return <Quiz userId={userId} language="English" type="grammar" />;
};

export default RandomEnglishGrammarQuiz;
