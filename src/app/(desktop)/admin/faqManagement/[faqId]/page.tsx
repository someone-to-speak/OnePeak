"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../../../../../../database.types";
import { getTargetFaqData, insertComment } from "@/api/supabase/admin";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export type Props = {
  params: {
    faqId: string;
  };
};
type faqDetail = Tables<"faq">;

const FaqDetailPage = ({ params }: Props) => {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState<string>("");

  const { data }: { data: faqDetail | undefined } = useQuery({
    queryKey: ["faqDetail", params.faqId],
    queryFn: () => {
      if (!params.faqId) {
        throw new Error("id가 필요합니다");
      }
      return getTargetFaqData(params.faqId);
    }
  });

  // comment 업데이트
  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ answer, faqId }: { answer: string; faqId: string }) => insertComment({ answer, faqId }),
    onSuccess: () => {
      alert("답변을 추가하였습니다");
      queryClient.invalidateQueries({ queryKey: ["faqDetail", params.faqId] });
    },
    onError: (error: Error) => {
      console.log(error);
    }
  });

  // data가 undefined일 경우 loading 표시
  if (!data) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) {
      return alert("답변을 작성해주세요");
    }
    mutate({ answer, faqId: params.faqId });
    setAnswer("");
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setAnswer("");
    mutate({ answer, faqId: params.faqId });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-4 text-red-500">문의 상세 정보를 불러오는데 실패하였습니다</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <p className="text-xl">문의자 ID: {data.user_id}</p>
      <p className="text-xl">문의자 NICKNAME: {data.user_nickname}</p>
      <p>문의 날짜: {new Date(data.created_at).toLocaleDateString()}</p>
      <p>카테고리: {data.category}</p>
      <p>문의 내용: {data.content}</p>
      <div className="flex space-x-4">
        <p>답변 내용: {data.comment || "답변이 없습니다."}</p>

        {data.comment && (
          <button
            onClick={handleDelete}
            className="bg-gray-500 text-sm text-white px-1 rounded hover:bg-grey-600 focus:outline-none"
          >
            답변 삭제
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={answer}
          placeholder="답변을 작성해주세요"
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          답변 제출
        </button>
      </form>
    </div>
  );
};

export default FaqDetailPage;
