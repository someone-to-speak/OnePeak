"use client";

import Agreement from "@/components/Agreement";
import React, { useState } from "react";

const lessonPage = () => {
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");

  const isSelected = language1 && language2;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSelected) {
      console.log("Form Submitted:", { language1, language2 });
    }
  };

  return (
    <>
      <h1>언어수업</h1>
      <div>
        <p>
          녹음 설명 <br />
          언어수업 방식 설명
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex">
          <div className="flex flex-col">
            <label>1 사용 언어</label>
            <select value={language1} onChange={(e) => setLanguage1(e.target.value)}>
              <option value="">-- 첫 번째로 시작할 언어 선택 --</option>
              <option value="English">영어</option>
              <option value="Korean">한국어</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>2 사용 언어</label>
            <select value={language2} onChange={(e) => setLanguage2(e.target.value)}>
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

export default lessonPage;
