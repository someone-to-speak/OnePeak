"use client";

import SpinnerButton from "@/components/ui/SpinnerButton";
import { useMatching } from "@/hooks/useMatching";
import { useEffect } from "react";

const Matching = () => {
  console.log("Matching");
  const { isMatching, setupMatchingChannel, cleanUp } = useMatching();
  console.log("isMatching: ", isMatching);
  useEffect(() => {
    if (isMatching) {
      setupMatchingChannel();
      console.log("매칭중");
    } else {
      cleanUp();
    }
  }, [isMatching, setupMatchingChannel, cleanUp]);

  if (isMatching) {
    return (
      <div
        className="
          fixed 
          bottom-0 
          right-0 
          pr-4
          pb-safe-offset-24
          md:top-[25%] md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 
          md:bottom-auto md:right-auto 
          z-[300]"
      >
        <SpinnerButton />
      </div>
    );
  } else {
    return null;
  }
};

export default Matching;
