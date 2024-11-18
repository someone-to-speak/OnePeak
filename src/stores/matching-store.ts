import { createStore } from "zustand/vanilla";

export type MatchingState = {
  isMatching: boolean;
};

export type MatchingActions = {
  setIsMatching: (isMatching: boolean) => void;
};

export type MatchingStore = MatchingState & MatchingActions;

export const defaultInitState: MatchingState = {
  isMatching: false
};

export const createMatchingStore = (initState: MatchingState = defaultInitState) => {
  return createStore<MatchingStore>()((set) => ({
    ...initState,
    setIsMatching: (isMatching: boolean) => set(() => ({ isMatching }))
  }));
};
