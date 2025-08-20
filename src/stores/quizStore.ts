import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizState {
  currentStage: number;
  currentWordIndex: number;
  correctWords: string[];
  wordsPerStage: string[][];
  nextWord: () => void;
  markCorrect: (word: string) => void;
  resetStage: () => void;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set, get) => ({
      currentStage: 1,
      currentWordIndex: 0,
      correctWords: [],
      wordsPerStage: [
        ["apple", "book", "desk", "pen", "note"],
        ["chair", "table", "lamp", "bag", "clock"],
      ],
      nextWord: () => {
        const { currentWordIndex, wordsPerStage, currentStage } = get();
        if (currentWordIndex + 1 < wordsPerStage[currentStage - 1].length) {
          set({ currentWordIndex: currentWordIndex + 1 });
        }
      },
      markCorrect: (word) =>
        set((state) => ({ correctWords: [...state.correctWords, word] })),
      resetStage: () => set({ currentWordIndex: 0, correctWords: [] }),
    }),
    { name: "quiz-storage" }
  )
);
