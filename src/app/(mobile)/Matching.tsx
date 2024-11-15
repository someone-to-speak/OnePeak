"use client";

import { Typography } from "@/components/ui/typography";
import { useMatchingStore } from "@/shared/StoreProvider";
import { useEffect } from "react";

const Matching = () => {
  const isMatching = useMatchingStore((state) => state.isMatching);
  const setIsMatching = useMatchingStore((state) => state.setIsMatching);

  useEffect(() => {
    if (isMatching) {
      console.log("매칭중");
    } else {
      console.log("매칭종료");
    }
  }, [isMatching]);

  if (isMatching) {
    return (
      <div className="fixed top-[30px] left-1/2 transform -translate-x-1/2 z-[300]">
        <button className="px-3 py-2 bg-white rounded-sm" onClick={() => setIsMatching(false)}>
          <Typography size={14} weight={"bold"}>
            매칭중
          </Typography>
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default Matching;
