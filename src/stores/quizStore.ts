import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizState {
  currentStage: number;
  currentWordIndex: number;
  correctWords: string[];
  words: string[];
  nextWord: () => void;
  markCorrect: (word: string) => void;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set) => ({
      currentStage: 1,
      currentWordIndex: 0,
      correctWords: [],
      words: ["apple", "book", "desk", "pen", "note"], // MVP固定
      nextWord: () =>
        set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      markCorrect: (word) =>
        set((state) => ({ correctWords: [...state.correctWords, word] })),
    }),
    {
      name: "quiz-storage", // localStorage key
    }
  )
);
