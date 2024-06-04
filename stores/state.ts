import { create } from "zustand";

interface State {
  introDone: boolean;
  setIntroDone : (isDone: boolean) => void;
}

export const useStateStore = create<State>()((set) => ({
  introDone : false,
  setIntroDone: (isDone) => set({ introDone: isDone }),
}));
