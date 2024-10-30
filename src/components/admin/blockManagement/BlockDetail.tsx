"use client";
import { getBlockDetail } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const BlockDetail = () => {
  const { data = [] } = useQuery({
    queryKey: ["blockDetail"],
    queryFn: () => getBlockDetail()
  });
  console.log("data", data);

  return <div>a</div>;
};

export default BlockDetail;
