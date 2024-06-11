import { create } from "zustand";

interface State {
  introDone: boolean;
  section: string;
  setSection: (section: string) => void;
  setIntroDone: (introDone: boolean) => void;
}

export const useStateStore = create<State>()((set) => ({
  introDone: true,
  section: 'home',

  setIntroDone: (introDone) => set({ introDone }),
  setSection: (section) => set({ section })
}));
