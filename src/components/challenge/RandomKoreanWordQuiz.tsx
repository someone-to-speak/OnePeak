import Quiz from "./Quiz";

const RandomKoreanWordQuiz = ({ userId }: { userId: string }) => {
  return <Quiz userId={userId} language="Korean" type="word" />;
};

export default RandomKoreanWordQuiz;
