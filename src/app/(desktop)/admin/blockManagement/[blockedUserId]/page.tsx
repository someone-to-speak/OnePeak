"use client";

export type Props = {
  params: {
    blockedUserId: string;
  };
};

import { getBlockDetail } from "@/api/supabase/admin";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { blockDetail } from "@/type";

const BlockDetail = ({ params }: Props) => {
  const { data }: { data: blockDetail[] | undefined } = useQuery({
    queryKey: ["blockDetail", params.blockedUserId],
    queryFn: () => {
      if (!params.blockedUserId) {
        throw new Error("id가 필요합니다");
      }
      return getBlockDetail(params.blockedUserId);
    }
  });
  console.log("data", data);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((detail) => (
        <div
          key={detail.id}
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="font-semibold text-xl  mb-2">피신고자 닉네임: {detail.user_info.nickname}</h2>
          <p className="text-gray-300">피신고자 ID: {detail.target_id}</p>
          <p className="text-gray-300">신고자 ID: {detail.user_id}</p>
          <div className="grid grid-cols-2 gap-4 my-4">
            {detail.img_urls.map((imgUrl, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <Image
                  src={imgUrl}
                  alt="신고한 이유 사진파일"
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <p>Reason: {detail.reason}</p>
          <p className="text-gray-500 text-sm">{new Date(detail.created_at!).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BlockDetail;
