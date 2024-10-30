"use client";

import Agreement from "@/components/lessonPage/Agreement";
import { EmblaCarousel } from "@/components/lessonPage/EmblaCarousel";
import { useUserInfoForMatching } from "@/hooks/getUser/getUser";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";

const LessonPage = () => {
  const [firstLanguage, setfirstLanguage] = useState("");
  const [secondLanguage, setsecondLanguage] = useState("");

  const { data: userInfo } = useUserInfoForMatching();
  const machingChannelRef = useRef<RealtimeChannel | null>(null);

  const handleMatching = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const supabase = createClient();

    const { data: existingQueue } = await supabase
      .from("matches")
      .select("*")
      .eq("user_id", userInfo?.id)
      .is("match_id", null);

    // 기존 대기열에 없을 때만 추가
    if (!existingQueue || existingQueue.length === 0) {
      await supabase.from("matches").insert({
        user_id: userInfo?.id,
        match_id: null,
        my_language: userInfo?.my_language,
        learn_language: userInfo?.learn_language
      });
    }

    const matchingChannel = supabase
      .channel("matches")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
        console.log("payload: ", payload);
      })
      .subscribe();
  };

  const isSelected = firstLanguage && secondLanguage;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSelected) {
      console.log("Form Submitted:", { firstLanguage, secondLanguage });
    }
  };

  return (
    <>
      <h1>언어수업</h1>
      <EmblaCarousel />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex">
          <div className="flex flex-col">
            <label>1 사용 언어</label>
            <select value={firstLanguage} onChange={(e) => setfirstLanguage(e.target.value)}>
              <option value="">-- 첫 번째로 시작할 언어 선택 --</option>
              <option value="English">영어</option>
              <option value="Korean">한국어</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>2 사용 언어</label>
            <select value={secondLanguage} onChange={(e) => setsecondLanguage(e.target.value)}>
              <option value="">-- 두 번째로 시작할 언어 선택 --</option>
              <option value="English">영어</option>
              <option value="Korean">한국어</option>
            </select>
          </div>
        </div>
        <Agreement />
        <button>시작하기</button>
      </form>
      <button onClick={handleMatching}>매칭하기</button>
    </>
  );
};

export default LessonPage;
