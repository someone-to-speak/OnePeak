"use client";
import { insertFaqData } from "@/api/supabase/admin";
import { getUserClient } from "@/api/supabase/getUserClient";
import ChatModal from "@/components/ChatModal";
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Typography } from "@/components/ui/typography";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";

const FaqPage = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  //유저정보 불러와서 차단당한 사람이면 alert useEffect로 띄운다.
  // useEffect 초기 렌더링 되자마자 실행되니까
  // csr컴포넌트면 클라이언트에서 가져와야함
  // 탠스택으로 유저정보 가져오고 alert만 userEffect
  // 탠스택 쓰려면 쿼리키 같아야함

  const { data, isPending, isError } = useQuery({
    queryKey: ["targetUserInfo"],
    queryFn: () => getUserClient()
  });

  const { mutate } = useMutation({
    mutationFn: ({
      userId,
      userNickname,
      selectedType,
      content
    }: {
      userId: string;
      userNickname: string;
      selectedType: string;
      content: string;
    }) => insertFaqData(userId, userNickname, selectedType, content),
    onSuccess: () => {
      setIsModalOpen(true);

      queryClient.invalidateQueries({ queryKey: ["faqData"] });
    }
  });

  useEffect(() => {
    if (data?.is_blocked) {
      setIsModalOpen(true);
    }
  }, [data?.is_blocked]);

  const faqDataHandler = async () => {
    if (!selectedType) {
      setIsModalOpen(true);
    }
    if (!content) {
      return alert("사유를 작성해주세요");
    }

    const userId = data?.id as string;
    const userNickname = data?.nickname as string;

    mutate({ userId, userNickname, selectedType, content });
    setSelectedType("");
    setContent("");
  };

  if (isPending) {
    return (
      <div className="m-auto">
        <LoadingSpinner />;
      </div>
    );
  }
  if (isError) {
    return <div>사용자의 차단 여부를 확인하는데 실패하였습니다</div>;
  }
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-[70px]">
      <WithIconHeader title="1:1 문의하기" />
      <div className="flex flex-col w-[343px] mx-auto">
        <div className="flex flex-col gap-[30px] mb-[30px] md:w-full">
          <div>
            <Typography size={16} weight="bold" className="mb-[12px]">
              카테고리
            </Typography>
            <select
              value={selectedType}
              className="flex rounded border border-primary-500 w-full py-[12px] px-[20px]"
              onChange={(e) => {
                setSelectedType(e.target.value);
              }}
            >
              <option value="disabled">문의 유형 선택</option>
              <option value="inquiry">1:1 문의하기</option>
              <option value="unblockRequest">차단 해지 신청</option>
            </select>
          </div>
          <div>
            <Typography size={16} weight="bold" className="mb-[12px]">
              문의내용
            </Typography>
            <textarea
              className="flex p-[20px] w-full items-start rounded border border-primary-500 placeholder:text-[#a5a5a5] placeholder:text-[14px] placeholder:font-medium placeholder:font-['suit']"
              placeholder="사유를 작성해 주세요"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div className="w-full fixed bottom-[30px] md:static">
          <Button onClick={faqDataHandler} disabled={!selectedType || !content} text="확인"></Button>
        </div>
      </div>
      <ChatModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        title="알림"
        description="문의가 성공적으로 접수되었습니다."
        confirmButtonStyle="success"
        confirmText="확인"
        showCancel={false}
      />
    </div>
  );
};

export default FaqPage;
