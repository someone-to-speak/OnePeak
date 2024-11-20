// WordList 컴포넌트는 사용자가 틀린 단어 문제를 '미완료' 또는 '완료' 상태로 관리하고, 단어와 관련된 텍스트 음성을 재생할 수 있는 기능을 제공합니다.

"use client";

import { useState } from "react";
import { convertTextToSpeech } from "@/api/openAI/tts";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";
import speaker from "@/assets/wrongAnswerNote/speaker-high.svg";
import { Typography } from "../ui/typography";
import { useUserWrongAnswers } from "@/hooks/useUserWrongAnswers";
import { useWordQuestions } from "@/hooks/useWordQuestions";
import { useUpdateIsReviewed } from "@/hooks/useUpdateIsReviewed";

const WordList = ({ userId }: { userId: string }) => {
  const [isReviewed, setIsReviewed] = useState<"미완료" | "완료">("미완료");
  const [playingQuestionId, setPlayingQuestionId] = useState<number | null>(null); // 현재 재생 중인 질문의 ID를 관리 (null이면 재생 중이 아님)

  // 사용자의 틀린답변 데이터를 가져오는 커스텀훅
  const { data: userAnswers, error: userAnswersError, isLoading: userAnswersLoading } = useUserWrongAnswers(userId);

  // 단어문제 데이터를 가져오는 커스텀훅
  const { data: questions, error: questionsError, isLoading: questionsLoading } = useWordQuestions();

  // 틀린 문제를 '완료' 또는 '미완료'로 상태를 변경하는 훅
  const { mutate: toggleIsReviewed } = useUpdateIsReviewed(userId);

  if (userAnswersLoading || questionsLoading) return <p>로딩중입니다...</p>;
  if (userAnswersError) return <p>{userAnswersError.message}</p>;
  if (questionsError) return <p>{questionsError.message}</p>;

  // 현재 상태("미완료" 또는 "완료")에 따라 userAnswers 필터링
  const filteredAnswers = userAnswers
    ?.filter((answer) => (isReviewed === "미완료" ? !answer.is_reviewed : answer.is_reviewed))
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? { ...matchedQuestion, answerId: answer.id, isReviewed: answer.is_reviewed } : null;
    })
    .filter((item) => item !== null);

  // 텍스트를 음성으로 변환하고 재생하는 함수
  const handleTextToSpeech = async (text: string, questionId: number) => {
    if (!text || playingQuestionId === questionId) return;

    try {
      // 이전 재생 중인 오디오가 있다면 중지 및 초기화
      if (playingQuestionId) {
        const prevAudio = document.getElementById(`audio-${playingQuestionId}`) as HTMLAudioElement;
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
      }

      // OpenAI API 호출을 통해 음성 데이터를 Base64 형식으로 가져오기
      const base64Audio = await convertTextToSpeech(text);

      // Base64 데이터를 Blob 객체로 변환하여 오디오 재생 준비
      // Base64 문자열을 Blob 객체로 변환
      const byteCharacters = atob(base64Audio); // Base64 디코딩
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Blob 객체 생성 (MP3 형식)
      const blob = new Blob([byteArray], { type: "audio/mp3" });

      // 기존 오디오 엘리먼트가 있다면 제거(동일한 단어를 여러 번 클릭할 때)
      const existingAudio = document.getElementById(`audio-${questionId}`);
      if (existingAudio) {
        existingAudio.remove();
      }

      // 오디오 엘리먼트 생성 및 재생
      const audio = new Audio(URL.createObjectURL(blob));
      audio.id = `audio-${questionId}`;

      audio.onplay = () => setPlayingQuestionId(questionId); // 재생 시작 시 현재 재생 중인 질문 ID 설정
      audio.onended = () => {
        setPlayingQuestionId(null); // 재생 완료 후 초기화
        URL.revokeObjectURL(audio.src); // Blob URL 메모리 해제
      };

      document.body.appendChild(audio); // 재생을 위해 오디오 엘리먼트를 DOM에 추가->직접돔 건들지마
      await audio.play();
    } catch (error) {
      console.error("텍스트 변환 오류:", error); // 에러 처리
      setPlayingQuestionId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-[14px] md:px-3">
      <div className="bg-gray-900 flex rounded-[22px] w-[343px] mx-auto md:ml-1 h-[46px] p-1 justify-center items-center md:justify-start md:bg-transparent md:gap-[10px]">
        {/* 상태 전환 버튼 (미완료 / 완료) */}
        <button
          className={`${
            isReviewed === "미완료"
              ? "w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-800 text-primary-400"
              : "bg-gray-900 text-gray-600 w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("미완료")}
        >
          <Typography size={16} weight="medium" className="md:text-2xl md:font-bold">
            미완료
          </Typography>
        </button>
        <button
          className={`${
            isReviewed === "완료"
              ? "w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-800 text-primary-400"
              : "bg-gray-900 text-gray-600 w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("완료")}
        >
          <Typography size={16} weight="medium" className="md:text-2xl md:font-bold">
            완료
          </Typography>
        </button>
      </div>
      <div
        className={`md:h-[543px] md:flex md:flex-col md:gap-5 md:p-[30px] md:border-none md:rounded-xl ${
          isReviewed === "미완료" ? "md:bg-gray-900" : "md:bg-primary-900"
        } max-h-[543px] overflow-y-auto`}
      >
        {/* Content here */}
        <div className=" hidden md:flex md:flex-col">
          <Typography size={22} className="md:font-bold">{`${isReviewed === "미완료" ? "미완료" : "완료"}`}</Typography>
        </div>
        <div className="flex flex-col gap-[10px] md:gap-[20px] md:max-h-[411px] overflow-y-auto">
          {/* 필터링된 오답 데이터를 순회하며 UI를 생성 */}
          {filteredAnswers?.map((question) => (
            <div
              key={question!.id}
              className={`w-full h-auto px-5 py-[18px] bg-white rounded-[10px] shadow-review  ${
                question!.isReviewed ? "border border-primary-500" : ""
              }`}
            >
              <div className="flex items-center justify-between h-auto">
                <button
                  onClick={() => handleTextToSpeech(question?.content || "", question!.id)}
                  className="flex-1 flex gap-[30px] items-center"
                >
                  <div className="flex gap-[10px] md:gap-5 items-center">
                    <Image src={speaker} alt="speaker icon" width={24} height={24} />
                    <Typography
                      size={14}
                      weight="bold"
                      className="w-[100px] md:w-[200px] md:text-center text-left text-#000 break-words whitespace-pre-wrap md:text-2xl"
                    >
                      {question?.content}
                    </Typography>
                  </div>
                  <Typography size={14} weight="medium" className="text-left text-#000 break-words md:text-xl">
                    {question?.reason}
                  </Typography>
                </button>
                {/* 상태 변경 버튼 */}
                <button
                  onClick={() =>
                    toggleIsReviewed({
                      answerId: question!.answerId, // 답변 ID를 전달
                      currentReviewed: question!.isReviewed // 현재 상태를 전달
                    })
                  }
                  className="flex-shrink-0 ml-4 w-6"
                >
                  <div className="flex-none">
                    <Image
                      src={question!.isReviewed ? activeCheck : noActiveCheck}
                      alt="status icon"
                      width={24}
                      height={24}
                    />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordList;
