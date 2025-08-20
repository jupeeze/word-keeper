import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryState {
  collectedWords: string[];
  addWord: (word: string) => void;
}

export const useLibraryStore = create(
  persist<LibraryState>(
    (set, get) => ({
      collectedWords: [],
      addWord: (word) => {
        if (!get().collectedWords.includes(word)) {
          set({ collectedWords: [...get().collectedWords, word] });
        }
      },
    }),
    { name: "library-storage" }
  )
);
