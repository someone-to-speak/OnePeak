import React from "react";
import { BlockedUserInfo } from "@/type";
import { Tables } from "../../../database.types";

interface PageNationUIProps {
  handlePageChange: (pageNumber: number) => void;
  currentPage: number;
  totalPages: number;
  data: UserInfo[] | BlockedUserInfo[] | FaqData[];
}

type UserInfo = Tables<"user_info">;
type FaqData = Tables<"faq">;

const PageNationUI: React.FC<PageNationUIProps> = ({ handlePageChange, currentPage, totalPages, data }) => {
  return (
    <div>
      <div className=" flex items-center justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 text-white bg-gray-300 rounded hover:bg-gray-200 disabled:opacity-100"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        <div className="px-3 py-1 rounded ">
          {currentPage} / {totalPages}
        </div>

        <button
          className="px-3 py-1  text-white bg-gray-300 rounded hover:bg-gray-200 disabled:opacity-100"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
      <div className="text-center text-gray-600 mt-2">
        총 {data?.length}개, 총 {totalPages}페이지
      </div>
    </div>
  );
};

export default PageNationUI;
