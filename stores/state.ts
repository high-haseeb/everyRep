import { create } from "zustand";

interface State {
  introDone: boolean;
  section: string;
  setSection: (section: string) => void;
  setIntroDone : (isDone: boolean) => void;
}

export const useStateStore = create<State>()((set) => ({
  introDone : false,
  section: 'home',

  setIntroDone: (isDone) => set({ introDone: isDone }),
  setSection: (section) => set({ section })
}));
