import Quiz from "./Quiz";

const RandomEnglishWordQuiz = ({ userId }: { userId: string }) => {
  return <Quiz userId={userId} language="English" type="word" />;
};

export default RandomEnglishWordQuiz;
