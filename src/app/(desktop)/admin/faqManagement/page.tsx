"use client";
import { getFaqs } from "@/api/supabase/admin";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const FaqPage = () => {
  const { data } = useQuery({
    queryKey: ["faqData"],
    queryFn: () => getFaqs()
  });
  console.log("data", data);

  return <div>page</div>;
};

export default FaqPage;
