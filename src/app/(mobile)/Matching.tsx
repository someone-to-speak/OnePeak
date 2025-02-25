"use client";

import SpinnerButton from "@/components/ui/SpinnerButton";
import { useMatching } from "@/hooks/useMatching";
import { useScreenSizeStore } from "@/shared/StoreProvider";
import { useEffect } from "react";

const Matching = () => {
  const { isMatching, setupMatchingChannel, cleanUp } = useMatching();
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  const paddingRight = isLargeScreen ? "12px" : "16px";

  useEffect(() => {
    if (isMatching) {
      setupMatchingChannel();
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
          pb-safe-offset-24
          md:top-[80px]
          z-[300]"
        style={{ right: "calc((100% - clamp(314px, 100%, 1024px)) / 2)", paddingRight: paddingRight }}
      >
        <SpinnerButton />
      </div>
    );
  } else {
    return null;
  }
};

export default Matching;
