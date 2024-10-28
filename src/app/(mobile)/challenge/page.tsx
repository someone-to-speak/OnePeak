"use client";

import { useEffect } from "react";

const ChallengePage = () => {
  const getWordData = async () => {
    const data = await fetch(`/api/stdict?query=바보`);
    const result = await data?.json();
    console.log("result", result);
    return result;
  };

  useEffect(() => {
    getWordData();
  }, []);

  return <div>page</div>;
};

export default ChallengePage;
