import { getFaqs } from "@/api/route";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const FaqPage = () => {
  const { data } = useQuery({
    queryKey: ["faqData"],
    queryFn: () => getFaqs()
  });

  return <div>page</div>;
};

export default FaqPage;
