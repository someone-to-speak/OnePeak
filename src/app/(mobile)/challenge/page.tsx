"use client";

import { useEffect } from "react";

const ChallengePage = () => {
  useEffect(() => {
    getWordData();
  }, []);
  const getWordData = async () => {
    const data = await fetch(`/api/krdict`);
    const result = await data?.json();
    console.log("result", result);
    return result;
  };

  return <div>page</div>;
};

export default ChallengePage;
