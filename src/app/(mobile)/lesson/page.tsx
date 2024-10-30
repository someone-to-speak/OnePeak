"use client";

import Agreement from "@/components/lessonPage/Agreement";
import { EmblaCarousel } from "@/components/lessonPage/EmblaCarousel";
import { useUserInfoForMatching } from "@/hooks/getUser/getUser";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { match } from "assert";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LessonPage = () => {
  const [firstLanguage, setfirstLanguage] = useState("");
  const [secondLanguage, setsecondLanguage] = useState("");

  const router = useRouter();
  const { data: userInfo, isLoading, isError } = useUserInfoForMatching();
  const machingChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    return () => {
      machingChannelRef.current?.unsubscribe();
    };
  }, []);

  const handleMatching = async () => {
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

    const matchingChannel = supabase.channel("matches");
    machingChannelRef.current = matchingChannel;

    matchingChannel
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
        console.log("payload: ", payload);
        const { new: updatedMatchQueue } = payload;

        if (updatedMatchQueue.match_id === userInfo?.id) {
          router.push(`/chat?room=${updatedMatchQueue.roomId}`);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          console.log("Connected to signaling channel");

          const { data: matchQueue } = await supabase
            .from("matches")
            .select("*")
            .eq("match_id", null)
            .eq("my_language", userInfo?.learn_language)
            .neq("user_id", userInfo?.id);

          if (matchQueue && matchQueue.length > 0) {
            const matchPartner = matchQueue[0];
            const roomId = `${userInfo?.id}-${matchPartner.user_id as string}`;

            await supabase
              .from("matches")
              .update({ match_id: userInfo?.id, room_id: roomId })
              .eq("user_id", matchPartner.user_id);

            router.push(`/chat?room=${roomId}`);
          }
        }
      });
  };

  const isSelected = firstLanguage && secondLanguage;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSelected) {
      console.log("Form Submitted:", { firstLanguage, secondLanguage });
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>잠시만 기다려주세요...</p>
      </div>
    );
  }

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
