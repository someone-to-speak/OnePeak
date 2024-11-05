"use client";

import { insertAlarmInfo } from "@/api/route";
import React, { useState } from "react";

const AlarmManagementPage = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const submitAlarm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedType === "") {
      return alert("알림 종류를 선택해주세요");
    }

    const isSuccess = await insertAlarmInfo(selectedType, title, content);
    if (isSuccess) {
      alert("알림이 전송되었습니다");
      setSelectedType("");
      setTitle("");
      setContent("");
    } else {
      alert("실패");
    }
  };
  return (
    <form onSubmit={submitAlarm} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">알림 전송</h2>
      <select value={selectedType} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
        <option value="">알림 종류</option>
        <option value="marketingMsg">마케팅 알람</option>
        <option value="noticeMsg">공지 알람</option>
      </select>
      <input
        type="text"
        placeholder="알림 제목을 적어주세요"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="알림 본문을 적어주세요"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        className="w-full p-2 mb-4 border rounded h-32"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        알림 전송
      </button>
    </form>
  );
};

export default AlarmManagementPage;
