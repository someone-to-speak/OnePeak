import { createStore } from "zustand/vanilla";

export type ScreenSizeState = {
  isLargeScreen: boolean;
};

export type ScreenSizeActions = {
  setIsLargeScreen: (isLargeScreen: boolean) => void;
};

export type ScreenSizeStore = ScreenSizeState & ScreenSizeActions;

export const defaultInitState: ScreenSizeState = {
  isLargeScreen: false
};

export const createScreenSizeStore = (initState: ScreenSizeState = defaultInitState) => {
  return createStore<ScreenSizeStore>()((set) => ({
    ...initState,
    setIsLargeScreen: (isLargeScreen: boolean) => set(() => ({ isLargeScreen }))
  }));
};
