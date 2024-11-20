"use client";
import { getFaqs } from "@/api/supabase/admin";

import React, { useState } from "react";
import { Tables } from "../../../../../database.types";
import { useQuery } from "@tanstack/react-query";
import FaqTable from "@/components/admin/faqManagement/faqTable";
import PageNationUI from "@/components/admin/PageNationUI";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type FaqData = Tables<"faq">;

const FaqPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState<string>("");

  // 문의내역 가져오기
  const { data, isLoading, isError } = useQuery<FaqData[] | undefined>({
    queryKey: ["faqData", type],
    queryFn: () => getFaqs(type)
  });

  if (isLoading)
    return (
      <div className="m-auto">
        <LoadingSpinner />;
      </div>
    );
  if (isError) return <div>문의 내역을 가져오는데 실패하였습니다</div>;

  if (!data) {
    return;
  }
  // 페이지네이션
  const faqsPerPage = 10;
  const totalPages = data ? Math.max(1, Math.ceil(data.length / faqsPerPage)) : 1;
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = data ? data.slice(indexOfFirstFaq, indexOfLastFaq) : [];

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center py-6 text-2xl gap-6 cursor-pointer">
        <p>정렬기준 선택:</p>
        <button onClick={() => setType("isAnswered")} className="border  rounded-md px-2 ">
          답변완료내역
        </button>
        <button onClick={() => setType("isNotAnswered")} className="border  rounded-md px-2 ">
          답변미완료내역
        </button>
        <button onClick={() => setType("")} className="border  rounded-md px-2 ">
          전체문의내역
        </button>
      </div>
      <FaqTable currentFaqs={currentFaqs} indexOfFirstFaq={indexOfFirstFaq} />
      <PageNationUI handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} data={data} />
    </div>
  );
};

export default FaqPage;
