"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { convertTextToSpeech } from "@/api/openAI/tts";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";
import speaker from "@/assets/wrongAnswerNote/speaker-high.svg";
import { Typography } from "../ui/typography";
import { fetchUserWrongAnswers, fetchWordQuestions } from "@/api/wrongAnswerNote";

const WordList = ({ userId }: { userId: string }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isReviewed, setIsReviewed] = useState<"미완료" | "완료">("미완료");
  const [playingQuestionId, setPlayingQuestionId] = useState<number | null>(null);

  const {
    data: userAnswers,
    error: userAnswersError,
    isLoading: userAnswersLoading
  } = useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: () => fetchUserWrongAnswers(userId),
    staleTime: 0
  });

  const {
    data: questions,
    error: questionsError,
    isLoading: questionsLoading
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchWordQuestions(),
    staleTime: 0
  });

  const updateIsReviewed = useMutation({
    mutationFn: async ({ answerId, currentReviewed }: { answerId: number; currentReviewed: boolean }) => {
      const { error } = await supabase.from("user_answer").update({ is_reviewed: !currentReviewed }).eq("id", answerId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAnswers", userId] });
    }
  });

  if (userAnswersLoading || questionsLoading) return <p>로딩중입니다...</p>;
  if (userAnswersError) return <p>{userAnswersError.message}</p>;
  if (questionsError) return <p>{questionsError.message}</p>;

  const filteredAnswers = userAnswers
    ?.filter((answer) => (isReviewed === "미완료" ? !answer.is_reviewed : answer.is_reviewed))
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? { ...matchedQuestion, answerId: answer.id, isReviewed: answer.is_reviewed } : null;
    })
    .filter((item) => item !== null);

  // 텍스트를 음성으로 변환하는 함수
  const handleTextToSpeech = async (text: string, questionId: number) => {
    if (!text || playingQuestionId === questionId) return;

    try {
      // 이전 재생 중인 오디오가 있다면 중지
      if (playingQuestionId) {
        const prevAudio = document.getElementById(`audio-${playingQuestionId}`) as HTMLAudioElement;
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
      }

      // 음성 데이터를 Base64 형식으로 받아오기
      const base64Audio = await convertTextToSpeech(text);

      // Base64 문자열을 Blob 객체로 변환
      const byteCharacters = atob(base64Audio); // Base64를 디코딩
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

      // 새 오디오 엘리먼트 생성 및 재생
      const audio = new Audio(URL.createObjectURL(blob));
      audio.id = `audio-${questionId}`;

      audio.onplay = () => setPlayingQuestionId(questionId);
      audio.onended = () => {
        setPlayingQuestionId(null);
        URL.revokeObjectURL(audio.src);
      };

      document.body.appendChild(audio);
      await audio.play();
    } catch (error) {
      console.error("텍스트 변환 오류:", error);
      setPlayingQuestionId(null);
    }
  };

  return (
    <div>
      <div className="bg-gray-900 flex my-4 rounded-[22px] w-[343px] h-[46px] p-2.5 justify-center items-center">
        <button
          className={`${
            isReviewed === "미완료"
              ? "w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-700 text-primary-200"
              : "bg-gray-900 text-gray-600 w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("미완료")}
        >
          <Typography size={16} weight="medium">
            미완료
          </Typography>
        </button>
        <button
          className={`${
            isReviewed === "완료"
              ? "w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-700 text-primary-200"
              : "bg-gray-900 text-gray-600 w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("완료")}
        >
          <Typography size={16} weight="medium">
            완료
          </Typography>
        </button>
      </div>

      {filteredAnswers?.map((question) => (
        <div
          key={question!.id}
          className={`w-full h-auto mb-[10px] px-5 py-[18px] bg-white rounded-[10px] shadow-review ${
            question!.isReviewed ? "border border-primary-500" : ""
          }`}
        >
          <div className="flex items-center justify-between h-auto">
            <button
              onClick={() => handleTextToSpeech(question?.content || "", question!.id)}
              className="flex-1 flex gap-[30px] items-center"
            >
              <div className="flex gap-[10px] items-center">
                <Image src={speaker} alt="speaker icon" />
                <Typography
                  size={14}
                  weight="bold"
                  className="w-[100px] text-left text-#000 break-words whitespace-pre-wrap"
                >
                  {question?.content}
                </Typography>
              </div>
              <Typography size={14} weight="medium" className="text-left text-#000 break-words">
                {question?.reason}
              </Typography>
            </button>
            <button
              onClick={() =>
                updateIsReviewed.mutate({
                  answerId: question!.answerId,
                  currentReviewed: question!.isReviewed
                })
              }
              className="flex-shrink-0 ml-4 w-6"
            >
              <div className="flex-none">
                <Image src={question!.isReviewed ? activeCheck : noActiveCheck} alt="status icon" className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WordList;
