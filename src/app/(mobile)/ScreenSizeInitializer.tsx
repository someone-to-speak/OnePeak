"use client";

import { useScreenSizeStore } from "@/shared/StoreProvider";
import { useEffect } from "react";

const ScreenSizeInitializer = () => {
  const setIsLargeScreen = useScreenSizeStore((state) => state.setIsLargeScreen);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsLargeScreen]);

  return null;
};

export default ScreenSizeInitializer;
