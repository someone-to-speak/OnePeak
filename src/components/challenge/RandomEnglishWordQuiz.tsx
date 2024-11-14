import Quiz from "./Quiz";

const RandomEnglishWordQuiz = ({ userId }: { userId: string }) => {
  return <Quiz userId={userId} language="english" type="word" />;
};

export default RandomEnglishWordQuiz;
