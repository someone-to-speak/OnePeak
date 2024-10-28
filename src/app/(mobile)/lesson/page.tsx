"use client";

import Agreement from "@/components/lessonPage/Agreement";
import { EmblaCarousel } from "@/components/lessonPage/EmblaCarousel";
import React, { useState } from "react";

const LessonPage = () => {
  const [firstLanguage, setfirstLanguage] = useState("");
  const [secondLanguage, setsecondLanguage] = useState("");

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
    </>
  );
};

export default LessonPage;
