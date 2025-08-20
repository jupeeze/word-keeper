import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryState {
  collectedWords: string[];
  addWord: (word: string) => void;
}

export const useLibraryStore = create(
  persist<LibraryState>(
    (set) => ({
      collectedWords: [],
      addWord: (word) =>
        set((state) => ({ collectedWords: [...state.collectedWords, word] })),
    }),
    {
      name: "library-storage", // localStorage key
    }
  )
);
