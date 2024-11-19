"use client";
import { getPrompt, updatePrompt } from "@/api/supabase/admin";
import { aiPromptGuidelines, fixedPrompt } from "@/constants/aiPrompt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const AiPromptManagementPage = () => {
  const queryClient = useQueryClient();
  const [newContent, setNewcontent] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["getPrompt", newContent],
    queryFn: () => getPrompt()
  });

  const { mutate } = useMutation({
    mutationFn: (newContent: string) => updatePrompt(newContent),
    onSuccess: () => {
      alert("변경되었습니다");
      queryClient.invalidateQueries({ queryKey: ["getPrompt", newContent] });
    }
  });

  // data가 변경될때만 content를 업데이트
  useEffect(() => {
    if (data) {
      setContent(data as string);
    }
  }, [data]);

  return (
    <div className="w-full gap-8 mx-auto p-6  flex">
      <div className="w-1/2">
        <h2 className="text-3xl font-semibold mb-4">AI-prompt 작성시 유의사항</h2>
        <div className="text-lg text-gray-700 space-y-4 mb-8 bg-gray-100 p-4 rounded-lg whitespace-pre-line">
          {aiPromptGuidelines}
        </div>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">고정 AI-prompt</h2>
        <div className="text-xl text-white bg-gray-50 p-4 rounded-lg mb-8">
          {fixedPrompt
            .split(".")
            .filter((sentence) => sentence.trim() !== "") // 빈 문장 제거
            .map((sentence, index) => (
              <p key={index} className="mb-2">
                {sentence.trim()}.
              </p>
            ))}
        </div>
        <h2 className="text-2xl font-semibold mb-4">현재 AI-prompt (변경가능)</h2>
        <div className="text-xl text-white bg-gray-50 p-4 rounded-lg mb-8">
          {content ? (
            content
              .split(".")
              .filter((sentence) => sentence.trim() !== "") // 빈 문장 제거
              .map((sentence, index) => (
                <p key={index} className="mb-2">
                  {sentence.trim()}.
                </p>
              ))
          ) : (
            <p>현재 AI-prompt가 없습니다.</p>
          )}
        </div>
        <h2 className="text-2xl font-semibold mb-4">변경할 AI-prompt</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(newContent);
            setContent(""); // 변경 후 내용 초기화
          }}
          className="space-y-4"
        >
          <textarea
            placeholder="새로운 AI-prompt를 작성해주세요"
            value={newContent}
            onChange={(e) => {
              setNewcontent(e.target.value);
            }}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            변경
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiPromptManagementPage;
