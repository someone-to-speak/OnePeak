export type QuestionType = {
  id: number; // id 타입
  content: string; // 문제 내용
  answer: string; // 정답
  language: string; // 문제의 언어
  reason: string; // 문제의 이유
  level: number; // 문제의 레벨
  wrong_answer: string; // 틀린 답
};
