"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type ScreenSizeStore, createScreenSizeStore } from "@/stores/screen-store";
import { createMatchingStore, type MatchingStore } from "@/stores/matching-store";

export type CombinedStoreApi = {
  screenSizeStore: ReturnType<typeof createScreenSizeStore>;
  matchingStore: ReturnType<typeof createMatchingStore>;
};

export const CombinedStoreContext = createContext<CombinedStoreApi | undefined>(undefined);

export interface CombinedStoreProviderProps {
  children: ReactNode;
}

export const CombinedStoreProvider = ({ children }: CombinedStoreProviderProps) => {
  const storesRef = useRef<CombinedStoreApi>();

  if (!storesRef.current) {
    storesRef.current = {
      screenSizeStore: createScreenSizeStore(),
      matchingStore: createMatchingStore()
    };
  }

  return <CombinedStoreContext.Provider value={storesRef.current}>{children}</CombinedStoreContext.Provider>;
};

export const useScreenSizeStore = <T,>(selector: (store: ScreenSizeStore) => T): T => {
  const combinedStore = useContext(CombinedStoreContext);

  if (!combinedStore) {
    throw new Error("useScreenSizeStore must be used within CombinedStoreProvider");
  }

  return useStore(combinedStore.screenSizeStore, selector);
};

export const useMatchingStore = <T,>(selector: (store: MatchingStore) => T): T => {
  const combinedStore = useContext(CombinedStoreContext);

  if (!combinedStore) {
    throw new Error("useMatchingStore must be used within CombinedStoreProvider");
  }

  return useStore(combinedStore.matchingStore, selector);
};
