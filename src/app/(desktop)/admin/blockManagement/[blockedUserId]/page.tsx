"use client";

export type Props = {
  params: {
    blockedUserId: string;
  };
};

import { getBlockDetail } from "@/api/route";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const BlockDetail = ({ params }: Props) => {
  const { data = [] } = useQuery({
    queryKey: ["blockDetail", params.blockedUserId],
    queryFn: () => {
      if (!params.blockedUserId) {
        throw new Error("id가 필요합니다");
      }
      return getBlockDetail(params.blockedUserId);
    }
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((detail) => (
        <div key={detail.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">피신고자 닉네임: {detail.user_info![0].nickname}</h2>
          <p className="text-gray-700">신고자 ID: {detail.user_id}</p>
          <p className="text-gray-700">피신고자 ID: {detail.target_id}</p>

          <div className="my-2">
            {detail.img_urls.map((imgUrl) => {
              return (
                <Image src={imgUrl} alt="신고한 이유 사진파일" className="rounded-lg w-full h-32 object-cover"></Image>
              );
            })}
          </div>
          <p className="text-gray-600">Reason: {detail.reason}</p>
          <p className="text-gray-500 text-sm">{new Date(detail.created_at!).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BlockDetail;
