"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type ScreenSizeStore, createScreenSizeStore } from "@/stores/screen-store";

export type ScreenSizeStoreApi = ReturnType<typeof createScreenSizeStore>;

export const ScreenSizeStoreContext = createContext<ScreenSizeStoreApi | undefined>(undefined);

export interface ScreenSizeStoreProviderProps {
  children: ReactNode;
}

export const ScreenSizeStoreProvider = ({ children }: ScreenSizeStoreProviderProps) => {
  const storeRef = useRef<ScreenSizeStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createScreenSizeStore();
  }

  return <ScreenSizeStoreContext.Provider value={storeRef.current}>{children}</ScreenSizeStoreContext.Provider>;
};

export const useScreenSizeStore = <T,>(selector: (store: ScreenSizeStore) => T): T => {
  const screenSizeStoreContext = useContext(ScreenSizeStoreContext);

  if (!screenSizeStoreContext) {
    throw new Error(`useScreenSizeStore must be used within ScreenSizeStoreProvider`);
  }

  return useStore(screenSizeStoreContext, selector);
};
