"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../../../../../../database.types";
import { getTargetFaqData, insertComment } from "@/api/supabase/admin";
import { useState } from "react";

export type Props = {
  params: {
    faqId: string;
  };
};
type faqDetail = Tables<"faq">;

const FaqDetailPage = ({ params }: Props) => {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState<string>("");

  const { data }: { data: faqDetail } = useQuery({
    queryKey: ["faqDetail", params.faqId],
    queryFn: () => {
      if (!params.faqId) {
        throw new Error("id가 필요합니다");
      }
      return getTargetFaqData(params.faqId);
    }
  });
  console.log(data);

  const { mutate } = useMutation({
    mutationFn: ({ answer, faqId }: { answer: string; faqId: string }) => insertComment({ answer, faqId }),
    onSuccess: () => {
      alert("답변을 추가하였습니다");
      queryClient.invalidateQueries({ queryKey: ["faqDetail", params.faqId] });
    }
  });

  // data가 undefined가 아니면 밑에 return을 실행해라는 의미
  if (!data) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ answer, faqId: params.faqId });
    setAnswer("");
  };
  return (
    <div>
      <p>문의자ID: {data.user_id}</p>
      <p>문의자NICKNAME: {data.user_nickname}</p>
      <p>문의날짜: {new Date(data.created_at).toLocaleDateString()}</p>
      <p>카테고리: {data.category}</p>
      <p>문의내용: {data.content}</p>
      <p>딥변내용: {data.comment}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          placeholder="답변을 작성해주세요"
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
        />
        <button>답변 제출</button>
      </form>
    </div>
  );
};

export default FaqDetailPage;
