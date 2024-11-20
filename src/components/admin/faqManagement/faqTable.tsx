import React from "react";
import { Tables } from "../../../../database.types";
import Link from "next/link";

type FaqData = Tables<"faq">;

interface UsersTableProps {
  currentFaqs: FaqData[];
  indexOfFirstFaq: number;
}

const FaqTable: React.FC<UsersTableProps> = ({ currentFaqs, indexOfFirstFaq }) => {
  return (
    <div className="w-full text-center">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-gray-800 text-black">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">유저ID</th>
            <th className="p-3">닉네임</th>
            <th className="p-3">작성날짜</th>
            <th className="p-3">카테고리</th>
            <th className="p-3">답변여부</th>
            <th className="p-3">문의내역</th>
          </tr>
        </thead>
        <tbody>
          {currentFaqs.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-3 text-gray-500">
                등록된 문의가 없습니다
              </td>
            </tr>
          ) : (
            currentFaqs.map((faq, index) => (
              <tr key={faq.id} className="border-b hover:bg-gray-900">
                <td className="p-3">{indexOfFirstFaq + index + 1}</td>
                <td className="p-3 max-w-[150px] text-ellipsis overflow-hidden">{faq.user_id}</td>
                <td className="p-3 max-w-[200px] text-ellipsis overflow-hidden">{faq.user_nickname}</td>
                <td className="p-3">{new Date(faq.created_at).toLocaleDateString()}</td>
                <td className="p-3">{faq.category}</td>
                <td className="p-3">{faq.comment ? "Y" : "N"}</td>
                <td className="p-3">
                  <Link href={`faqManagement/${faq.id}`}>
                    <button>내역확인</button>{" "}
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FaqTable;
