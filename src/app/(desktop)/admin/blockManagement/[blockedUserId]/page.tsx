"use client";

export type Props = {
  params: {
    blockedUserId: string;
  };
};

import { getBlockDetail } from "@/api/route";
import { useQuery } from "@tanstack/react-query";
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
          <h2 className="font-semibold text-lg mb-2">피신고자 닉네임: {detail.user_info!.nickname}</h2>
          <p className="text-gray-700">신고자 ID: {detail.user_info_id}</p>
          <p className="text-gray-700">피신고자 ID: {detail.target_id}</p>
          {/* 이미지 */}
          <div className="my-2">
            {/* 여기에 이미지 컴포넌트를 추가할 수 있습니다. */}
            {/* <img
              src={detail.image_url}
              alt={detail.user_info.nickname}
              className="rounded-lg w-full h-32 object-cover"
            /> */}
          </div>
          <p className="text-gray-600">Reason: {detail.reason}</p>
          <p className="text-gray-500 text-sm">{new Date(detail.created_at!).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BlockDetail;
