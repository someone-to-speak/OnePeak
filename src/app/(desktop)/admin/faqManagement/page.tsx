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

  // 문의내역 가져오기
  const { data, isLoading, isError } = useQuery<FaqData[] | undefined>({
    queryKey: ["faqData"],
    queryFn: getFaqs
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
    <div>
      <FaqTable currentFaqs={currentFaqs} indexOfFirstFaq={indexOfFirstFaq} />
      <PageNationUI handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} data={data} />
    </div>
  );
};

export default FaqPage;
