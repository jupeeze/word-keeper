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
  nextStage: () => void;
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
      nextWord: () =>
        set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      markCorrect: (word) =>
        set((state) => ({ correctWords: [...state.correctWords, word] })),
      resetStage: () => set({ currentWordIndex: 0, correctWords: [] }),
      nextStage: () => {
        const { currentStage, wordsPerStage, resetStage } = get();
        if (currentStage < wordsPerStage.length) {
          set({ currentStage: currentStage + 1 });
        }
        resetStage();
      },
      getProgress: () => {
        const { currentWordIndex, wordsPerStage, currentStage } = get();
        const total = wordsPerStage[currentStage - 1].length;
        return (currentWordIndex / total) * 100;
      },
    }),
    { name: "quiz-storage" }
  )
);
